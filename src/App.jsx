import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import AuthPage from './components/AuthPage';
import FinancialFeedPage from './components/FinancialFeedPage';
import ConnectionsPage from './components/ConnectionsPage';
import MessagingPage from './components/MessagingPage';
import AiAssistantPage from './components/AiAssistantPage';
import NotificationsPage from './components/NotificationsPage';
import ProfilePage from './components/ProfilePage';
import AnalyticsDashboardPage from './components/AnalyticsDashboardPage';

import ClientManager from './components/ClientManager';
import ClientDashboardModal from './components/ClientDashboardModal';
import ComplianceCalendar from './components/ComplianceCalendar';
import DocumentCollection from './components/DocumentCollection';
import ClientUploadPortal from './components/ClientUploadPortal';
import ReconciliationTool from './components/ReconciliationTool';
import TaskKanbanBoard from './components/TaskKanbanBoard';

import { clientsApi, complianceApi, documentsApi, authApi, tasksApi } from './services/api';

export default function App() {
  const [routeHash, setRouteHash] = useState(window.location.hash);
  const [activeModule, setActiveModule] = useState('feed'); // feed | connections | messages | ai-assistant | notifications | profile | dashboard | login
  
  // Data States
  const [currentUser, setCurrentUser] = useState({
    name: 'CA Anil Kumar, FCA',
    handle: '@ca_anil',
    role: 'Senior Partner',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80'
  });

  const [toastMessage, setToastMessage] = useState(null);

  // Hash listener for public upload token URLs
  useEffect(() => {
    const handleHashChange = () => setRouteHash(window.location.hash);
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Check if hash is public token upload link
  if (routeHash.startsWith('#/public/upload/')) {
    const token = routeHash.replace('#/public/upload/', '');
    return <ClientUploadPortal token={token} />;
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-[#f8fafc] flex flex-col font-sans">
      <div className="top-bar"></div>
      
      {/* Top Navbar */}
      <Navbar
        activeModule={activeModule}
        setActiveModule={setActiveModule}
        currentUser={currentUser}
        onOpenAuthModal={() => setActiveModule('login')}
      />

      {/* Main 8-Page View Renderer */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        
        {activeModule === 'feed' && (
          <FinancialFeedPage />
        )}

        {activeModule === 'connections' && (
          <ConnectionsPage />
        )}

        {activeModule === 'messages' && (
          <MessagingPage />
        )}

        {activeModule === 'ai-assistant' && (
          <AiAssistantPage />
        )}

        {activeModule === 'notifications' && (
          <NotificationsPage />
        )}

        {activeModule === 'profile' && (
          <ProfilePage user={currentUser} />
        )}

        {activeModule === 'dashboard' && (
          <AnalyticsDashboardPage />
        )}

        {activeModule === 'login' && (
          <AuthPage onAuthSuccess={(u) => {
            setCurrentUser(u);
            setActiveModule('feed');
            showToast(`Welcome, ${u.name || 'Member'}!`);
          }} />
        )}

      </main>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#6366f1] text-white px-4 py-2.5 rounded-xl font-bold text-xs shadow-2xl animate-bounce border border-indigo-400/30">
          {toastMessage}
        </div>
      )}

    </div>
  );
}
