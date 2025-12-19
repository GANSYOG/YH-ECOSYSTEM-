import React, { useState, createContext, useContext } from 'react';
import type { User } from '../types';
import * as api from '../services/api';
import { usePersistentState } from '../hooks/usePersistentState';

// --- AUTH CONTEXT & PROVIDER ---
interface AuthContextType {
  user: User | null;
  login: (email: string, pass: string) => Promise<void>;
  register: (email: string, pass: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = usePersistentState<User | null>('yh_user', null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const login = async (email: string, pass: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const userData = await api.login(email, pass);
            setUser(userData);
        } catch (err: any) {
            setError(err.message || "Failed to log in.");
        } finally {
            setIsLoading(false);
        }
    };
    
    const register = async (email: string, pass: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const userData = await api.register(email, pass);
            setUser(userData);
        } catch (err: any) {
            setError(err.message || "Failed to register.");
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, isLoading, error }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

// --- AUTH MODAL COMPONENT ---
export const AuthModal: React.FC = () => {
    const { login, register, isLoading, error } = useAuth();
    const [isRegister, setIsRegister] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isRegister) {
            register(email, password);
        } else {
            login(email, password);
        }
    };

    return (
        <div className="fixed inset-0 bg-dark-200 z-50 flex items-center justify-center p-4">
            <div className="bg-dark-300 rounded-xl border border-dark-300/50 shadow-2xl w-full max-w-sm flex flex-col">
                <header className="p-6">
                    <h2 className="text-2xl font-bold text-white text-center">
                        {isRegister ? 'Create Account' : 'Welcome Back'}
                    </h2>
                    <p className="text-slate-400 text-center mt-1">
                        {isRegister ? 'to the YH Ecosystem Orchestrator' : 'Sign in to continue'}
                    </p>
                </header>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && (
                        <div className="bg-red-900/50 border border-red-500/30 text-red-300 text-sm rounded-md p-3 text-center">
                            {error}
                        </div>
                    )}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1">Email Address</label>
                        <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full bg-dark-200 border border-dark-300 text-white rounded-md p-2 focus:ring-brand-primary focus:border-brand-primary" />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-1">Password</label>
                        <input type="password" id="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full bg-dark-200 border border-dark-300 text-white rounded-md p-2 focus:ring-brand-primary focus:border-brand-primary" />
                    </div>
                    <button type="submit" disabled={isLoading} className="w-full flex justify-center items-center px-4 py-2 rounded-md font-semibold text-white bg-brand-primary hover:bg-sky-400 transition-colors duration-200 disabled:bg-slate-500 disabled:cursor-not-allowed">
                        {isLoading ? 'Processing...' : (isRegister ? 'Register' : 'Login')}
                    </button>
                </form>
                <footer className="p-6 border-t border-dark-300/50 text-center">
                    <button onClick={() => setIsRegister(!isRegister)} className="text-sm text-brand-primary hover:underline">
                        {isRegister ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
                    </button>
                </footer>
            </div>
        </div>
    );
};
