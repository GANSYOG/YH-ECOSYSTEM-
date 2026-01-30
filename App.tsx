
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
    <div className="flex h-screen w-full bg-light-100 text-light-content dark:bg-dark-100 dark:text-dark-content transition-all duration-500 overflow-hidden font-sans">
      <Sidebar 
        divisions={divisionNames} 
        selectedDivisions={selectedDivisions} 
        onSelectDivision={handleSelectDivision} 
        user={user}
        onLogout={logout}
        onNavigate={setAppView}
        currentView={appView}
      />
      
      <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-brand-primary/5 blur-[120px] pointer-events-none rounded-full" />
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-brand-secondary/5 blur-[100px] pointer-events-none rounded-full" />

        <header className="bg-light-100/80 dark:bg-dark-100/80 backdrop-blur-md border-b border-light-300 dark:border-dark-300 p-6 flex justify-between items-center gap-6 flex-shrink-0 z-10">
          <div className='flex-shrink-0'>
            <h1 className="text-2xl font-black dark:text-white tracking-tight flex items-center gap-2">
              <span className="bg-gradient-to-r from-brand-primary to-brand-secondary bg-clip-text text-transparent">
                {ecosystemData.ecosystem.split(' ')[0]}
              </span>
              <span className="font-light opacity-80">{ecosystemData.ecosystem.split(' ').slice(1).join(' ')}</span>
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-secondary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-secondary"></span>
              </span>
              <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold">
                Neural Orchestration Engine • v{ecosystemData.version}
              </p>
            </div>
          </div>

          <div className="flex-1 max-w-xl hidden lg:block">
            <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-brand-primary to-brand-secondary rounded-xl opacity-0 group-focus-within:opacity-20 transition-opacity blur-md" />
                <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="search" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-light-200/50 dark:bg-dark-200/50 border border-light-300 dark:border-dark-300 rounded-xl py-3 pl-12 pr-4 text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:bg-light-100 dark:focus:bg-dark-100 transition-all shadow-inner"
                  placeholder="Query autonomous neural agents..."
                />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2.5 rounded-xl dark:bg-dark-200 bg-light-200 text-slate-500 hover:text-brand-primary border border-light-300 dark:border-dark-300 transition-all hover:scale-105 active:scale-95"
            >
              {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
            </button>

            <div className="h-8 w-[1px] bg-light-300 dark:bg-dark-300 mx-1 hidden sm:block" />

            <div className="flex items-center gap-3 pl-2">
               <div className="hidden sm:block text-right">
                  <p className="text-xs font-bold dark:text-white leading-none">{user.email.split('@')[0]}</p>
                  <p className="text-[10px] text-slate-500 uppercase tracking-tighter mt-1">System {user.role}</p>
               </div>
               <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center text-white font-bold shadow-lg shadow-brand-primary/20">
                  {user.email[0].toUpperCase()}
               </div>
            </div>
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
