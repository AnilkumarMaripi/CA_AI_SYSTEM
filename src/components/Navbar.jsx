import React, { useState } from 'react';
import { Users, Calendar, FolderCheck, GitCompare, LayoutGrid, BarChart3, Sparkles, MessageSquare, Camera, Lock, Menu, X, UserCheck } from 'lucide-react';

export default function Navbar({ activeModule, setActiveModule, currentUser, onOpenAuthModal }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'clients', label: 'Clients', icon: Users },
    { id: 'compliance', label: 'Compliance Calendar', icon: Calendar },
    { id: 'documents', label: 'Docs Collection', icon: FolderCheck },
    { id: 'reconciliation', label: 'CSV Reconciler', icon: GitCompare },
    { id: 'tasks', label: 'Task Kanban', icon: LayoutGrid },
    { id: 'dashboard', label: 'Firm Analytics', icon: BarChart3 },
    { id: 'feed', label: 'AI Feed', icon: Sparkles },
    { id: 'connections', label: 'CA Network', icon: Users },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'ai-assistant', label: 'AI Scanner', icon: Camera },
    { id: 'login', label: 'Login & Network', icon: Lock },
  ];

  const handleSelectModule = (id) => {
    setActiveModule(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="w-full py-4 px-4 sm:px-8 flex justify-center sticky top-0 z-50">
      <div className="nav-pill max-w-full overflow-x-auto scrollbar-none flex items-center justify-between shadow-lg">
        
        {/* Brand Logo */}
        <div 
          className="logo flex items-center gap-2 cursor-pointer select-none shrink-0" 
          onClick={() => handleSelectModule('clients')}
        >
          <div className="w-7 h-7 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-600 font-extrabold text-xs">
            ⚖️
          </div>
          <span className="font-bold text-[17px] text-[#1A1814] tracking-tight font-display">
            Tax<span className="text-[#059669]">Desk</span>
          </span>
        </div>

        {/* Desktop Nav Module Links */}
        <div className="hidden lg:flex items-center space-x-1">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeModule === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelectModule(item.id)}
                className={`nav-link flex items-center gap-1.5 ${isActive ? 'active' : ''}`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#059669]' : 'text-slate-500'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right CTA: Staff Login / User Badge */}
        <div className="flex items-center gap-2 shrink-0">
          {currentUser ? (
            <div className="flex items-center gap-2 bg-white border border-[#E2DAC8] px-3 py-1.5 rounded-full text-xs text-[#1A1814] shadow-sm">
              <UserCheck className="w-4 h-4 text-[#059669]" />
              <div className="hidden sm:block text-left leading-tight">
                <span className="font-bold block text-[11px] text-[#1A1814]">{currentUser.name || currentUser.full_name || 'Staff User'}</span>
                <span className="text-[9px] uppercase tracking-wider text-[#059669] font-mono">{currentUser.role || 'Member'}</span>
              </div>
            </div>
          ) : (
            <button
              onClick={() => handleSelectModule('login')}
              className="btn-black flex items-center gap-1.5 text-xs py-2 px-4"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Staff Login</span>
            </button>
          )}

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-700 hover:text-slate-900 bg-[#EDE7D9] border border-[#E2DAC8] rounded-full flex items-center justify-center w-9 h-9"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>

      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-20 left-4 right-4 bg-[#FAF7F2] border border-[#E2DAC8] rounded-2xl p-4 shadow-2xl space-y-2 z-50">
          <div className="grid grid-cols-2 gap-2 text-xs font-medium">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeModule === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectModule(item.id)}
                  className={`p-3 rounded-xl border flex items-center gap-2 transition-all text-left ${
                    isActive
                      ? 'bg-[#D1FAE5] border-[#A7F3D0] text-[#064E3B] font-bold'
                      : 'bg-white border-[#E2DAC8] text-slate-700 hover:bg-[#F5F0E8]'
                  }`}
                >
                  <Icon className="w-4 h-4 text-[#059669] shrink-0" />
                  <span className="line-clamp-1 text-[11px]">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
