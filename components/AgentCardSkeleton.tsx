
import React from 'react';

const AgentCardSkeleton: React.FC = () => {
  return (
    <div className="dark:bg-dark-200 bg-light-100 rounded-lg border dark:border-dark-300 border-light-300 shadow-lg p-5 flex flex-col gap-4 animate-pulse">
      <header className="space-y-2">
        <div className="flex justify-between items-start">
            <div className="h-5 bg-slate-700/50 rounded w-1/2"></div>
            <div className="h-4 bg-slate-700/50 rounded w-1/4 font-mono"></div>
        </div>
        <div className="h-3 bg-brand-primary/20 rounded w-1/3"></div>
      </header>
      
      <div className="space-y-2">
        <div className="h-3 bg-slate-700/50 rounded w-1/4"></div>
        <div className="space-y-1">
          <div className="h-3 bg-slate-700/30 rounded w-full"></div>
          <div className="h-3 bg-slate-700/30 rounded w-5/6"></div>
        </div>
      </div>

      <div className="space-y-2 mt-auto pt-4">
        <div className="h-3 bg-slate-700/50 rounded w-1/4"></div>
        <div className="flex gap-2">
          <div className="h-5 bg-slate-700/30 rounded-full w-12"></div>
          <div className="h-5 bg-slate-700/30 rounded-full w-16"></div>
        </div>
      </div>

      <footer className="flex justify-end items-center gap-2 pt-4 border-t dark:border-dark-300 border-light-300 mt-2">
        <div className="h-8 bg-slate-700/30 rounded-md w-16"></div>
        <div className="h-8 bg-slate-700/30 rounded-md w-24"></div>
      </footer>
    </div>
  );
};

export default AgentCardSkeleton;
