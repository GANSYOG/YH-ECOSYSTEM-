
import React, { useEffect, useRef, useState } from 'react';
import type { Agent, User } from '../types';
import { CloseIcon, InputIcon, OutputIcon, TriggerIcon, CheckCircleIcon, CopyIcon } from './Icons';
import { AgentBrainChat } from './AgentBrainChat';

interface AgentModalProps {
  agent: Agent;
  user: User | null;
  onClose: () => void;
  onOpenInteractiveDemo: (agent: Agent) => void;
  onCopyConfig: (agent: Agent) => void;
  initialView?: 'details' | 'chat';
}

type ModalView = 'details' | 'chat';

const TagList: React.FC<{ title: string; items: string[]; icon: React.ReactNode; color: string }> = ({ title, items, icon, color }) => {
  if (!items || items.length === 0) return null;
  return (
    <div className="mb-4">
      <h4 className="text-xs uppercase tracking-widest font-bold text-slate-500 mb-2 flex items-center gap-2">
        {icon}
        {title}
      </h4>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <span key={item} title={item} className={`text-xs px-3 py-1 rounded-md font-semibold border ${color}`}>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
};

const AgentModal: React.FC<AgentModalProps> = ({ agent, onClose, onCopyConfig, initialView = 'details' }) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const [view, setView] = useState<ModalView>(initialView === 'chat' ? 'chat' : 'details');

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    return (
        <div className="fixed inset-0 bg-dark-100/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fadeIn" onClick={onClose}>
            <div
                ref={modalRef}
                className="bg-light-100 dark:bg-dark-200 rounded-[2rem] border dark:border-dark-300 border-light-300 shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden relative"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Modal Glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-gradient-to-r from-transparent via-brand-primary to-transparent opacity-50" />

                <header className="flex items-start justify-between p-8 border-b dark:border-dark-300 border-light-300 relative z-10 bg-light-100/50 dark:bg-dark-200/50 backdrop-blur-md">
                    <div className="flex-1">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center text-white shadow-lg shadow-brand-primary/20">
                                <span className="text-xl font-black">{agent.name[0]}</span>
                            </div>
                            <div>
                                <div className="flex items-center gap-3">
                                    <h2 className="text-3xl font-black dark:text-white text-light-content tracking-tight">{agent.name}</h2>
                                    <button
                                        onClick={() => onCopyConfig(agent)}
                                        className="p-2 rounded-xl text-slate-400 hover:text-brand-primary hover:bg-brand-primary/10 transition-all active:scale-90"
                                        title="Copy Neural Signature"
                                    >
                                        <CopyIcon className="h-5 w-5" />
                                    </button>
                                </div>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-xs text-brand-secondary font-black uppercase tracking-[0.2em]">{agent.role}</span>
                                    <span className="h-1 w-1 rounded-full bg-slate-400" />
                                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{agent.id}</span>
                                    <span className="ml-2 text-[8px] bg-brand-primary/10 text-brand-primary px-2 py-0.5 rounded font-black tracking-widest border border-brand-primary/20">PHD LEVEL EXPERTISE</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-3 rounded-2xl hover:bg-red-500/10 hover:text-red-500 transition-all text-slate-500 active:scale-90">
                        <CloseIcon />
                    </button>
                </header>

                <div className="flex px-8 border-b dark:border-dark-300 border-light-300 bg-light-200/30 dark:bg-dark-100/30 overflow-x-auto custom-scrollbar gap-2">
                    <button 
                        onClick={() => setView('details')}
                        className={`px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all border-b-2 whitespace-nowrap ${view === 'details' ? 'border-brand-primary text-brand-primary' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-white'}`}
                    >
                        Neural Specifications
                    </button>
                    <button 
                        onClick={() => setView('chat')}
                        className={`px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all border-b-2 whitespace-nowrap ${view === 'chat' ? 'border-brand-primary text-brand-primary' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-white'}`}
                    >
                        Neural Link
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                    {view === 'details' && (
                        <div className="space-y-6 animate-fadeIn">
                            <section>
                                <h4 className="text-xs uppercase tracking-widest font-bold text-slate-500 mb-3">Primary Responsibilities</h4>
                                <ul className="space-y-3">
                                    {agent.responsibilities.map((resp, i) => (
                                        <li key={i} className="flex gap-3 text-sm dark:text-dark-content text-slate-600">
                                            <CheckCircleIcon className="h-5 w-5 text-brand-primary shrink-0 mt-0.5" />
                                            <span>{resp}</span>
                                        </li>
                                    ))}
                                </ul>
                            </section>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <TagList title="Inputs" items={agent.inputs} icon={<InputIcon />} color="bg-sky-500/10 text-sky-500 border-sky-500/20" />
                                <TagList title="Outputs" items={agent.outputs} icon={<OutputIcon />} color="bg-emerald-500/10 text-emerald-500 border-emerald-500/20" />
                            </div>

                            <TagList title="Triggers" items={agent.triggers} icon={<TriggerIcon />} color="bg-orange-500/10 text-orange-500 border-orange-500/20" />

                            {agent.runbook_summary && (
                                <section className="p-4 rounded-xl bg-light-200 dark:bg-dark-200/50 border dark:border-dark-300 border-light-300">
                                    <h4 className="text-xs uppercase tracking-widest font-bold text-slate-500 mb-2">Runbook Summary</h4>
                                    <p className="text-sm dark:text-dark-content text-slate-600 italic leading-relaxed">
                                        "{agent.runbook_summary}"
                                    </p>
                                </section>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 rounded-lg bg-light-300 dark:bg-dark-300 border dark:border-dark-300 border-light-300">
                                    <p className="text-[10px] uppercase font-bold text-slate-500">Operational SLA</p>
                                    <p className="text-sm font-bold dark:text-white">{agent.sla}</p>
                                </div>
                                <div className="p-3 rounded-lg bg-light-300 dark:bg-dark-300 border dark:border-dark-300 border-light-300">
                                    <p className="text-[10px] uppercase font-bold text-slate-500">Ownership</p>
                                    <p className="text-sm font-bold dark:text-white">{agent.owner || 'System Managed'}</p>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {view === 'chat' && <AgentBrainChat agent={agent} />}
                </div>

                <footer className="p-8 border-t dark:border-dark-300 border-light-300 flex justify-between items-center bg-light-200/50 dark:bg-dark-300/30 backdrop-blur-md">
                    <div className="flex items-center gap-4">
                       <div className="flex -space-x-2">
                          {[1,2,3].map(i => (
                             <div key={i} className="h-8 w-8 rounded-full border-2 border-white dark:border-dark-200 bg-slate-300 dark:bg-dark-400" />
                          ))}
                       </div>
                       <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Connected Nodes</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="px-8 py-3 rounded-2xl bg-gradient-to-r from-brand-primary to-brand-secondary text-white text-xs font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-brand-primary/20 active:scale-95"
                    >
                        Secure Neural Uplink
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default AgentModal;
