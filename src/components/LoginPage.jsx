import React, { useState } from 'react';
import { useAuthAndConnections } from '../hooks/useAuthAndConnections';
import { ShieldCheck, Mail, Lock, LogIn, LogOut, CheckCircle2, UserCheck, Users, UserPlus, ArrowRight, Chrome, Github } from 'lucide-react';

export default function LoginPage({ onLoginSuccess }) {
  const {
    activeUser,
    loading,
    error: authError,
    connections,
    availableUsers,
    pendingRequests,
    login,
    loginWithGoogle,
    loginWithGithub,
    logout,
    toggleConnection,
    acceptRequest,
    rejectRequest,
  } = useAuthAndConnections();

  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('admin@taxdesk.in');
  const [password, setPassword] = useState('admin123');
  const [fullName, setFullName] = useState('');
  const [localError, setLocalError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-8">
        <div className="glass-panel p-8 text-center space-y-3 font-mono text-sm max-w-sm">
          <div className="w-8 h-8 border-2 border-[#0047FF] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-[#6B6560]">Authenticating Practice Session...</p>
        </div>
      </div>
    );
  }

  // --- SUBMIT LOCAL LOGIN OR REGISTER ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    setIsSubmitting(true);
    try {
      const user = await login(email, password);
      if (onLoginSuccess) onLoginSuccess(user);
    } catch (err) {
      setLocalError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- SOCIAL LOGINS ---
  const handleGoogle = async () => {
    try {
      const user = await loginWithGoogle();
      if (onLoginSuccess) onLoginSuccess(user);
    } catch (err) {
      setLocalError('Google OAuth Sign-in failed.');
    }
  };

  const handleGithub = async () => {
    try {
      const user = await loginWithGithub();
      if (onLoginSuccess) onLoginSuccess(user);
    } catch (err) {
      setLocalError('GitHub OAuth Sign-in failed.');
    }
  };

  // --- IF USER IS ALREADY LOGGED IN: SHOW DASHBOARD & CONNECTIONS ---
  if (activeUser) {
    return (
      <div className="max-w-5xl mx-auto space-y-6 font-sans">
        
        {/* Logged-In User Profile Banner */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-[#0047FF] text-white flex items-center justify-center text-xl font-extrabold font-mono shadow-md shrink-0">
              {activeUser.name ? activeUser.name.charAt(0) : 'U'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-extrabold text-[#1A1814]">{activeUser.name || 'CA Practice Member'}</h2>
                <span className="px-2.5 py-0.5 rounded-full bg-[#E8EEFF] text-[#0047FF] text-[10px] font-mono font-bold border border-[#0047FF]/20 uppercase">
                  {activeUser.role || 'Partner'}
                </span>
              </div>
              <p className="text-xs text-[#6B6560] font-mono mt-0.5">
                Authenticated Session: <span className="text-[#1A1814] font-semibold">{activeUser.email}</span>
              </p>
            </div>
          </div>

          <button
            onClick={logout}
            className="book-cta bg-[#FF4D00] border-[#FF4D00] hover:bg-rose-700"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out Session</span>
          </button>
        </div>

        {/* Connections & Developer Network Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Pending Connection Requests */}
          <div className="glass-panel p-5 rounded-2xl space-y-4 md:col-span-1">
            <h3 className="text-xs font-extrabold text-[#1A1814] uppercase tracking-wider flex items-center justify-between border-b border-[rgba(26,24,20,0.12)] pb-3">
              <span className="flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-[#0047FF]" />
                Pending Requests
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#0047FF] text-white text-[10px] font-mono font-bold">
                {pendingRequests.length}
              </span>
            </h3>

            {pendingRequests.length === 0 ? (
              <p className="text-xs text-[#6B6560] font-mono py-4 text-center">No pending connection requests.</p>
            ) : (
              <ul className="space-y-3">
                {pendingRequests.map((req) => (
                  <li key={req.request_id || req.id} className="bg-[#FAF7F2] p-3 rounded-xl border border-[rgba(26,24,20,0.12)] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-[#1A1814]">{req.name}</span>
                      <span className="text-[10px] text-[#6B6560] font-mono">@{req.username}</span>
                    </div>
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => acceptRequest(req.id)}
                        className="flex-1 py-1.5 bg-[#0047FF] text-white text-[11px] font-bold font-mono rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => rejectRequest(req.id)}
                        className="flex-1 py-1.5 bg-[#EDE7D9] text-[#6B6560] text-[11px] font-bold font-mono rounded-lg hover:bg-slate-300 transition-colors"
                      >
                        Reject
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* My Active Practice Connections */}
          <div className="glass-panel p-5 rounded-2xl space-y-4 md:col-span-2">
            <h3 className="text-xs font-extrabold text-[#1A1814] uppercase tracking-wider flex items-center justify-between border-b border-[rgba(26,24,20,0.12)] pb-3">
              <span className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[#0047FF]" />
                Active Connections ({connections.length})
              </span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {connections.map((user) => (
                <div key={user.id} className="bg-[#FAF7F2] p-3.5 rounded-xl border border-[rgba(26,24,20,0.12)] flex items-center justify-between gap-2">
                  <div className="flex items-center space-x-3">
                    <img
                      src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`}
                      alt={user.name}
                      className="w-9 h-9 rounded-full border border-[rgba(26,24,20,0.12)] shrink-0 object-cover"
                    />
                    <div>
                      <span className="font-bold text-xs text-[#1A1814] block line-clamp-1">{user.name}</span>
                      <span className="text-[10px] text-[#6B6560] font-mono">@{user.username}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleConnection(user.id)}
                    className="px-2.5 py-1 text-[10px] font-bold font-mono text-[#FF4D00] border border-[#FF4D00]/30 rounded-lg hover:bg-rose-50 transition-colors shrink-0"
                  >
                    Disconnect
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    );
  }

  // --- FULL EDITORIAL LOGIN / REGISTER PAGE ---
  return (
    <div className="max-w-md mx-auto py-6 space-y-6 font-sans">
      
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-[#0047FF] text-white flex items-center justify-center mx-auto shadow-lg">
          <ShieldCheck className="w-7 h-7" />
        </div>
        <h1 className="text-xl font-extrabold text-[#1A1814]">
          {isRegistering ? 'Register CA Practice Staff' : 'CA Practice Authentication'}
        </h1>
        <p className="text-xs text-[#6B6560] font-mono">
          TaxDesk Secure Practice Management & Statutory Portal
        </p>
      </div>

      {/* Main Form Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl space-y-6 shadow-xl">
        
        {/* Tab Toggle */}
        <div className="flex bg-[#EDE7D9] p-1 rounded-xl font-mono text-xs font-bold border border-[rgba(26,24,20,0.12)]">
          <button
            type="button"
            onClick={() => { setIsRegistering(false); setLocalError(''); }}
            className={`flex-1 py-2 rounded-lg transition-all ${!isRegistering ? 'bg-[#1A1814] text-[#FAF7F2] shadow-sm' : 'text-[#6B6560] hover:text-[#1A1814]'}`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setIsRegistering(true); setLocalError(''); }}
            className={`flex-1 py-2 rounded-lg transition-all ${isRegistering ? 'bg-[#1A1814] text-[#FAF7F2] shadow-sm' : 'text-[#6B6560] hover:text-[#1A1814]'}`}
          >
            Create Account
          </button>
        </div>

        {/* Error Alert */}
        {(localError || authError) && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-mono flex items-start gap-2">
            <span className="font-bold">✕</span>
            <span>{localError || authError}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {isRegistering && (
            <div>
              <label className="text-[#1A1814] font-bold block mb-1 font-mono">Full Name & Qualification *</label>
              <input
                type="text"
                required
                placeholder="e.g. Rajesh Sharma, FCA"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-[rgba(26,24,20,0.12)] rounded-xl p-3 text-[#1A1814] font-mono focus:border-[#0047FF] outline-none"
              />
            </div>
          )}

          <div>
            <label className="text-[#1A1814] font-bold block mb-1 font-mono flex items-center justify-between">
              <span>Practice Email Address *</span>
              <Mail className="w-3.5 h-3.5 text-[#6B6560]" />
            </label>
            <input
              type="email"
              required
              placeholder="admin@taxdesk.in"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#FAF7F2] border border-[rgba(26,24,20,0.12)] rounded-xl p-3 text-[#1A1814] font-mono focus:border-[#0047FF] outline-none"
            />
          </div>

          <div>
            <label className="text-[#1A1814] font-bold block mb-1 font-mono flex items-center justify-between">
              <span>Password *</span>
              <Lock className="w-3.5 h-3.5 text-[#6B6560]" />
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#FAF7F2] border border-[rgba(26,24,20,0.12)] rounded-xl p-3 text-[#1A1814] font-mono focus:border-[#0047FF] outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 bg-[#1A1814] hover:bg-[#0047FF] text-[#FAF7F2] font-bold text-xs font-mono rounded-xl shadow-md transition-all flex items-center justify-center space-x-2"
          >
            <LogIn className="w-4 h-4" />
            <span>{isSubmitting ? 'Authenticating...' : isRegistering ? 'Register & Sign In' : 'Sign In to TaxDesk'}</span>
          </button>
        </form>

        {/* Divider */}
        <div className="relative flex items-center justify-center my-4">
          <div className="border-t border-[rgba(26,24,20,0.12)] w-full"></div>
          <span className="bg-[#F5F0E8] px-3 text-[10px] font-mono text-[#6B6560] uppercase tracking-wider relative z-10">
            Or continue with
          </span>
        </div>

        {/* Social Login Options */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={handleGoogle}
            className="py-2.5 px-3 bg-[#FAF7F2] border border-[rgba(26,24,20,0.12)] rounded-xl text-xs font-mono font-bold text-[#1A1814] hover:border-[#0047FF] hover:bg-white transition-all flex items-center justify-center gap-2"
          >
            <Chrome className="w-4 h-4 text-rose-500" />
            <span>Google</span>
          </button>

          <button
            type="button"
            onClick={handleGithub}
            className="py-2.5 px-3 bg-[#FAF7F2] border border-[rgba(26,24,20,0.12)] rounded-xl text-xs font-mono font-bold text-[#1A1814] hover:border-[#0047FF] hover:bg-white transition-all flex items-center justify-center gap-2"
          >
            <Github className="w-4 h-4 text-slate-800" />
            <span>GitHub</span>
          </button>
        </div>

        {/* Quick Demo Login Credentials Pill */}
        <div className="pt-3 border-t border-[rgba(26,24,20,0.12)] text-center space-y-2">
          <span className="text-[10px] font-mono text-[#6B6560] uppercase tracking-wider block">
            Quick Practice Demo Fill
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => { setEmail('admin@taxdesk.in'); setPassword('admin123'); }}
              className="flex-1 py-1.5 bg-[#EDE7D9] text-[#1A1814] rounded-lg text-[10px] font-mono font-bold hover:bg-[#E8EEFF] hover:text-[#0047FF] transition-colors"
            >
              Partner / Admin
            </button>
            <button
              type="button"
              onClick={() => { setEmail('staff@taxdesk.in'); setPassword('staff123'); }}
              className="flex-1 py-1.5 bg-[#EDE7D9] text-[#1A1814] rounded-lg text-[10px] font-mono font-bold hover:bg-[#E8EEFF] hover:text-[#0047FF] transition-colors"
            >
              Audit Staff
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
