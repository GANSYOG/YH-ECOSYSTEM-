
import fs from 'fs';
import path from 'path';
import { ecosystemData } from './data/ecosystemData.ts';
import { Agent } from './types.ts';

const isAgentArray = (value: unknown): value is Agent[] => {
  return Array.isArray(value) && value.every(item => typeof item === 'object' && item !== null && 'id' in item);
};

const allAgents: Agent[] = [];

Object.entries(ecosystemData.divisions).forEach(([key, value]) => {
  if (isAgentArray(value)) {
    allAgents.push(...value);
  } else if (typeof value === 'object' && value !== null) {
    Object.entries(value).forEach(([_, subValue]) => {
      if (isAgentArray(subValue)) {
          allAgents.push(...subValue);
      }
    });
  }
});

// De-duplicate
const uniqueAgents = Array.from(new Map(allAgents.map(agent => [agent.id, agent])).values());

const DATA_DIR = path.join(process.cwd(), 'server/data');
const AGENTS_FILE = path.join(DATA_DIR, 'agents.json');

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);
fs.writeFileSync(AGENTS_FILE, JSON.stringify(uniqueAgents, null, 2));
console.log(`Seeded ${uniqueAgents.length} agents to ${AGENTS_FILE}`);
