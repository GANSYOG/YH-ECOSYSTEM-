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
        <div className="fixed inset-0 bg-dark-100 z-50 flex items-center justify-center p-6">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-brand-primary/10 via-transparent to-transparent opacity-50" />

            <div className="bg-dark-200/80 backdrop-blur-2xl rounded-[2.5rem] border border-dark-300 shadow-2xl w-full max-w-md flex flex-col overflow-hidden animate-fadeIn relative z-10">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-primary to-brand-secondary" />

                <header className="p-10 pb-6 text-center">
                    <div className="h-16 w-16 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg shadow-brand-primary/20 rotate-3">
                        <span className="text-3xl font-black text-white italic">YH</span>
                    </div>
                    <h2 className="text-3xl font-black text-white tracking-tighter">
                        {isRegister ? 'Initialize Access' : 'Neural Uplink'}
                    </h2>
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-2 opacity-60">
                        {isRegister ? 'Register your neural signature' : 'Verify your system credentials'}
                    </p>
                </header>

                <form onSubmit={handleSubmit} className="px-10 py-6 space-y-6">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold rounded-xl p-4 text-center animate-pulse">
                            {error}
                        </div>
                    )}
                    <div className="space-y-2">
                        <label htmlFor="email" className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Command Email</label>
                        <input
                          type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} required
                          className="w-full bg-dark-300/50 border border-dark-400 text-white rounded-2xl p-4 text-sm focus:ring-2 focus:ring-brand-primary focus:bg-dark-300 transition-all outline-none"
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="password" className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Access Cipher</label>
                        <input
                          type="password" id="password" value={password} onChange={e => setPassword(e.target.value)} required
                          className="w-full bg-dark-300/50 border border-dark-400 text-white rounded-2xl p-4 text-sm focus:ring-2 focus:ring-brand-primary focus:bg-dark-300 transition-all outline-none"
                        />
                    </div>
                    <button
                      type="submit" disabled={isLoading}
                      className="w-full flex justify-center items-center px-6 py-4 rounded-2xl font-black uppercase tracking-widest text-xs text-white bg-gradient-to-r from-brand-primary to-brand-secondary hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:grayscale shadow-xl shadow-brand-primary/25 active:scale-95"
                    >
                        {isLoading ? 'Decrypting...' : (isRegister ? 'Authorize' : 'Initialize')}
                    </button>
                </form>

                <footer className="p-10 pt-4 text-center">
                    <button onClick={() => setIsRegister(!isRegister)} className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-brand-primary transition-colors">
                        {isRegister ? 'Already Authorized? Sign In' : "New Operator? Request Access"}
                    </button>
                </footer>
            </div>
        </div>
    );
};
