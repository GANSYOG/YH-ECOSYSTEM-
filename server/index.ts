
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const DATA_DIR = path.join(process.cwd(), 'server/data');
const AGENTS_FILE = path.join(DATA_DIR, 'agents.json');
const LOGS_FILE = path.join(DATA_DIR, 'logs.json');
const STATS_FILE = path.join(DATA_DIR, 'stats.json');

app.use(cors());
app.use(bodyParser.json());

// Initialize Data
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);

const getAgents = () => {
    if (!fs.existsSync(AGENTS_FILE)) return [];
    return JSON.parse(fs.readFileSync(AGENTS_FILE, 'utf-8'));
};

const saveAgents = (agents: any[]) => {
    fs.writeFileSync(AGENTS_FILE, JSON.stringify(agents, null, 2));
};

const getStats = () => {
    if (!fs.existsSync(STATS_FILE)) return { responseTimes: [], totalRequests: 0 };
    return JSON.parse(fs.readFileSync(STATS_FILE, 'utf-8'));
};

const updateStats = (responseTime: number) => {
    const stats = getStats();
    stats.responseTimes.push(responseTime);
    if (stats.responseTimes.length > 50) stats.responseTimes.shift();
    stats.totalRequests += 1;
    fs.writeFileSync(STATS_FILE, JSON.stringify(stats, null, 2));
};

// --- Agent Routes ---
app.get('/api/agents', (req, res) => {
    const { divisions, searchQuery, page = '1', limit = '12' } = req.query as any;
    let agents = getAgents();

    if (searchQuery) {
        const query = searchQuery.toLowerCase();
        agents = agents.filter((a: any) =>
            a.name.toLowerCase().includes(query) ||
            a.role.toLowerCase().includes(query) ||
            a.responsibilities.some((r: string) => r.toLowerCase().includes(query))
        );
    } else if (divisions) {
        const divList = Array.isArray(divisions) ? divisions : [divisions];
        agents = agents.filter((a: any) => divList.includes(a.division));
    }

    const total = agents.length;
    const p = parseInt(page);
    const l = parseInt(limit);
    const paginated = agents.slice((p - 1) * l, p * l);

    res.json({ agents: paginated, total });
});

app.get('/api/divisions', (req, res) => {
    const agents = getAgents();
    const divisions = Array.from(new Set(agents.map((a: any) => a.division)));
    res.json(divisions);
});

app.post('/api/agents', (req, res) => {
    const agents = getAgents();
    const newAgent = { ...req.body, id: req.body.id || `agent-${Date.now()}` };
    agents.push(newAgent);
    saveAgents(agents);
    res.json(newAgent);
});

app.put('/api/agents/:id', (req, res) => {
    const { id } = req.params;
    let agents = getAgents();
    const index = agents.findIndex((a: any) => a.id === id);
    if (index !== -1) {
        agents[index] = { ...agents[index], ...req.body };
        saveAgents(agents);
        res.json(agents[index]);
    } else {
        res.status(404).json({ error: 'Agent not found' });
    }
});

app.delete('/api/agents/:id', (req, res) => {
    const { id } = req.params;
    let agents = getAgents();
    agents = agents.filter((a: any) => a.id !== id);
    saveAgents(agents);
    res.sendStatus(204);
});

// --- AI Chat Route ---
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

app.post('/api/chat', async (req, res) => {
    const start = Date.now();
    const { agent, history } = req.body;

    if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ error: 'GEMINI_API_KEY not configured on server.' });
    }

    try {
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            generationConfig: { responseMimeType: "application/json" }
        });

        const systemPrompt = `You are a high-performance, PhD-level AI Agent named ${agent.name}.
ROLE: ${agent.role}
DIVISION: ${agent.division}
RESPONSIBILITIES: ${agent.responsibilities.join(', ')}

CORE DIRECTIVE: You do not just talk; you EXECUTE. For every request, you must determine if an action is required to fulfill your responsibilities.
You have access to the following SYNAPTIC TOOLS:
1. web_search(query): Simulate deep-web research.
2. generate_artifact(type, title, content): Create professional deliverables (Reports, Code, Marketing Plans, etc.).
3. analyze_data(dataset): Perform complex computations or data synthesis.

RESPONSE FORMAT: You must respond in the following JSON schema:
{
  "thought_process": "Your internal PhD-level reasoning",
  "actions": [
    { "tool": "tool_name", "input": "input_value", "status": "Executing..." }
  ],
  "response_text": "Your direct answer or explanation to the user",
  "artifacts": [
    { "type": "document|code|plan", "title": "Name of artifact", "content": "Full content of the work performed" }
  ]
}

Always stay in character as a ${agent.name}.
METHODOLOGY: You must use advanced frameworks relevant to your field (e.g., SWOT for marketing, MECE for analysis, SOLID for engineering).
If a task is within your responsibilities, use the generate_artifact tool to provide a complete, ready-to-use solution.
Your tone must be authoritative, precise, and highly professional.`;

        const chat = model.startChat({
            history: [
                { role: 'user', parts: [{ text: "Initialize System with the following prompt: " + systemPrompt }] },
                { role: 'model', parts: [{ text: JSON.stringify({ thought_process: "System initialized. Neural pathways active.", response_text: `Agent ${agent.name} is online and ready for deployment.`, actions: [], artifacts: [] }) }] },
                ...history.slice(0, -1).map((msg: any) => ({
                    role: msg.role === 'user' ? 'user' : 'model',
                    parts: [{ text: typeof msg.text === 'string' ? msg.text : JSON.stringify(msg.text) }],
                }))
            ]
        });

        const lastUserMessage = history[history.length - 1].text;
        const result = await chat.sendMessage(lastUserMessage);
        const responseJson = JSON.parse(result.response.text());
        const text = responseJson.response_text;
        const duration = Date.now() - start;
        updateStats(duration);

        // Log the interaction
        if (!fs.existsSync(LOGS_FILE)) fs.writeFileSync(LOGS_FILE, JSON.stringify([], null, 2));
        const logs = JSON.parse(fs.readFileSync(LOGS_FILE, 'utf-8'));
        logs.push({
            timestamp: new Date().toISOString(),
            agentId: agent.id,
            agentName: agent.name,
            userMessage: lastUserMessage,
            aiResponse: text,
            latency: duration
        });
        fs.writeFileSync(LOGS_FILE, JSON.stringify(logs.slice(-100), null, 2));

        res.json({ ...responseJson, text });
    } catch (error: any) {
        console.error("AI Error:", error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/logs', (req, res) => {
    if (!fs.existsSync(LOGS_FILE)) return res.json([]);
    const logs = JSON.parse(fs.readFileSync(LOGS_FILE, 'utf-8'));
    res.json(logs);
});

app.get('/api/stats', (req, res) => {
    res.json(getStats());
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
