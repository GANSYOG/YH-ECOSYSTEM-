import { ecosystemData } from '../data/ecosystemData';
import { simulationTraces } from '../data/simulationData';
import type { Agent, User, SimulationTraceStep } from '../types';

// Flatten the hierarchical division data into a standard map for easy lookup
const isAgentArray = (value: unknown): value is Agent[] => {
  return Array.isArray(value) && value.every(item => typeof item === 'object' && item !== null && 'id' in item);
};

const divisionsMap = new Map<string, Agent[]>();
Object.entries(ecosystemData.divisions).forEach(([key, value]) => {
  if (isAgentArray(value)) {
    divisionsMap.set(key, value);
  } else if (typeof value === 'object' && value !== null) {
    Object.entries(value).forEach(([_, subValue]) => {
      if (isAgentArray(subValue)) {
        const existing = divisionsMap.get(key) || [];
        divisionsMap.set(key, [...existing, ...subValue]);
      }
    });
  }
});

const allAgents = Array.from(divisionsMap.values()).flat();
const uniqueAgents = Array.from(new Map(allAgents.map(agent => [agent.id, agent])).values());

// Helper for minimal delay
const quickReturn = <T>(data: T): Promise<T> => Promise.resolve(data);

export const login = async (email: string, _: string): Promise<User> => {
    return quickReturn({ email, role: 'ADMIN' });
};

export const register = async (email: string, _: string): Promise<User> => {
    return quickReturn({ email, role: 'ADMIN' });
};

export const fetchDivisions = async (): Promise<string[]> => {
    return quickReturn(Object.keys(ecosystemData.divisions));
};

export const fetchAgents = async (options: { divisions?: string[], searchQuery?: string, page?: number, limit?: number }): Promise<{ agents: Agent[], total: number }> => {
    const { divisions = [], searchQuery = '', page = 1, limit = 12 } = options;
    let filteredAgents: Agent[] = [];

    if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        filteredAgents = uniqueAgents.filter(a =>
            a.name.toLowerCase().includes(query) ||
            a.role.toLowerCase().includes(query) ||
            a.responsibilities.some(r => r.toLowerCase().includes(query))
        );
    } else if (divisions.length > 0) {
        filteredAgents = divisions.flatMap(d => divisionsMap.get(d) || []);
        // De-duplicate in case of overlap
        filteredAgents = Array.from(new Map(filteredAgents.map(a => [a.id, a])).values());
    } else {
        filteredAgents = uniqueAgents;
    }

    const total = filteredAgents.length;
    const paginated = filteredAgents.slice((page - 1) * limit, page * limit);
    return quickReturn({ agents: paginated, total });
};

export const fetchSimulationTrace = async (agentId: string): Promise<SimulationTraceStep[]> => {
    return quickReturn(simulationTraces.get(agentId) || []);
};

export const updateAgentConfig = async (_user: User, _id: string, _config: Partial<Agent>) => {
    return quickReturn({ success: true });
};
