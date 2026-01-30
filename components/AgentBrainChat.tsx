
import React, { useState, useRef, useEffect } from 'react';
import type { Agent, GeminiMessage } from '../types';
import { getGeminiResponse } from '../services/gemini';
import { SendIcon, UserIcon, DashboardIcon } from './Icons';
import { useSpeech } from '../contexts/SpeechContext';

interface AgentBrainChatProps {
  agent: Agent;
}

export const AgentBrainChat: React.FC<AgentBrainChatProps> = ({ agent }) => {
  const [messages, setMessages] = useState<GeminiMessage[]>([]);
  const [chatView, setChatView] = useState<'conversation' | 'workspace'>('conversation');
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAudioOn, setIsAudioOn] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { speak, stop } = useSpeech();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: GeminiMessage = { role: 'user', text: input.trim() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await getGeminiResponse(agent, newMessages);
      setMessages([...newMessages, { role: 'model', ...response }]);
      if (isAudioOn) {
        speak(response.text, agent.id);
      }
    } catch (error) {
      setMessages([...newMessages, { role: 'model', text: "Critical failure in neural transmission. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[500px] bg-light-200/50 dark:bg-dark-300/30 rounded-3xl border border-light-300 dark:border-dark-300 overflow-hidden shadow-inner">
      <div className="p-4 border-b border-light-300 dark:border-dark-300 bg-light-100/50 dark:bg-dark-200/50 backdrop-blur-sm flex justify-between items-center">
         <div className="flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Secure Uplink: {agent.id}</span>
         </div>
         <div className="flex gap-4">
            <button
                onClick={() => setChatView(chatView === 'conversation' ? 'workspace' : 'conversation')}
                className={`text-[10px] font-black uppercase tracking-widest transition-colors ${chatView === 'workspace' ? 'text-brand-accent' : 'text-slate-500 hover:text-brand-primary'}`}
            >
                {chatView === 'workspace' ? 'Show Chat' : `Workspace (${messages.flatMap(m => m.artifacts || []).length})`}
            </button>
            <button
                onClick={() => {
                    setIsAudioOn(!isAudioOn);
                    if (isAudioOn) stop();
                }}
                className={`text-[10px] font-black uppercase tracking-widest transition-colors ${isAudioOn ? 'text-brand-accent' : 'text-slate-500 hover:text-brand-primary'}`}
            >
                {isAudioOn ? 'Audio Out: ON' : 'Audio Out: OFF'}
            </button>
            <button
                onClick={() => setMessages([])}
                className="text-[10px] font-black uppercase tracking-widest text-brand-primary hover:text-brand-accent transition-colors"
            >
                Flush Buffer
            </button>
         </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
        {chatView === 'workspace' ? (
           <div className="space-y-6 animate-fadeIn">
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-brand-primary mb-6">Agent Output Repository</h3>
              {messages.flatMap(m => m.artifacts || []).length === 0 ? (
                 <div className="py-20 text-center opacity-40">
                    <p className="text-xs font-bold uppercase tracking-widest">No artifacts generated yet.</p>
                 </div>
              ) : (
                 <div className="grid grid-cols-1 gap-4">
                    {messages.flatMap(m => m.artifacts || []).map((artifact, ai) => (
                       <div key={ai} className="bg-light-100 dark:bg-dark-200 border border-light-300 dark:border-dark-400 rounded-2xl overflow-hidden shadow-sm group">
                          <div className="p-4 flex justify-between items-center border-b border-light-300 dark:border-dark-400">
                             <div>
                                <h4 className="text-sm font-black dark:text-white">{artifact.title}</h4>
                                <span className="text-[8px] font-bold uppercase text-slate-500">{artifact.type}</span>
                             </div>
                             <button
                                onClick={() => {
                                    const blob = new Blob([artifact.content], { type: 'text/plain' });
                                    const url = URL.createObjectURL(blob);
                                    const a = document.createElement('a');
                                    a.href = url;
                                    a.download = `${artifact.title.replace(/\s+/g, '_')}.txt`;
                                    a.click();
                                }}
                                className="text-[10px] font-black uppercase tracking-widest text-brand-primary hover:text-brand-accent transition-colors"
                             >Export</button>
                          </div>
                          <div className="p-4 max-h-40 overflow-hidden relative">
                             <pre className="text-[10px] font-mono text-slate-500 whitespace-pre-wrap">{artifact.content.slice(0, 500)}...</pre>
                             <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-light-100 dark:from-dark-200 to-transparent" />
                          </div>
                       </div>
                    ))}
                 </div>
              )}
           </div>
        ) : (
          <>
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center opacity-40 grayscale pointer-events-none">
            <DashboardIcon className="h-12 w-12 mb-4 text-slate-400" />
            <p className="text-sm font-bold uppercase tracking-widest text-slate-500">Awaiting Command Input</p>
            <p className="text-xs mt-2 max-w-[200px]">Initialize a neural session with {agent.name.split('-')[0]} to begin operation.</p>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}>
            <div className={`max-w-[85%] flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
               <div className={`h-8 w-8 rounded-xl shrink-0 flex items-center justify-center ${msg.role === 'user' ? 'bg-brand-primary text-white' : 'bg-dark-300 text-brand-secondary border border-brand-secondary/20'}`}>
                  {msg.role === 'user' ? <UserIcon className="h-4 w-4" /> : <span className="text-[10px] font-black">{agent.name[0]}</span>}
               </div>
               <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed flex flex-col gap-3 ${
                 msg.role === 'user'
                 ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20'
                 : 'bg-light-100 dark:bg-dark-200 border border-light-300 dark:border-dark-400 dark:text-dark-content text-slate-700 shadow-sm'
               }`}>
                 {msg.thought_process && (
                    <p className="text-[10px] font-black uppercase tracking-widest text-brand-primary opacity-80 mb-1">Neural Thought Process: {msg.thought_process}</p>
                 )}

                 {msg.actions && msg.actions.length > 0 && (
                    <div className="space-y-2 mb-2">
                       {msg.actions.map((action, ai) => (
                          <div key={ai} className="flex items-center gap-2 bg-brand-primary/10 border border-brand-primary/20 rounded-lg p-2">
                             <div className="h-1.5 w-1.5 rounded-full bg-brand-primary animate-pulse" />
                             <span className="text-[10px] font-bold uppercase text-brand-primary">{action.tool}</span>
                             <span className="text-[10px] text-slate-500 truncate max-w-[150px]">{action.input}</span>
                             <span className="text-[10px] ml-auto font-black text-brand-accent italic">{action.status}</span>
                          </div>
                       ))}
                    </div>
                 )}

                 <div>{msg.text}</div>

                 {msg.artifacts && msg.artifacts.length > 0 && (
                    <div className="mt-4 space-y-4">
                       {msg.artifacts.map((artifact, arti) => (
                          <div key={arti} className="bg-dark-300/50 rounded-xl border border-dark-400 overflow-hidden">
                             <div className="bg-dark-400 px-4 py-2 flex justify-between items-center">
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">{artifact.title}</span>
                                <span className="text-[8px] font-bold bg-brand-primary/20 text-brand-primary px-2 py-0.5 rounded uppercase">{artifact.type}</span>
                             </div>
                             <pre className="p-4 text-xs font-mono text-emerald-400 overflow-x-auto whitespace-pre-wrap max-h-48 custom-scrollbar bg-dark-900/50">
                                {artifact.content}
                             </pre>
                             <div className="p-2 border-t border-dark-400 text-right">
                                <button
                                  onClick={() => {
                                    const blob = new Blob([artifact.content], { type: 'text/plain' });
                                    const url = URL.createObjectURL(blob);
                                    const a = document.createElement('a');
                                    a.href = url;
                                    a.download = `${artifact.title.replace(/\s+/g, '_')}.txt`;
                                    a.click();
                                  }}
                                  className="text-[8px] font-black uppercase tracking-widest text-brand-primary hover:text-brand-accent"
                                >Download Artifact</button>
                             </div>
                          </div>
                       ))}
                    </div>
                 )}
               </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start animate-pulse">
            <div className="flex gap-3 items-center">
               <div className="h-8 w-8 rounded-xl bg-dark-300 flex items-center justify-center border border-brand-secondary/20 text-brand-secondary">
                  <span className="text-[10px] font-black">{agent.name[0]}</span>
               </div>
               <div className="flex gap-1.5 px-4 py-3 bg-light-100 dark:bg-dark-200 rounded-2xl border border-light-300 dark:border-dark-400">
                  <div className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '300ms' }} />
               </div>
            </div>
          </div>
        )}
          </>
        )}
      </div>

      <div className="p-4 bg-light-100/50 dark:bg-dark-200/50 border-t border-light-300 dark:border-dark-300 backdrop-blur-sm">
        <div className="relative group">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={`Instruct ${agent.name}...`}
            className="w-full bg-light-200 dark:bg-dark-300 border-none rounded-2xl py-4 pl-6 pr-14 text-sm focus:ring-2 focus:ring-brand-primary transition-all shadow-inner placeholder-slate-500"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 rounded-xl bg-brand-primary text-white hover:bg-brand-secondary transition-all disabled:opacity-50 active:scale-90 shadow-lg shadow-brand-primary/20"
          >
            <SendIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
