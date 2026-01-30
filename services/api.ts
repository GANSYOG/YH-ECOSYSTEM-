
import type { Agent, User } from '../types';

const API_BASE = 'http://localhost:3001/api';

export const login = async (email: string, _: string): Promise<User> => {
    // In a real app, this would be a POST to /auth/login
    return { email, role: 'ADMIN' };
};

export const register = async (email: string, _: string): Promise<User> => {
    return { email, role: 'ADMIN' };
};

export const fetchDivisions = async (): Promise<string[]> => {
    const res = await fetch(`${API_BASE}/divisions`);
    if (!res.ok) throw new Error('Failed to fetch divisions');
    return res.json();
};

export const fetchAgents = async (options: { divisions?: string[], searchQuery?: string, page?: number, limit?: number }): Promise<{ agents: Agent[], total: number }> => {
    const { divisions = [], searchQuery = '', page = 1, limit = 12 } = options;

    const params = new URLSearchParams();
    if (searchQuery) params.append('searchQuery', searchQuery);
    divisions.forEach(d => params.append('divisions', d));
    params.append('page', page.toString());
    params.append('limit', limit.toString());

    const res = await fetch(`${API_BASE}/agents?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch agents');
    return res.json();
};

export const createAgent = async (agent: Partial<Agent>): Promise<Agent> => {
    const res = await fetch(`${API_BASE}/agents`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(agent)
    });
    if (!res.ok) throw new Error('Failed to create agent');
    return res.json();
};

export const updateAgentConfig = async (user: User, id: string, config: Partial<Agent>): Promise<Agent> => {
    const res = await fetch(`${API_BASE}/agents/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
    });
    if (!res.ok) throw new Error('Failed to update agent');
    return res.json();
};

export const deleteAgent = async (id: string): Promise<void> => {
    const res = await fetch(`${API_BASE}/agents/${id}`, {
        method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete agent');
};

export const fetchLogs = async (): Promise<any[]> => {
    const res = await fetch(`${API_BASE}/logs`);
    if (!res.ok) throw new Error('Failed to fetch logs');
    return res.json();
};

export const fetchStats = async (): Promise<any> => {
    const res = await fetch(`${API_BASE}/stats`);
    if (!res.ok) throw new Error('Failed to fetch stats');
    return res.json();
};
