import React from 'react';
import type { User } from '../types';
import { UserIcon, SoundWaveIcon, GridIcon, DashboardIcon } from './Icons';

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
  return (
    <div className="flex-1 overflow-y-auto p-10 animate-fadeIn relative z-10">
      <header className="mb-12">
        <div className="flex items-center gap-3 mb-2">
            <div className="h-2 w-2 rounded-full bg-brand-accent animate-ping" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-accent">System Core Monitoring</span>
        </div>
        <h1 className="text-5xl font-black dark:text-white text-light-content tracking-tighter mb-2">Network Analytics</h1>
        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs opacity-60">Authentication Verified: {user?.email || 'System'}</p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <StatCard title="Active Neural Nodes" value="1,428" icon={<UserIcon className="h-7 w-7" />} trend="↑ 12%" />
          <StatCard title="Operational Agents" value="193" icon={<GridIcon className="h-7 w-7" />} trend="↑ 4%" />
          <StatCard title="AI Interaction Vol." value="7,821" icon={<SoundWaveIcon className="h-7 w-7" />} trend="↑ 28%" />
          <StatCard title="Synaptic Events" value="512k" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} trend="↓ 2%" />
          <StatCard title="Neural Throughput" value="2.1M" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8 9l4-4 4 4m0 6l-4 4-4-4" /></svg>} trend="↑ 15%" />
          <StatCard title="Response Latency" value="112ms" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} trend="Stable" />
      </div>

       <div className="mt-12">
            <h2 className="text-xl font-black dark:text-white text-light-content mb-6 uppercase tracking-[0.2em] flex items-center gap-3">
                <span className="h-[1px] w-8 bg-brand-primary" />
                Live Feed Activity
            </h2>
            <div className="dark:bg-dark-200/50 bg-light-100 p-12 rounded-[3rem] border border-light-300 dark:border-dark-300 shadow-2xl flex flex-col items-center justify-center text-center">
                <div className="h-20 w-20 rounded-full bg-slate-200 dark:bg-dark-300 animate-pulse flex items-center justify-center mb-6">
                    <DashboardIcon className="h-8 w-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-bold dark:text-white mb-2">Synthesizing Real-time Data...</h3>
                <p className="text-slate-500 text-sm max-w-md mx-auto leading-relaxed">The ecosystem monitoring engine is currently aggregating global telemetry from all active neural nodes. Visualizations will initialize shortly.</p>
            </div>
        </div>

    </div>
  );
};

export default AdminDashboard;
