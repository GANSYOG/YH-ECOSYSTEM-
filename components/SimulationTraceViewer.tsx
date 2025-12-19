import React, { useState, useEffect } from 'react';
import * as api from '../services/api';
import type { SimulationTraceStep } from '../types';

interface SimulationTraceViewerProps {
    agentId: string;
}

const SimulationTraceViewer: React.FC<SimulationTraceViewerProps> = ({ agentId }) => {
    const [trace, setTrace] = useState<SimulationTraceStep[] | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        api.fetchSimulationTrace(agentId).then(data => {
            setTrace(data);
            setIsLoading(false);
        });
    }, [agentId]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-10">
                <svg className="animate-spin h-8 w-8 text-brand-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            </div>
        );
    }
    
    if (!trace || trace.length === 0) {
        return <p className="text-slate-500 text-center py-10">No simulation trace available for this agent.</p>;
    }

    return (
        <div className="animate-fadeIn">
            <h3 className="text-lg font-semibold text-slate-300 mb-4">Execution Trace</h3>
            <div className="relative border-l-2 border-dark-300 pl-6 space-y-8">
                {trace.map((step, index) => (
                    <div key={index} className="relative">
                        <div className="absolute -left-[33px] top-1 h-4 w-4 rounded-full bg-brand-secondary ring-8 ring-dark-200"></div>
                        <p className="text-xs text-slate-400">{new Date(step.timestamp).toLocaleString()}</p>
                        <h4 className="font-semibold text-slate-200">{step.title}</h4>
                        <details className="mt-2">
                            <summary className="text-sm text-slate-400 cursor-pointer hover:text-white">View Payload</summary>
                            <pre className="mt-2 p-3 bg-dark-300/50 rounded-md text-xs text-slate-300 overflow-x-auto">
                                <code>{JSON.stringify(step.payload, null, 2)}</code>
                            </pre>
                        </details>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SimulationTraceViewer;
