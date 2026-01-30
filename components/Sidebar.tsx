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
    <aside className="w-72 dark:bg-dark-200/50 bg-light-200/50 backdrop-blur-xl border-r dark:border-dark-300 border-light-300 flex flex-col shadow-2xl z-20 relative">
      <div className="p-8 border-b dark:border-dark-300 border-light-300 relative">
        <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-1">Navigation</h2>
        <p className="text-xl font-black dark:text-white flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-brand-primary" />
            Control Center
        </p>
      </div>
      
      <nav className="flex-1 overflow-y-auto py-6 px-4 custom-scrollbar">
        <div className="mb-8">
           <p className="px-4 mb-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] opacity-60">Neural Sectors</p>
           <ul className="space-y-1.5">
            {divisions.map((division) => (
              <li key={division} className="group/item">
                <button
                  onClick={() => onSelectDivision(division)}
                  className={`w-full text-left px-4 py-3 rounded-xl text-xs font-black transition-all duration-300 relative overflow-hidden flex items-center justify-between ${
                    currentView === 'main' && selectedDivisions.includes(division)
                      ? 'bg-gradient-to-r from-brand-primary to-brand-secondary text-white shadow-lg shadow-brand-primary/25'
                      : 'dark:text-slate-400 text-slate-600 dark:hover:bg-dark-300/50 hover:bg-light-300/50'
                  }`}
                >
                  <span className="relative z-10">{division}</span>
                  {currentView === 'main' && selectedDivisions.includes(division) && (
                     <div className="h-1.5 w-1.5 rounded-full bg-white/40 animate-ping" />
                  )}
                  {!(currentView === 'main' && selectedDivisions.includes(division)) && (
                     <div className="h-1 w-1 rounded-full bg-slate-400 dark:bg-dark-400 opacity-0 group-hover/item:opacity-100 transition-opacity" />
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <div className="p-6 bg-light-300/30 dark:bg-dark-300/30 mt-auto border-t dark:border-dark-300 border-light-300 backdrop-blur-md">
        <div className="flex flex-col gap-3">
            <button
                onClick={() => onNavigate(currentView === 'admin' ? 'main' : 'admin')}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 ${
                  currentView === 'admin' 
                  ? 'bg-gradient-to-r from-brand-secondary to-brand-accent text-white shadow-lg'
                  : 'dark:text-slate-400 text-slate-600 hover:text-brand-primary dark:hover:bg-dark-300/50 hover:bg-light-300/50 border border-transparent hover:border-brand-primary/20'
                }`}
            >
                <DashboardIcon className="h-4 w-4" />
                <span>{currentView === 'admin' ? 'Exit Analytics' : 'Core Analytics'}</span>
            </button>
            
            <div className="flex items-center gap-4 px-2 py-4 border-t dark:border-dark-300 border-light-200 mt-2">
                <div className="relative">
                   <div className="absolute inset-0 bg-brand-primary/20 blur-md rounded-full" />
                   <UserIcon className="h-10 w-10 text-white dark:bg-dark-300 bg-brand-primary rounded-xl p-2 relative z-10 border border-white/10" />
                   <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-emerald-500 border-2 border-white dark:border-dark-200 rounded-full z-20" />
                </div>
                <div className="overflow-hidden">
                  <p className="text-xs font-black dark:text-white truncate tracking-tight">{user?.email.split('@')[0]}</p>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[8px] font-black uppercase tracking-widest text-brand-secondary">{user?.role}</span>
                    <span className="h-1 w-1 rounded-full bg-slate-400" />
                    <button onClick={onLogout} className="text-[8px] font-black uppercase tracking-widest text-slate-500 hover:text-brand-accent transition-colors">Logout</button>
                  </div>
                </div>
            </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;