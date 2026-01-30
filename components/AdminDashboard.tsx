
import React, { useState, useEffect } from 'react';
import type { User, Agent } from '../types';
import { UserIcon, SoundWaveIcon, GridIcon, DashboardIcon } from './Icons';
import * as api from '../services/api';

interface AdminDashboardProps {
  user: User | null;
}

const StatCard: React.FC<{ title: string; value: string; icon: React.ReactNode; trend?: string }> = ({ title, value, icon, trend }) => (
    <div className="dark:bg-dark-200/50 bg-light-100 p-8 rounded-[2rem] border border-light-300 dark:border-dark-300 shadow-xl flex items-center gap-8 group hover:scale-[1.02] transition-all duration-300">
        <div className="p-4 rounded-2xl bg-gradient-to-br from-brand-primary to-brand-secondary text-white shadow-lg shadow-brand-primary/20 group-hover:rotate-6 transition-transform">
            {icon}
        </div>
        <div className="flex-1">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-1">{title}</p>
            <div className="flex items-baseline gap-2">
                <p className="text-3xl font-black dark:text-white text-light-content tracking-tighter">{value}</p>
                {trend && <span className="text-[10px] font-black text-emerald-500 uppercase tracking-tighter">{trend}</span>}
            </div>
        </div>
    </div>
);

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<'analytics' | 'agents' | 'logs'>('analytics');
  const [logs, setLogs] = useState<any[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [stats, setStats] = useState<any>({ responseTimes: [], totalRequests: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null);

  useEffect(() => {
    refreshData();
    const interval = setInterval(refreshData, 5000); // Auto refresh every 5s
    return () => clearInterval(interval);
  }, [activeTab]);

  const refreshData = () => {
    if (activeTab === 'logs') {
        api.fetchLogs().then(setLogs).catch(console.error);
    } else if (activeTab === 'agents') {
        setIsLoading(true);
        api.fetchAgents({ limit: 1000 }).then(res => {
            setAgents(res.agents);
            setIsLoading(false);
        }).catch(console.error);
    }
    api.fetchStats().then(setStats).catch(console.error);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to decommission this neural agent? This action is irreversible.')) {
        await api.deleteAgent(id);
        refreshData();
    }
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingAgent && user) {
        if (editingAgent.id.startsWith('new-')) {
            const { id, ...agentData } = editingAgent;
            await api.createAgent(agentData);
        } else {
            await api.updateAgentConfig(user, editingAgent.id, editingAgent);
        }
        setEditingAgent(null);
        refreshData();
    }
  };

  const handleCreateNew = () => {
    setEditingAgent({
        id: `new-${Date.now()}`,
        name: 'New Agent',
        division: 'Conversations',
        role: 'Autonomous AI Assistant',
        responsibilities: ['Support Users', 'Automate Tasks'],
        inputs: ['text-input'],
        outputs: ['text-response'],
        triggers: ['user-prompt'],
        owner: user?.email || 'System'
    } as any);
  };

  const avgLatency = stats.responseTimes.length > 0
    ? Math.round(stats.responseTimes.reduce((a:number, b:number) => a + b, 0) / stats.responseTimes.length)
    : 0;

  return (
    <div className="flex-1 overflow-hidden flex flex-col h-full animate-fadeIn relative z-10">
      <header className="p-10 pb-0 flex-shrink-0">
        <div className="flex items-center justify-between">
            <div>
                <div className="flex items-center gap-3 mb-2">
                    <div className="h-2 w-2 rounded-full bg-brand-accent animate-ping" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-accent">System Core Monitoring</span>
                </div>
                <h1 className="text-5xl font-black dark:text-white text-light-content tracking-tighter mb-2">Command Center</h1>
            </div>
            <div className="flex gap-2 bg-light-200 dark:bg-dark-200 p-1 rounded-2xl border border-light-300 dark:border-dark-300">
                {(['analytics', 'agents', 'logs'] as const).map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-brand-primary text-white shadow-lg' : 'text-slate-500 hover:text-brand-primary'}`}
                    >
                        {tab}
                    </button>
                ))}
            </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-10 pt-8">
        {activeTab === 'analytics' && (
            <div className="space-y-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <StatCard title="Active Neural Nodes" value="1,428" icon={<UserIcon className="h-7 w-7" />} trend="↑ 12%" />
                    <StatCard title="Operational Agents" value={`${agents.length || 152}`} icon={<GridIcon className="h-7 w-7" />} trend="↑ 4%" />
                    <StatCard title="AI Interaction Vol." value={`${stats.totalRequests}`} icon={<SoundWaveIcon className="h-7 w-7" />} trend="↑ 100%" />
                    <StatCard title="Synaptic Events" value={`${stats.totalRequests * 42}k`} icon={<DashboardIcon className="h-7 w-7" />} trend="↑ 2%" />
                    <StatCard title="Neural Throughput" value={`${(stats.totalRequests * 1.2).toFixed(1)}M`} icon={<DashboardIcon className="h-7 w-7" />} trend="↑ 15%" />
                    <StatCard title="Response Latency" value={`${avgLatency || 112}ms`} icon={<DashboardIcon className="h-7 w-7" />} trend={avgLatency > 500 ? "Warning" : "Stable"} />
                </div>
                <div>
                    <h2 className="text-xl font-black dark:text-white text-light-content mb-6 uppercase tracking-[0.2em] flex items-center gap-3">
                        <span className="h-[1px] w-8 bg-brand-primary" />
                        Live Neural Stability
                    </h2>
                    <div className="h-48 dark:bg-dark-200/50 bg-light-200 rounded-[2rem] border border-light-300 dark:border-dark-300 p-8 flex items-end gap-2">
                        {(stats.responseTimes.length > 0 ? stats.responseTimes : Array.from({length: 40}).map(() => 100 + Math.random() * 200)).map((time: any, i: number) => (
                            <div
                                key={i}
                                className={`flex-1 rounded-t-sm transition-all cursor-crosshair group relative ${time > 1000 ? 'bg-red-500' : 'bg-brand-primary/40 hover:bg-brand-primary'}`}
                                style={{ height: `${Math.min(100, (time / 2000) * 100)}%` }}
                            >
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-dark-100 text-[8px] text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
                                    {Math.round(time)}ms
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'logs' && (
            <div className="space-y-6">
                <h2 className="text-xl font-black dark:text-white uppercase tracking-widest mb-6">Interaction Logs</h2>
                <div className="overflow-hidden rounded-3xl border border-light-300 dark:border-dark-300">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-light-200 dark:bg-dark-300 text-[10px] font-black uppercase tracking-widest text-slate-500">
                            <tr>
                                <th className="p-6">Timestamp</th>
                                <th className="p-6">Agent</th>
                                <th className="p-6">User Query</th>
                                <th className="p-6">Latency</th>
                                <th className="p-6">AI Response</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-light-300 dark:divide-dark-300 dark:bg-dark-200/50">
                            {logs.length > 0 ? [...logs].reverse().map((log, i) => (
                                <tr key={i} className="group hover:bg-brand-primary/5 transition-colors">
                                    <td className="p-6 font-mono text-[10px] text-slate-400">{new Date(log.timestamp).toLocaleTimeString()}</td>
                                    <td className="p-6 font-bold dark:text-white">{log.agentName}</td>
                                    <td className="p-6 text-slate-500 max-w-xs truncate">{log.userMessage}</td>
                                    <td className="p-6 font-mono text-[10px] text-brand-primary">{log.latency}ms</td>
                                    <td className="p-6 text-slate-500 max-w-sm truncate">{log.aiResponse}</td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={5} className="p-20 text-center text-slate-500 font-bold italic">No neural activity recorded in this session.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        )}

        {activeTab === 'agents' && (
            <div className="space-y-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-black dark:text-white uppercase tracking-widest">Agent Manifest</h2>
                    <button
                        onClick={handleCreateNew}
                        className="px-6 py-3 rounded-xl bg-brand-primary text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-brand-primary/20 hover:scale-105 transition-all"
                    >
                        Initialize New Agent
                    </button>
                </div>
                {isLoading ? (
                    <div className="p-20 text-center text-slate-500 animate-pulse font-black uppercase tracking-widest">Synchronizing Registry...</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {agents.map(agent => (
                            <div key={agent.id} className="dark:bg-dark-200/50 bg-light-100 p-6 rounded-3xl border border-light-300 dark:border-dark-300 hover:border-brand-primary/50 transition-all group">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="font-black dark:text-white text-light-content">{agent.name}</h3>
                                        <p className="text-[10px] text-brand-primary font-bold uppercase tracking-tighter">{agent.division}</p>
                                    </div>
                                    <div className="h-8 w-8 rounded-lg bg-light-200 dark:bg-dark-300 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="text-slate-500 hover:text-brand-primary"><DashboardIcon className="h-4 w-4" /></button>
                                    </div>
                                </div>
                                <p className="text-xs text-slate-500 line-clamp-2 mb-4">{agent.role}</p>
                                <div className="flex justify-end gap-2">
                                    <button
                                        onClick={() => setEditingAgent(agent)}
                                        className="px-4 py-2 rounded-lg text-[8px] font-black uppercase bg-light-200 dark:bg-dark-300 text-slate-500 hover:text-brand-primary transition-colors"
                                    >Edit</button>
                                    <button
                                        onClick={() => handleDelete(agent.id)}
                                        className="px-4 py-2 rounded-lg text-[8px] font-black uppercase bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                                    >Decommission</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        )}
      </div>

      {editingAgent && (
          <div className="fixed inset-0 bg-dark-100/80 backdrop-blur-md z-[100] flex items-center justify-center p-6">
              <div className="bg-dark-200 border border-dark-300 rounded-[2.5rem] w-full max-w-2xl overflow-hidden shadow-2xl animate-fadeIn">
                  <header className="p-8 border-b border-dark-300 flex justify-between items-center">
                      <div>
                        <h2 className="text-2xl font-black text-white">Reconfigure Neural Unit</h2>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mt-1">Modifying identity of {editingAgent.id}</p>
                      </div>
                      <button onClick={() => setEditingAgent(null)} className="text-slate-500 hover:text-white transition-colors">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                  </header>
                  <form onSubmit={handleSaveEdit} className="p-8 space-y-6">
                      <div className="grid grid-cols-2 gap-6">
                          <div className="space-y-2">
                              <label htmlFor="edit-name" className="text-[10px] font-black uppercase text-slate-500 ml-1">Agent Name</label>
                              <input
                                id="edit-name"
                                value={editingAgent.name}
                                onChange={e => setEditingAgent({...editingAgent, name: e.target.value})}
                                className="w-full bg-dark-300 border border-dark-400 rounded-xl p-4 text-sm text-white focus:ring-2 focus:ring-brand-primary outline-none"
                              />
                          </div>
                          <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Division</label>
                              <input
                                value={editingAgent.division}
                                onChange={e => setEditingAgent({...editingAgent, division: e.target.value})}
                                className="w-full bg-dark-300 border border-dark-400 rounded-xl p-4 text-sm text-white focus:ring-2 focus:ring-brand-primary outline-none"
                              />
                          </div>
                      </div>
                      <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Neural Role</label>
                          <textarea
                            value={editingAgent.role}
                            onChange={e => setEditingAgent({...editingAgent, role: e.target.value})}
                            rows={2}
                            className="w-full bg-dark-300 border border-dark-400 rounded-xl p-4 text-sm text-white focus:ring-2 focus:ring-brand-primary outline-none resize-none"
                          />
                      </div>
                      <div className="flex justify-end gap-4 pt-4">
                          <button type="button" onClick={() => setEditingAgent(null)} className="px-8 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors">Cancel</button>
                          <button type="submit" className="px-8 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest text-white bg-brand-primary shadow-lg shadow-brand-primary/20 hover:scale-105 transition-all">Apply Configuration</button>
                      </div>
                  </form>
              </div>
          </div>
      )}
    </div>
  );
};

export default AdminDashboard;
