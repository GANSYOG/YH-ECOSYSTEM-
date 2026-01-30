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
    <div className="group relative dark:bg-dark-200 bg-light-100 rounded-2xl border dark:border-dark-300 border-light-300 shadow-sm p-5 flex flex-col gap-4 transition-all duration-300 hover:shadow-2xl hover:shadow-brand-primary/10 hover:-translate-y-1 overflow-hidden">
      {/* Accent bar */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-accent transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />

      <header>
        <div className="flex justify-between items-start gap-2">
            <h3 className="text-lg font-bold dark:text-white text-light-content leading-tight group-hover:text-brand-primary transition-colors duration-300 line-clamp-1">{agent.name}</h3>
            <span className="text-[9px] bg-slate-100 dark:bg-dark-300 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-full uppercase font-black tracking-tighter shrink-0 border border-light-300 dark:border-dark-400">{agent.id}</span>
        </div>
        <div className="flex items-center gap-2 mt-1.5">
           <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
           <p className="text-[10px] text-brand-secondary font-black uppercase tracking-[0.1em]">{agent.role}</p>
           <span className="ml-auto text-[8px] bg-brand-primary/10 text-brand-primary px-1.5 py-0.5 rounded font-black tracking-widest border border-brand-primary/20">PHD</span>
        </div>
      </header>
      
      <div className="flex-1">
        <div className="space-y-2.5">
          {agent.responsibilities.slice(0, 2).map((resp, index) => (
            <div key={index} className="flex gap-2.5 items-start">
              <div className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-slate-300 dark:bg-dark-400" />
              <p className="text-xs dark:text-dark-content text-slate-600 line-clamp-2 leading-relaxed italic">
                {resp}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-4 border-t border-dashed dark:border-dark-300 border-light-300">
        <TagList title="Operational Inputs" items={agent.inputs.slice(0, 2)} icon={<InputIcon className="h-3 w-3" />} color="bg-brand-primary/5 text-brand-primary dark:text-brand-primary border-brand-primary/10" />
      </div>

      <footer className="flex justify-end items-center gap-2.5 pt-2">
        <button
          onClick={() => onGenerateConfig(agent)}
          className="p-2.5 rounded-xl bg-light-200 dark:bg-dark-300 text-slate-500 hover:text-brand-primary hover:bg-brand-primary/10 transition-all active:scale-90"
          title="Clone Identity"
        >
          <CopyIcon className="h-4 w-4" />
        </button>
        <button
          onClick={() => onViewDetails(agent)}
          className="flex-1 flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest text-white px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-primary to-brand-secondary hover:from-brand-secondary hover:to-brand-primary transition-all duration-300 shadow-lg shadow-brand-primary/25 group-hover:shadow-brand-secondary/30 active:scale-[0.98]"
        >
          <InfoIcon className="h-3.5 w-3.5" />
          <span>Access Brain</span>
        </button>
      </footer>
    </div>
  );
};

export default AgentCard;