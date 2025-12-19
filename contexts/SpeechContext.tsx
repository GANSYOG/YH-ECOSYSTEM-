import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';
import type { Agent } from '../types';

interface SpeechContextType {
    isSpeaking: boolean;
    speakingAgentId: string | null;
    playDemo: (agent: Agent) => void;
    stopDemo: () => void;
    canPlayDemo: (agent: Agent) => boolean;
}

const SpeechContext = createContext<SpeechContextType | undefined>(undefined);

export const SpeechProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
    const { speak, cancel, isSpeaking, getLanguageData, isSupported } = useSpeechSynthesis();
    const [speakingAgentId, setSpeakingAgentId] = useState<string | null>(null);

    useEffect(() => {
        if (!isSpeaking) {
            setSpeakingAgentId(null);
        }
    }, [isSpeaking]);
    
    const playDemo = useCallback((agent: Agent) => {
        const langData = getLanguageData(agent.name);
        if (langData) {
            setSpeakingAgentId(agent.id);
            speak(langData.text, langData.lang);
        }
    }, [getLanguageData, speak]);
    
    const stopDemo = useCallback(() => {
        cancel();
    }, [cancel]);
    
    const canPlayDemo = useCallback((agent: Agent) => {
        return isSupported && agent.division === 'Conversations' && !!getLanguageData(agent.name);
    }, [getLanguageData, isSupported]);

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