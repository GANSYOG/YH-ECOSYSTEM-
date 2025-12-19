
import React, { useEffect, useRef, useState } from 'react';
import type { Agent, User } from '../types';
import { CloseIcon, InputIcon, OutputIcon, TriggerIcon, CheckCircleIcon, CopyIcon } from './Icons';
import SimulationTraceViewer from './SimulationTraceViewer';
import { VoiceDemo } from './VoiceDemo';

interface AgentModalProps {
  agent: Agent;
  user: User | null;
  onClose: () => void;
  onOpenInteractiveDemo: (agent: Agent) => void;
  onCopyConfig: (agent: Agent) => void;
}

type ModalView = 'details' | 'simulation';

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

// Fix for line 6 in App.tsx: Complete component implementation and add default export
const AgentModal: React.FC<AgentModalProps> = ({ agent, onClose, onCopyConfig }) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const [view, setView] = useState<ModalView>('details');

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);
    
    return (
        <div className="fixed inset-0 bg-dark-100/90 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn" onClick={onClose}>
            <div
                ref={modalRef}
                className="bg-light-100 dark:bg-dark-200 rounded-2xl border dark:border-dark-300 border-light-300 shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                <header className="flex items-start justify-between p-6 border-b dark:border-dark-300 border-light-300">
                    <div className="flex-1">
                        <div className="flex items-center gap-3">
                            <h2 className="text-2xl font-bold dark:text-white text-light-content">{agent.name}</h2>
                            <button
                                onClick={() => onCopyConfig(agent)}
                                className="p-1 rounded-md text-slate-400 hover:text-brand-primary transition-colors"
                                title="Copy Configuration"
                            >
                                <CopyIcon className="h-5 w-5" />
                            </button>
                        </div>
                        <p className="text-sm text-brand-secondary font-bold uppercase tracking-wider mt-1">{agent.role}</p>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-light-300 dark:hover:bg-dark-300 transition-colors text-slate-500">
                        <CloseIcon />
                    </button>
                </header>

                <div className="flex border-b dark:border-dark-300 border-light-300">
                    <button 
                        onClick={() => setView('details')}
                        className={`px-6 py-3 text-sm font-bold transition-colors border-b-2 ${view === 'details' ? 'border-brand-primary text-brand-primary' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-white'}`}
                    >
                        Unit Specs
                    </button>
                    <button 
                        onClick={() => setView('simulation')}
                        className={`px-6 py-3 text-sm font-bold transition-colors border-b-2 ${view === 'simulation' ? 'border-brand-primary text-brand-primary' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-white'}`}
                    >
                        Simulation Trace
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                    {view === 'details' ? (
                        <div className="space-y-6">
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
                    ) : (
                        <SimulationTraceViewer agentId={agent.id} />
                    )}
                </div>

                <footer className="p-6 border-t dark:border-dark-300 border-light-300 flex justify-between items-center bg-light-200 dark:bg-dark-300/30">
                    <VoiceDemo agent={agent} />
                    <button
                        onClick={onClose}
                        className="px-6 py-2 rounded-lg bg-brand-primary text-white text-sm font-bold hover:bg-sky-400 transition-colors shadow-lg shadow-brand-primary/20"
                    >
                        Close Inspector
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default AgentModal;
