
export type Role = 'ADMIN' | 'DEVELOPER' | 'VIEWER';

export interface User {
  email: string;
  role: Role;
}

export interface Agent {
  id: string;
  name: string;
  division: string;
  role: string;
  responsibilities: string[];
  inputs: string[];
  outputs: string[];
  triggers: string[];
  runbook_summary?: string;
  sla: string;
  owner?: string;
}

export type DivisionData = { [key: string]: Agent[] | { [key: string]: Agent[] } };

export interface Ecosystem {
  ecosystem: string;
  version: string;
  generated_at: string;
  summary: {
    total_divisions: number;
    approx_total_agents: number;
    note: string;
  };
  divisions: DivisionData;
  notes: {
    how_to_consume: string;
    next_steps_suggestions: string[];
  };
}

export interface SimulationTraceStep {
  timestamp: string;
  title: string;
  payload: Record<string, any>;
}
