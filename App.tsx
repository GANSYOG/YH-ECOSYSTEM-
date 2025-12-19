
import React, { useState, useMemo, useEffect } from 'react';
import { ecosystemData } from './data/ecosystemData';
import type { Agent, User } from './types';
import Sidebar from './components/Sidebar';
import ContentPanel from './components/ContentPanel';
import AgentModal from './components/AgentModal';
import Toast from './components/Toast';
import { SearchIcon, SunIcon, MoonIcon } from './components/Icons';
import * as api from './services/api';
import AdminDashboard from './components/AdminDashboard';
import { usePersistentState } from './hooks/usePersistentState';
import { AuthProvider, AuthModal, useAuth } from './contexts/AuthContext';
import { SpeechProvider } from './contexts/SpeechContext';
import ErrorBoundary from './components/ErrorBoundary';

type AppView = 'main' | 'admin';
const AGENTS_PER_PAGE = 12;

// Main application content that requires context access
const AppContent: React.FC = () => {
  const { user, logout } = useAuth();
  const [divisionNames, setDivisionNames] = useState<string[]>([]);
  const [agentsForDisplay, setAgentsForDisplay] = useState<{ agents: Agent[], total: number }>({ agents: [], total: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [appView, setAppView] = useState<AppView>('main');
  
  const [selectedDivisions, setSelectedDivisions] = usePersistentState<string[]>('yh_selected_divisions', []);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [toast, setToast] = useState<{ message: string } | null>(null);
  const [theme, setTheme] = usePersistentState<'light' | 'dark'>('yh_theme', 'dark');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  useEffect(() => {
    api.fetchDivisions()
      .then(divisions => {
        setDivisionNames(divisions);
        if (divisions.length > 0 && selectedDivisions.length === 0) {
          setSelectedDivisions([divisions[0]]);
        }
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (divisionNames.length === 0 && !searchQuery) return;
    
    setIsLoading(true);
    api.fetchAgents({ 
      divisions: selectedDivisions, 
      searchQuery: searchQuery.trim(),
      page: currentPage,
      limit: AGENTS_PER_PAGE
    })
    .then(result => {
      setAgentsForDisplay(result);
      setIsLoading(false);
    })
    .catch(err => {
      setToast({ message: "System Error: Failed to fetch agent telemetry." });
      setIsLoading(false);
    });
  }, [selectedDivisions, searchQuery, divisionNames, currentPage]);

  const handleSelectDivision = (divisionName: string) => {
    setSearchQuery('');
    setSelectedDivisions([divisionName]);
    setCurrentPage(1);
    setAppView('main');
  };
  
  const handleGenerateConfig = async (agent: Agent) => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(agent, null, 2));
      setToast({ message: `Agent configuration for ${agent.name} copied!` });
    } catch (e) {
      setToast({ message: 'Clipboard access failed.' });
    }
  };

  const contentPanelTitle = useMemo(() => {
    if (searchQuery.trim()) return `Search Results: ${searchQuery}`;
    if (selectedDivisions.length === 1) return selectedDivisions[0];
    return 'Ecosystem Core';
  }, [selectedDivisions, searchQuery]);

  // Auth gate
  if (!user) {
    return <AuthModal />;
  }

  return (
    <div className="flex h-screen w-full bg-light-100 text-light-content dark:bg-dark-100 dark:text-dark-content transition-colors overflow-hidden">
      <Sidebar 
        divisions={divisionNames} 
        selectedDivisions={selectedDivisions} 
        onSelectDivision={handleSelectDivision} 
        user={user}
        onLogout={logout}
        onNavigate={setAppView}
        currentView={appView}
      />
      
      <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <header className="bg-light-200 dark:bg-dark-200 border-b border-light-300 dark:border-dark-300 p-4 flex justify-between items-center gap-4 flex-shrink-0 shadow-sm">
          <div className='flex-shrink-0'>
            <h1 className="text-xl font-bold dark:text-white">{ecosystemData.ecosystem}</h1>
            <p className="text-[10px] uppercase tracking-widest text-brand-primary font-bold">
              Autonomous Network • v{ecosystemData.version}
            </p>
          </div>

          <div className="flex-1 max-w-md hidden md:block">
            <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type="search" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-light-300 dark:bg-dark-300 border-none rounded-lg py-2 pl-10 text-sm placeholder-slate-500 focus:ring-2 focus:ring-brand-primary"
                  placeholder="Query agents..."
                />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-lg dark:bg-dark-300 bg-light-300 text-slate-500 hover:text-brand-primary transition-colors"
            >
              {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
            </button>
          </div>
        </header>
        
        <div className="flex-1 min-h-0">
          {appView === 'admin' ? (
            <AdminDashboard user={user} />
          ) : (
            <ContentPanel 
              title={contentPanelTitle} 
              agents={agentsForDisplay.agents} 
              totalAgents={agentsForDisplay.total}
              isLoading={isLoading} 
              onSelectAgent={setSelectedAgent} 
              onGenerateConfig={handleGenerateConfig}
              onOpenInteractiveDemo={() => {}} // No-op
              viewMode="grid"
              allDivisions={divisionNames} 
              selectedDivisions={selectedDivisions}
              setSelectedDivisions={setSelectedDivisions} 
              isSearchActive={!!searchQuery}
              currentPage={currentPage} 
              setCurrentPage={setCurrentPage} 
              agentsPerPage={AGENTS_PER_PAGE}
            />
          )}
        </div>
      </main>

      {selectedAgent && (
        <AgentModal 
          agent={selectedAgent} 
          user={user} 
          onClose={() => setSelectedAgent(null)} 
          onOpenInteractiveDemo={() => {}}
          onCopyConfig={handleGenerateConfig}
        />
      )}
      {toast && <Toast message={toast.message} onClose={() => setToast(null)} />}
    </div>
  );
};

// Top-level App component with required providers
const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <SpeechProvider>
          <AppContent />
        </SpeechProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;
