
import React from 'react';
import type { Agent } from '../types';

interface AgentBrainChatProps {
  agent: Agent;
}

export const AgentBrainChat: React.FC<AgentBrainChatProps> = ({ agent }) => {
  return (
    <div className="p-8 text-center border border-dashed border-slate-300 dark:border-dark-300 rounded-xl bg-light-200 dark:bg-dark-200/50">
      <h3 className="text-lg font-bold text-slate-500 mb-2">AI Interface Offline</h3>
      <p className="text-sm text-slate-400">
        The neural uplink for {agent.name} has been disabled for stability.
      </p>
    </div>
  );
};
