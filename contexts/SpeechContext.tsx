
import React, { createContext, useContext, useState, useCallback } from 'react';
import type { Agent } from '../types';

interface SpeechContextType {
    isSpeaking: boolean;
    speakingAgentId: string | null;
    playDemo: (agent: Agent) => Promise<void>;
    stopDemo: () => void;
    canPlayDemo: (agent: Agent) => boolean;
}

const SpeechContext = createContext<SpeechContextType | undefined>(undefined);

export const SpeechProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
    const [isSpeaking] = useState(false);
    const [speakingAgentId] = useState<string | null>(null);

    const playDemo = useCallback(async () => {
        return Promise.resolve();
    }, []);
    
    const stopDemo = useCallback(() => {}, []);
    
    const canPlayDemo = useCallback(() => false, []);

    const value = { isSpeaking, speakingAgentId, playDemo, stopDemo, canPlayDemo };
    
    return (
        <SpeechContext.Provider value={value}>
            {children}
        </SpeechContext.Provider>
    );
};

export const useSpeech = () => {
    const context = useContext(SpeechContext);
    if (context === undefined) {
        throw new Error('useSpeech must be used within a SpeechProvider');
    }
    return context;
};
