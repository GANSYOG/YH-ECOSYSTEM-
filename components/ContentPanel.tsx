import React from 'react';
import type { Agent } from '../types';
import AgentCard from './AgentCard';
import AgentCardSkeleton from './AgentCardSkeleton';
import DivisionFilter from './DivisionFilter';
import Pagination from './Pagination';

interface ContentPanelProps {
  title: string;
  agents: Agent[];
  totalAgents: number;
  isLoading: boolean;
  onSelectAgent: (agent: Agent) => void;
  onGenerateConfig: (agent: Agent) => void;
  onOpenInteractiveDemo: (agent: Agent) => void;
  viewMode: 'grid' | 'graph';
  allDivisions: string[];
  selectedDivisions: string[];
  setSelectedDivisions: (divisions: string[]) => void;
  isSearchActive: boolean;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  agentsPerPage: number;
}

const ContentPanel: React.FC<ContentPanelProps> = ({ 
  title, agents, totalAgents, isLoading, onSelectAgent, onGenerateConfig, onOpenInteractiveDemo, 
  allDivisions, selectedDivisions, setSelectedDivisions, isSearchActive,
  currentPage, setCurrentPage, agentsPerPage
}) => {
  return (
    <div className="flex-1 overflow-hidden p-6 md:p-8 flex flex-col h-full">
      <div className="mb-6 flex-shrink-0 flex flex-wrap justify-between items-end gap-4">
        <div>
          <h2 className="text-3xl font-bold dark:text-white text-light-content">{title}</h2>
          <p className="text-slate-500 text-sm mt-1">
            {isLoading ? 'Scanning ecosystem layers...' : `${totalAgents} units active in selected sector.`}
          </p>
        </div>
        {!isSearchActive && (
          <DivisionFilter
            allDivisions={allDivisions}
            selectedDivisions={selectedDivisions}
            setSelectedDivisions={setSelectedDivisions}
          />
        )}
      </div>
      
      <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <AgentCardSkeleton key={i} />
            ))}
          </div>
        ) : agents.length > 0 ? (
          <div className="h-full flex flex-col overflow-hidden">
            <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar animate-fadeIn">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-6">
                {agents.map((agent) => (
                  <AgentCard 
                    key={agent.id} 
                    agent={agent} 
                    onViewDetails={onSelectAgent}
                    onGenerateConfig={onGenerateConfig}
                    onOpenInteractiveDemo={onOpenInteractiveDemo}
                  />
                ))}
              </div>
            </div>
            <div className="pt-4 border-t dark:border-dark-300 border-light-300">
              <Pagination 
                currentPage={currentPage} 
                totalItems={totalAgents} 
                itemsPerPage={agentsPerPage} 
                onPageChange={setCurrentPage} 
              />
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center p-12 bg-light-200 dark:bg-dark-200/50 rounded-2xl border-2 border-dashed border-slate-300 dark:border-dark-300">
            <div className="p-4 bg-slate-100 dark:bg-dark-300 rounded-full text-slate-400 mb-4">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 9.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <h3 className="text-xl font-semibold dark:text-white">No matches found</h3>
            <p className="text-slate-500 max-w-sm mt-2">Adjust your filters or query to discover agents in other sectors.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentPanel;