import React from 'react';
import type { User } from '../types';
import { UserIcon, SoundWaveIcon, GridIcon } from './Icons';

interface AdminDashboardProps {
  user: User | null;
}

const StatCard: React.FC<{ title: string; value: string; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="dark:bg-dark-200 bg-light-200 p-6 rounded-lg shadow-md flex items-center gap-6">
        <div className="p-3 rounded-full bg-brand-primary/10 text-brand-primary">
            {icon}
        </div>
        <div>
            <p className="text-sm text-slate-400">{title}</p>
            <p className="text-2xl font-bold dark:text-white text-light-content">{value}</p>
        </div>
    </div>
);

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user }) => {
  return (
    <div className="flex-1 overflow-y-auto p-8 animate-fadeIn">
      <header className="mb-8">
        <h1 className="text-3xl font-bold dark:text-white text-light-content">Admin Dashboard</h1>
        <p className="text-slate-400">Welcome back, {user?.email || 'Admin'}.</p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard title="Total Users" value="1,428" icon={<UserIcon className="h-6 w-6" />} />
          <StatCard title="Active Agents" value="193" icon={<GridIcon className="h-6 w-6" />} />
          <StatCard title="Voice Minutes Used (30d)" value="7,821" icon={<SoundWaveIcon className="h-6 w-6" />} />
          <StatCard title="Simulations Run (24h)" value="512" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
          <StatCard title="API Calls (24h)" value="2.1M" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 9l4-4 4 4m0 6l-4 4-4-4" /></svg>} />
          <StatCard title="Avg. Search Latency" value="112ms" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
      </div>

       <div className="mt-8">
            <h2 className="text-xl font-bold dark:text-white text-light-content mb-4">Recent Activity</h2>
            <div className="dark:bg-dark-200 bg-light-200 p-4 rounded-lg shadow-md">
                <p className="text-slate-500 text-center py-8">Activity log and charts would be displayed here.</p>
            </div>
        </div>

    </div>
  );
};

export default AdminDashboard;
