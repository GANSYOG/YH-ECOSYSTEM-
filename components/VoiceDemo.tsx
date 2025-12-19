import React from 'react';
import type { Agent } from '../types';
import { useSpeech } from '../contexts/SpeechContext';
import { PlayCircleIcon, StopCircleIcon } from './Icons';

interface VoiceDemoProps {
    agent: Agent;
}

export const VoiceDemo: React.FC<VoiceDemoProps> = ({ agent }) => {
    const { isSpeaking, speakingAgentId, playDemo, stopDemo, canPlayDemo } = useSpeech();
    
    if (!canPlayDemo(agent)) {
        return null;
    }

    const isThisAgentSpeaking = isSpeaking && speakingAgentId === agent.id;

    const handleTogglePlay = () => {
        if (isThisAgentSpeaking) {
            stopDemo();
        } else {
            playDemo(agent);
        }
    };
    
    // Disable button if another agent is speaking
    const isDisabled = isSpeaking && !isThisAgentSpeaking;

    return (
        <button
            onClick={handleTogglePlay}
            disabled={isDisabled}
            className="flex items-center gap-2 text-xs px-3 py-2 rounded-md transition-colors dark:bg-dark-300 bg-light-200 text-slate-400 dark:hover:bg-dark-100 hover:bg-light-300 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label={isThisAgentSpeaking ? `Stop demo for ${agent.name}` : `Play voice demo for ${agent.name}`}
        >
            {isThisAgentSpeaking ? <StopCircleIcon /> : <PlayCircleIcon />}
            <span>{isThisAgentSpeaking ? 'Stop' : 'Demo'}</span>
        </button>
    );
};