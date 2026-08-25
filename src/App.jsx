import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import ClientManager from './components/ClientManager';
import ClientDashboardModal from './components/ClientDashboardModal';
import ComplianceCalendar from './components/ComplianceCalendar';
import DocumentCollection from './components/DocumentCollection';
import ClientUploadPortal from './components/ClientUploadPortal';
import ReconciliationTool from './components/ReconciliationTool';
import TaskKanbanBoard from './components/TaskKanbanBoard';
import FirmOwnerDashboard from './components/FirmOwnerDashboard';
import AuthModal from './components/AuthModal';

import { clientsApi, complianceApi, documentsApi, authApi, tasksApi } from './services/api';

export default function App() {
  const [routeHash, setRouteHash] = useState(window.location.hash);
  const [activeModule, setActiveModule] = useState('clients'); // clients | compliance | documents | reconciliation | tasks | dashboard
  
  // Data States
  const [currentUser, setCurrentUser] = useState(null);
  const [clients, setClients] = useState([]);
  const [complianceTasks, setComplianceTasks] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [users, setUsers] = useState([]);
  
  // Modals
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [selectedClientForDashboard, setSelectedClientForDashboard] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Hash listener for public upload token URLs
  useEffect(() => {
    const handleHashChange = () => setRouteHash(window.location.hash);
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Initial Data Fetching from FastAPI Backend
  const refreshAllData = async () => {
    try {
      const [cList, tList, dList, uList] = await Promise.all([
        clientsApi.list(),
        complianceApi.list(),
        documentsApi.list(),
        authApi.getUsers().catch(() => [])
      ]);
      setClients(cList);
      setComplianceTasks(tList);
      setDocuments(dList);
      setUsers(uList);
    } catch (err) {
      console.error("Data refresh error:", err);
    }
  };

  useEffect(() => {
    authApi.getMe()
      .then(user => setCurrentUser(user))
      .catch(() => setCurrentUser(null));

    refreshAllData();
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // --- CLIENT HANDLERS ---
  const handleCreateClient = async (formData) => {
    try {
      await clientsApi.create(formData);
      showToast("✓ Client created and statutory deadlines generated!");
      refreshAllData();
    } catch (err) {
      alert(err.message || "Failed to create client.");
    }
  };

  const handleUpdateClient = async (id, formData) => {
    try {
      await clientsApi.update(id, formData);
      showToast("✓ Client updated!");
      refreshAllData();
    } catch (err) {
      alert(err.message || "Failed to update client.");
    }
  };

  const handleDeleteClient = async (id) => {
    try {
      await clientsApi.delete(id);
      showToast("✓ Client record deleted.");
      refreshAllData();
    } catch (err) {
      alert(err.message || "Failed to delete client.");
    }
  };

  // --- COMPLIANCE HANDLERS ---
  const handleGenerateAllDeadlines = async () => {
    try {
      const res = await complianceApi.generateAll();
      showToast(`✓ ${res.message}`);
      refreshAllData();
    } catch (err) {
      alert("Failed to generate compliance deadlines.");
    }
  };

  const handleUpdateTaskStatus = async (taskId, newStatus) => {
    try {
      await complianceApi.update(taskId, { status: newStatus });
      showToast(`✓ Task status updated to ${newStatus}`);
      refreshAllData();
    } catch (err) {
      alert("Failed to update task status.");
    }
  };

  // --- DOCUMENT HANDLERS ---
  const handleRequestDocument = async (formData) => {
    try {
      await documentsApi.request(formData);
      showToast("✓ Document requested and public token link generated!");
      refreshAllData();
    } catch (err) {
      alert("Failed to request document.");
    }
  };

  const handleUpdateDocStatus = async (docId, newStatus) => {
    try {
      await documentsApi.updateStatus(docId, newStatus);
      showToast(`✓ Document status updated to ${newStatus}`);
      refreshAllData();
    } catch (err) {
      alert("Failed to update document status.");
    }
  };

  // --- TASK & KANBAN HANDLERS ---
  const handleAssignTask = async (taskId, userId) => {
    try {
      await tasksApi.assign({ task_id: taskId, user_id: userId });
      showToast("✓ Task assigned to staff member!");
      refreshAllData();
    } catch (err) {
      alert("Failed to assign task.");
    }
  };

  const handleUpdateKanbanStage = async (taskId, stage) => {
    try {
      await tasksApi.updateStage(taskId, stage);
      showToast(`✓ Task moved to ${stage}`);
      refreshAllData();
    } catch (err) {
      alert("Failed to update task stage.");
    }
  };

  // Check if hash is public token upload link
  if (routeHash.startsWith('#/public/upload/')) {
    const token = routeHash.replace('#/public/upload/', '');
    return <ClientUploadPortal token={token} />;
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1A1814] flex flex-col font-sans">
      <div className="top-bar"></div>
      
      {/* Top Navbar */}
      <Navbar
        activeModule={activeModule}
        setActiveModule={setActiveModule}
        currentUser={currentUser}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
      />

      {/* Main Module Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        
        {activeModule === 'clients' && (
          <ClientManager
            clients={clients}
            onCreateClient={handleCreateClient}
            onUpdateClient={handleUpdateClient}
            onDeleteClient={handleDeleteClient}
            onOpenClientDashboard={(client) => setSelectedClientForDashboard(client)}
          />
        )}

        {activeModule === 'compliance' && (
          <ComplianceCalendar
            tasks={complianceTasks}
            onUpdateTaskStatus={handleUpdateTaskStatus}
            onGenerateAllDeadlines={handleGenerateAllDeadlines}
          />
        )}

        {activeModule === 'documents' && (
          <DocumentCollection
            documents={documents}
            clients={clients}
            onRequestDocument={handleRequestDocument}
            onUpdateDocStatus={handleUpdateDocStatus}
          />
        )}

        {activeModule === 'reconciliation' && (
          <ReconciliationTool />
        )}

        {activeModule === 'tasks' && (
          <TaskKanbanBoard
            tasks={complianceTasks}
            users={users}
            onAssignTask={handleAssignTask}
            onUpdateStage={handleUpdateKanbanStage}
          />
        )}

        {activeModule === 'dashboard' && (
          <FirmOwnerDashboard />
        )}

      </main>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-emerald-500 text-slate-950 px-4 py-2.5 rounded-xl font-bold text-xs shadow-2xl animate-bounce">
          {toastMessage}
        </div>
      )}

      {/* Client 360° Dashboard Modal */}
      {selectedClientForDashboard && (
        <ClientDashboardModal
          client={selectedClientForDashboard}
          onClose={() => setSelectedClientForDashboard(null)}
        />
      )}

      {/* Staff Auth Modal */}
      {isAuthModalOpen && (
        <AuthModal
          onClose={() => setIsAuthModalOpen(false)}
          onAuthSuccess={(user) => {
            setCurrentUser(user);
            showToast(`Welcome back, ${user.full_name}!`);
            refreshAllData();
          }}
        />
      )}

    </div>
  );
}
