import React from 'react';
import { UserIcon, LogoutIcon, DashboardIcon } from './Icons';
import type { User } from '../types';

type AppView = 'main' | 'admin';

interface SidebarProps {
  divisions: string[];
  selectedDivisions: string[];
  onSelectDivision: (division: string) => void;
  user: User | null;
  onLogout: () => void;
  onNavigate: (view: AppView) => void;
  currentView: AppView;
}

const Sidebar: React.FC<SidebarProps> = ({ divisions, selectedDivisions, onSelectDivision, user, onLogout, onNavigate, currentView }) => {
  return (
    <aside className="w-64 dark:bg-dark-200 bg-light-200 border-r dark:border-dark-300 border-light-300 flex flex-col shadow-xl z-20">
      <div className="p-6 border-b dark:border-dark-300 border-light-300">
        <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Orchestrator</h2>
      </div>
      
      <nav className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        <div className="mb-4">
           <p className="px-3 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sectors</p>
           <ul className="space-y-1">
            {divisions.map((division) => (
              <li key={division}>
                <button
                  onClick={() => onSelectDivision(division)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                    currentView === 'main' && selectedDivisions.includes(division)
                      ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20'
                      : 'dark:text-dark-content text-slate-600 dark:hover:bg-dark-300 hover:bg-light-300'
                  }`}
                >
                  {division}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <div className="p-4 bg-light-300 dark:bg-dark-300/30 mt-auto border-t dark:border-dark-300 border-light-300">
        <div className="flex flex-col gap-2">
            <button
                onClick={() => onNavigate(currentView === 'admin' ? 'main' : 'admin')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold transition-all ${
                  currentView === 'admin' 
                  ? 'bg-brand-primary text-white' 
                  : 'dark:text-slate-400 text-slate-600 hover:text-brand-primary'
                }`}
            >
                <DashboardIcon className="h-4 w-4" />
                <span>{currentView === 'admin' ? 'Exit Dashboard' : 'System Metrics'}</span>
            </button>
            
            <div className="flex items-center gap-3 px-3 py-3 border-t dark:border-dark-300 border-light-200 mt-2">
                <UserIcon className="h-8 w-8 text-slate-500 dark:bg-dark-200 bg-light-100 rounded-full p-1.5 border dark:border-dark-300" />
                <div className="overflow-hidden">
                  <p className="text-[10px] font-bold dark:text-white truncate">{user?.email}</p>
                  <span className="text-[8px] bg-brand-secondary/20 text-brand-secondary px-1.5 py-0.5 rounded font-bold uppercase tracking-tighter">{user?.role}</span>
                </div>
            </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;