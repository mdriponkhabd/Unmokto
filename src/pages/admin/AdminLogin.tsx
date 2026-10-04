import React, { useState } from 'react';
import { Lock, ShieldCheck, ArrowRight, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface AdminLoginProps {
  onLoginSuccess: () => void;
  onExit: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, onExit }) => {
  const { setAdminToken, settings } = useApp();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.token) {
          setAdminToken(data.token);
          onLoginSuccess();
          return;
        }
      }

      // Check client fallback for Vercel static deployment
      const isUser = username?.trim().toLowerCase() === 'admin';
      const isPass = password === 'Repon@1997@' || password === 'admin123';
      if (isUser && isPass) {
        const fallbackToken = 'adm_local_' + Math.random().toString(36).substring(2);
        setAdminToken(fallbackToken);
        onLoginSuccess();
        return;
      }

      throw new Error('Invalid admin credentials');
    } catch (err: any) {
      const isUser = username?.trim().toLowerCase() === 'admin';
      const isPass = password === 'Repon@1997@' || password === 'admin123';
      if (isUser && isPass) {
        const fallbackToken = 'adm_local_' + Math.random().toString(36).substring(2);
        setAdminToken(fallbackToken);
        onLoginSuccess();
        return;
      }
      setError(err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900 px-4 py-12">
      <div className="w-full max-w-md space-y-8 rounded-3xl border border-slate-800 bg-slate-950 p-8 shadow-2xl">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Lock className="h-7 w-7" />
          </div>
          <h2 className="mt-4 text-2xl font-black text-white tracking-tight">
            Unmokto Administration
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            Restricted portal for Adsterra & Site Settings management
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-2 rounded-xl border border-red-900/50 bg-red-950/40 p-3 text-xs text-red-400">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Username
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-white placeholder-slate-600 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-white placeholder-slate-600 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-500 active:scale-95 disabled:opacity-50 cursor-pointer transition-all"
          >
            <span>{isLoading ? 'Authenticating...' : 'Sign in to Admin Panel'}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <div className="text-center pt-2">
          <button
            onClick={onExit}
            className="text-xs text-slate-500 hover:text-slate-300 cursor-pointer transition-colors"
          >
            &larr; Back to public website
          </button>
        </div>
      </div>
    </div>
  );
};
