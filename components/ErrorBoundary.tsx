import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-8 text-center">
          <h1 className="text-4xl font-bold text-red-500 mb-4">Orchestrator Failure</h1>
          <p className="text-slate-300 max-w-md mb-8">
            The ecosystem encountered an unexpected core error. System state has been locked for safety.
          </p>
          <div className="bg-slate-800 p-4 rounded-md mb-8 text-left max-w-2xl overflow-auto">
             <code className="text-red-400 text-sm whitespace-pre-wrap">{this.state.error?.stack}</code>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="bg-brand-primary text-white px-6 py-3 rounded-md font-bold hover:bg-sky-400 transition-colors"
          >
            Reboot Orchestrator
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;