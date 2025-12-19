import React from 'react';
import type { Agent } from '../types';
import { InputIcon, CopyIcon, InfoIcon } from './Icons';

interface AgentCardProps {
  agent: Agent;
  onViewDetails: (agent: Agent) => void;
  onGenerateConfig: (agent: Agent) => void;
  onOpenInteractiveDemo: (agent: Agent) => void;
}

const TagList: React.FC<{ title: string; items: string[]; icon: React.ReactNode; color: string }> = ({ title, items, icon, color }) => {
    if (items.length === 0) return null;
    return (
        <div>
            <h4 className="text-[10px] uppercase tracking-widest font-bold text-slate-500 mb-1.5 flex items-center gap-1.5">
                {icon}
                {title}
            </h4>
            <div className="flex flex-wrap gap-1.5">
                {items.map((item) => (
                    <span key={item} title={item} className={`text-[10px] px-2 py-0.5 rounded-md font-medium border border-transparent ${color}`}>
                        {item}
                    </span>
                ))}
            </div>
        </div>
    );
};

const AgentCard: React.FC<AgentCardProps> = ({ agent, onViewDetails, onGenerateConfig }) => {
  return (
    <div className="dark:bg-dark-200 bg-light-100 rounded-xl border dark:border-dark-300 border-light-300 shadow-sm p-5 flex flex-col gap-4 transition-all hover:shadow-xl hover:border-brand-primary/30 group">
      <header>
        <div className="flex justify-between items-start gap-2">
            <h3 className="text-lg font-bold dark:text-white text-light-content leading-tight group-hover:text-brand-primary transition-colors">{agent.name}</h3>
            <span className="text-[10px] bg-slate-200 dark:bg-dark-300 text-slate-500 px-1.5 py-0.5 rounded uppercase font-bold shrink-0">{agent.id}</span>
        </div>
        <p className="text-xs text-brand-secondary font-bold uppercase tracking-wider mt-1">{agent.role}</p>
      </header>
      
      <div className="flex-1">
        <ul className="space-y-2">
          {agent.responsibilities.slice(0, 2).map((resp, index) => (
            <li key={index} className="text-xs dark:text-dark-content text-slate-600 line-clamp-2">
              <span className="inline-block w-1 h-1 rounded-full bg-brand-primary mr-2 mb-0.5"></span>
              {resp}
            </li>
          ))}
        </ul>
      </div>

      <div className="space-y-3 pt-4 border-t dark:border-dark-300 border-light-200">
        <TagList title="Inputs" items={agent.inputs.slice(0, 2)} icon={<InputIcon />} color="bg-sky-500/10 text-sky-500 border-sky-500/20" />
      </div>

      <footer className="flex justify-end items-center gap-2 pt-2">
        <button
          onClick={() => onGenerateConfig(agent)}
          className="p-2 rounded-lg bg-light-300 dark:bg-dark-300 text-slate-500 hover:text-brand-primary hover:bg-brand-primary/10 transition-all"
          title="Copy Manifest"
        >
          <CopyIcon />
        </button>
        <button
          onClick={() => onViewDetails(agent)}
          className="flex-1 flex items-center justify-center gap-2 text-xs font-bold text-white px-4 py-2 rounded-lg bg-brand-primary hover:bg-sky-400 transition-all shadow-lg shadow-brand-primary/20"
        >
          <InfoIcon className="h-3.5 w-3.5" />
          <span>Inspect Unit</span>
        </button>
      </footer>
    </div>
  );
};

export default AgentCard;