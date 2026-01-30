
import React, { createContext, useContext, useState, useCallback, useRef } from 'react';

interface SpeechContextType {
    isSpeaking: boolean;
    speakingAgentId: string | null;
    speak: (text: string, agentId: string) => void;
    stop: () => void;
}

const SpeechContext = createContext<SpeechContextType | undefined>(undefined);

export const SpeechProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [speakingAgentId, setSpeakingAgentId] = useState<string | null>(null);
    const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

    const stop = useCallback(() => {
        if (typeof window !== 'undefined' && window.speechSynthesis) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
            setSpeakingAgentId(null);
        }
    }, []);

    const speak = useCallback((text: string, agentId: string) => {
        if (typeof window === 'undefined' || !window.speechSynthesis) return;

        stop();

        const utterance = new SpeechSynthesisUtterance(text);

        const voices = window.speechSynthesis.getVoices();
        utterance.voice = voices.find(v => v.lang.startsWith('en')) || voices[0];
        utterance.pitch = 1.0;
        utterance.rate = 1.0;

        utterance.onstart = () => {
            setIsSpeaking(true);
            setSpeakingAgentId(agentId);
        };

        utterance.onend = () => {
            setIsSpeaking(false);
            setSpeakingAgentId(null);
        };

        utteranceRef.current = utterance;
        window.speechSynthesis.speak(utterance);
    }, [stop]);

    const value = { isSpeaking, speakingAgentId, speak, stop };
    
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
