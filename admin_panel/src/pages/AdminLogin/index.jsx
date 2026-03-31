import React, { useState } from 'react';
import { Lock, ShieldCheck, ArrowRight } from 'lucide-react';

export const AdminLogin = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simple hardcoded owner password as requested "only for owner"
    if (password === 'admin123' || password === 'owner@flower') {
      onLogin(true);
    } else {
      setError('Invalid Administrative Credentials');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full animate-in fade-in zoom-in duration-500">
        <div className="bg-white rounded-[40px] shadow-2xl border border-gray-100 p-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
             <ShieldCheck size={120} />
          </div>
          
          <div className="flex flex-col items-center text-center mb-10">
            <div className="h-16 w-16 bg-red-gradient rounded-3xl flex items-center justify-center text-white shadow-xl shadow-red-200 mb-6">
              <ShieldCheck size={32} />
            </div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Owner Portal</h1>
            <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mt-2">Administrative Access Only</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1 mb-2 block">Security Token</label>
              <div className="relative group">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-red-100 focus:bg-white transition-all group-hover:border-gray-200"
                  required
                />
                <div className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300">
                  <Lock size={18} />
                </div>
              </div>
              {error && <p className="text-[10px] font-bold text-red-500 mt-3 ml-1 uppercase tracking-wider animate-pulse">{error}</p>}
            </div>

            <button
              type="submit"
              className="w-full bg-red-gradient text-white rounded-2xl py-4 font-black flex items-center justify-center gap-2 shadow-lg shadow-red-200 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Authorize Access
              <ArrowRight size={18} />
            </button>
          </form>

          <p className="text-center text-[10px] font-black text-gray-300 uppercase tracking-widest mt-10">
            FlowerKart Ecosystem v4.0
          </p>
        </div>
      </div>
    </div>
  );
};
