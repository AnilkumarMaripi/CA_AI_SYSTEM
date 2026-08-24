import React, { useState } from 'react';
import { X, Lock, ShieldCheck, UserPlus, LogIn } from 'lucide-react';
import { authApi } from '../services/api';

export default function AuthModal({ onClose, onAuthSuccess }) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('senior');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegister) {
        await authApi.register({ email, password, full_name: fullName, role });
        const loginRes = await authApi.login({ email, password });
        localStorage.setItem('taxdesk_token', loginRes.access_token);
        onAuthSuccess(loginRes.user);
      } else {
        const loginRes = await authApi.login({ email, password });
        localStorage.setItem('taxdesk_token', loginRes.access_token);
        onAuthSuccess(loginRes.user);
      }
      setLoading(false);
      onClose();
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Authentication failed');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-[95vw] sm:max-w-md rounded-2xl shadow-2xl overflow-hidden p-5 sm:p-6 space-y-5 font-sans my-auto">
        
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            <h3 className="text-xs sm:text-sm font-extrabold text-white">
              {isRegister ? 'Register Practice Staff' : 'CA Staff Authentication'}
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs rounded-xl font-mono">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {isRegister && (
            <div>
              <label className="text-slate-300 font-bold block mb-1">Full Name & Qualification *</label>
              <input
                type="text"
                required
                placeholder="e.g. Rajesh Sharma, FCA"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-semibold focus:outline-none focus:border-emerald-500"
              />
            </div>
          )}

          <div>
            <label className="text-slate-300 font-bold block mb-1">Practice Email Address *</label>
            <input
              type="email"
              required
              placeholder="admin@taxdesk.in"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-semibold focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="text-slate-300 font-bold block mb-1">Password *</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          {isRegister && (
            <div>
              <label className="text-slate-300 font-bold block mb-1">Firm Role & Permissions</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-semibold focus:outline-none"
              >
                <option value="admin">Partner / Admin</option>
                <option value="senior">Senior CA / Manager</option>
                <option value="junior">Junior Audit Staff</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-extrabold text-xs rounded-xl shadow-md transition-all min-h-[44px]"
          >
            {loading ? 'Authenticating...' : isRegister ? 'Register & Login Staff' : 'Login to TaxDesk'}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-slate-800">
          <button
            onClick={() => setIsRegister(!isRegister)}
            className="text-xs text-cyan-400 font-semibold hover:underline"
          >
            {isRegister ? 'Already have a staff account? Login' : 'Register new staff member'}
          </button>
        </div>

      </div>
    </div>
  );
}
