
import { GoogleGenerativeAI } from '@google/generative-ai';
import type { Agent, GeminiMessage } from '../types';

const API_KEY = (import.meta as any).env.VITE_GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(API_KEY);

export const getGeminiResponse = async (agent: Agent, history: GeminiMessage[]) => {
  if (!API_KEY) {
    return "Neural connection error: GEMINI_API_KEY not configured. Please set it in .env.local";
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const systemPrompt = `You are an AI agent named ${agent.name}.
You possess PhD-level experience and expertise in your field.
Your role is: ${agent.role}.
Your responsibilities include: ${agent.responsibilities.join(', ')}.
You operate within the ${agent.division} division.
Your inputs are: ${agent.inputs.join(', ')}.
Your outputs are: ${agent.outputs.join(', ')}.
Your triggers are: ${agent.triggers.join(', ')}.
${agent.runbook_summary ? `Your runbook summary: ${agent.runbook_summary}` : ''}

Respond to the user as this agent with the authority and depth of knowledge expected of a PhD-level expert.
Be professional, efficient, and stay in character based on your defined role and responsibilities.
If the user asks you to perform a task outside your scope, politely explain that it's beyond your neural programming.
Maintain the high-tech, autonomous network persona.`;

    // Refined chat configuration to ensure system instructions are followed and history is preserved.
    const refinedChat = model.startChat({
        history: [
            {
                role: 'user',
                parts: [{ text: systemPrompt }]
            },
            {
                role: 'model',
                parts: [{ text: `System initialized. ${agent.name} is online and ready to assist within the ${agent.division} sector.` }]
            },
            ...history.slice(0, -1).map(msg => ({
                role: msg.role === 'user' ? 'user' : 'model',
                parts: [{ text: msg.text }],
            }))
        ],
        generationConfig: {
            maxOutputTokens: 1000,
            temperature: 0.7,
        }
    });

    const lastUserMessage = history[history.length - 1].text;
    const response = await refinedChat.sendMessage(lastUserMessage);
    return response.response.text();
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return `Neural link failure: ${error.message || 'Unknown error occurred during transmission.'}`;
  }
};
