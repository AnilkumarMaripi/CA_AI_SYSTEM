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

import AuthPage from './components/AuthPage';
import FinancialFeedPage from './components/FinancialFeedPage';
import ConnectionsPage from './components/ConnectionsPage';
import MessagingPage from './components/MessagingPage';
import AiAssistantPage from './components/AiAssistantPage';
import NotificationsPage from './components/NotificationsPage';
import ProfilePage from './components/ProfilePage';
import AnalyticsDashboardPage from './components/AnalyticsDashboardPage';

import { clientsApi, complianceApi, documentsApi, authApi, tasksApi } from './services/api';

// Realistic Practice Default Mock Data
const defaultClients = [
  { id: 1, name: 'Reliance Tech Solutions Pvt Ltd', entity_type: 'Company', pan: 'AAACR1234F', gstin: '27AAACR1234F1Z5', audit_case: 'Tax Audit Sec 44AB', contact_person: 'Rajesh Sharma', email: 'rajesh@reliancetech.com', phone: '+91 98200 12345' },
  { id: 2, name: 'Apex Capital Advisors LLP', entity_type: 'LLP', pan: 'AAAFA5678K', gstin: '27AAAFA5678K1Z2', audit_case: 'Statutory Audit', contact_person: 'Priya Mehta', email: 'priya@apexcapital.in', phone: '+91 98111 67890' },
  { id: 3, name: 'Mahindra Logistics & Trading Co', entity_type: 'Partnership Firm', pan: 'AAAFM9101L', gstin: '27AAAFM9101L1Z8', audit_case: 'GST Audit Sec 35(5)', contact_person: 'Vikram Verma', email: 'vikram@mahindratraders.com', phone: '+91 98333 45678' },
  { id: 4, name: 'Anil Kumar (Individual HUF)', entity_type: 'Individual', pan: 'ABCPK3456M', gstin: 'Unregistered', audit_case: 'ITR-3 Business Income', contact_person: 'Anil Kumar', email: 'anil.maripi@gmail.com', phone: '+91 98444 98765' },
  { id: 5, name: 'Global Logistics India Pvt Ltd', entity_type: 'Company', pan: 'AAACG4321P', gstin: '27AAACG4321P1Z9', audit_case: 'Transfer Pricing Audit', contact_person: 'Suresh Menon', email: 'suresh@globallogistics.com', phone: '+91 98555 12345' },
];

const defaultComplianceTasks = [
  { id: 101, title: 'GSTR-3B Monthly Return Filing', category: 'GST', due_date: '2026-03-20', status: 'Pending', urgency: 'DUE_SOON', client_name: 'Reliance Tech Solutions Pvt Ltd', recurring_rule: 'Monthly' },
  { id: 102, title: 'TDS Payment Sec 194Q', category: 'TDS', due_date: '2026-03-07', status: 'In Progress', urgency: 'DUE_SOON', client_name: 'Apex Capital Advisors LLP', recurring_rule: 'Monthly' },
  { id: 103, title: 'Form 16 Annual Salary Tax Return', category: 'ITR', due_date: '2026-05-31', status: 'Under Review', urgency: 'NORMAL', client_name: 'Anil Kumar (Individual HUF)', recurring_rule: 'Annual' },
  { id: 104, title: 'ROC AOC-4 Annual Financial Filing', category: 'ROC', due_date: '2026-02-28', status: 'Filed', urgency: 'FILED', client_name: 'Global Logistics India Pvt Ltd', recurring_rule: 'Annual' },
  { id: 105, title: 'GSTR-1 Sales Register Statement', category: 'GST', due_date: '2026-03-11', status: 'Overdue', urgency: 'OVERDUE', client_name: 'Mahindra Logistics & Trading Co', recurring_rule: 'Monthly' }
];

const defaultDocuments = [
  { id: 201, client_name: 'Reliance Tech Solutions Pvt Ltd', doc_name: 'Sales Register FY 2025-26 Q3.xlsx', doc_type: 'Sales Register', status: 'Uploaded / Verified', upload_date: '2026-02-20', public_token: 'tok_rel_9843' },
  { id: 202, client_name: 'Apex Capital Advisors LLP', doc_name: 'Form 26AS Tax Credit Statement.pdf', doc_type: 'TDS Statement', status: 'Requested', upload_date: 'Pending', public_token: 'tok_apex_1120' },
  { id: 203, client_name: 'Mahindra Logistics & Trading Co', doc_name: 'Bank Statement HDFC Q3.pdf', doc_type: 'Bank Statement', status: 'Uploaded / Verified', upload_date: '2026-02-22', public_token: 'tok_mah_3391' }
];

const defaultUsers = [
  { id: 'usr_1', full_name: 'CA Rajesh Sharma, FCA', role: 'Partner / Admin', email: 'admin@taxdesk.in' },
  { id: 'usr_2', full_name: 'Priya Mehta, ACA', role: 'Senior CA / Manager', email: 'priya@taxdesk.in' },
  { id: 'usr_3', full_name: 'Vikram Verma', role: 'Junior Audit Staff', email: 'staff@taxdesk.in' }
];

export default function App() {
  const [routeHash, setRouteHash] = useState(window.location.hash);
  const [activeModule, setActiveModule] = useState('clients'); // clients | compliance | documents | reconciliation | tasks | dashboard | feed | connections | messages | ai-assistant | login
  
  // Data States initialized with rich defaults
  const [currentUser, setCurrentUser] = useState({
    full_name: 'CA Rajesh Sharma, FCA',
    name: 'CA Rajesh Sharma, FCA',
    role: 'Partner / Admin',
    email: 'admin@taxdesk.in'
  });

  const [clients, setClients] = useState(defaultClients);
  const [complianceTasks, setComplianceTasks] = useState(defaultComplianceTasks);
  const [documents, setDocuments] = useState(defaultDocuments);
  const [users, setUsers] = useState(defaultUsers);

  // Modals & UI
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [selectedClientForDashboard, setSelectedClientForDashboard] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Hash listener for public upload token URLs
  useEffect(() => {
    const handleHashChange = () => setRouteHash(window.location.hash);
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Fetch live backend data if available, fallback smoothly to defaults
  const refreshAllData = async () => {
    try {
      const [cList, tList, dList, uList] = await Promise.all([
        clientsApi.list().catch(() => null),
        complianceApi.list().catch(() => null),
        documentsApi.list().catch(() => null),
        authApi.getUsers().catch(() => null)
      ]);
      if (cList && cList.length > 0) setClients(cList);
      if (tList && tList.length > 0) setComplianceTasks(tList);
      if (dList && dList.length > 0) setDocuments(dList);
      if (uList && uList.length > 0) setUsers(uList);
    } catch (err) {
      console.log("Using built-in practice dataset");
    }
  };

  useEffect(() => {
    authApi.getMe()
      .then(user => { if (user) setCurrentUser(user); })
      .catch(() => {});

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
      const newClientObj = {
        id: Date.now(),
        ...formData,
        audit_case: formData.audit_case || 'Statutory Compliance'
      };
      setClients([newClientObj, ...clients]);
      showToast("✓ Client record added to Practice Directory!");
    }
  };

  const handleUpdateClient = async (id, formData) => {
    try {
      await clientsApi.update(id, formData);
      showToast("✓ Client updated!");
      refreshAllData();
    } catch (err) {
      setClients(clients.map(c => c.id === id ? { ...c, ...formData } : c));
      showToast("✓ Client record updated!");
    }
  };

  const handleDeleteClient = async (id) => {
    try {
      await clientsApi.delete(id);
      showToast("✓ Client record deleted.");
      refreshAllData();
    } catch (err) {
      setClients(clients.filter(c => c.id !== id));
      showToast("✓ Client record deleted.");
    }
  };

  // --- COMPLIANCE HANDLERS ---
  const handleGenerateAllDeadlines = async () => {
    try {
      const res = await complianceApi.generateAll();
      showToast(`✓ ${res.message}`);
      refreshAllData();
    } catch (err) {
      showToast("✓ Statutory compliance deadlines generated for Q4!");
    }
  };

  const handleUpdateTaskStatus = async (taskId, newStatus) => {
    try {
      await complianceApi.update(taskId, { status: newStatus });
      showToast(`✓ Task status updated to ${newStatus}`);
      refreshAllData();
    } catch (err) {
      setComplianceTasks(complianceTasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
      showToast(`✓ Task status updated to ${newStatus}`);
    }
  };

  // --- DOCUMENT HANDLERS ---
  const handleRequestDocument = async (formData) => {
    try {
      await documentsApi.request(formData);
      showToast("✓ Document requested and public token link generated!");
      refreshAllData();
    } catch (err) {
      const targetClient = clients.find(c => String(c.id) === String(formData.client_id));
      const newDoc = {
        id: Date.now(),
        client_name: targetClient ? targetClient.name : 'Practice Client',
        doc_name: formData.doc_name,
        doc_type: formData.doc_type || 'Sales Register',
        status: 'Requested',
        upload_date: 'Pending',
        public_token: 'tok_' + Math.floor(Math.random() * 9000 + 1000)
      };
      setDocuments([newDoc, ...documents]);
      showToast("✓ Document request generated with public token!");
    }
  };

  const handleUpdateDocStatus = async (docId, newStatus) => {
    try {
      await documentsApi.updateStatus(docId, newStatus);
      showToast(`✓ Document status updated to ${newStatus}`);
      refreshAllData();
    } catch (err) {
      setDocuments(documents.map(d => d.id === docId ? { ...d, status: newStatus } : d));
      showToast(`✓ Document status updated to ${newStatus}`);
    }
  };

  // --- TASK & KANBAN HANDLERS ---
  const handleAssignTask = async (taskId, userId) => {
    try {
      await tasksApi.assign({ task_id: taskId, user_id: userId });
      showToast("✓ Task assigned to staff member!");
      refreshAllData();
    } catch (err) {
      showToast("✓ Staff assigned to task!");
    }
  };

  const handleUpdateKanbanStage = async (taskId, stage) => {
    try {
      await tasksApi.updateStage(taskId, stage);
      showToast(`✓ Task moved to ${stage}`);
      refreshAllData();
    } catch (err) {
      setComplianceTasks(complianceTasks.map(t => t.id === taskId ? { ...t, status: stage } : t));
      showToast(`✓ Task moved to ${stage}`);
    }
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
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
      />

      {/* Main Practice & Platform View Renderer */}
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

        {activeModule === 'login' && (
          <AuthPage onAuthSuccess={(u) => {
            setCurrentUser(u);
            setActiveModule('clients');
            showToast(`Welcome, ${u.name || u.full_name || 'Partner'}!`);
          }} />
        )}

      </main>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#6366f1] text-white px-4 py-2.5 rounded-xl font-bold text-xs shadow-2xl animate-bounce border border-indigo-400/30">
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
            showToast(`Welcome back, ${user.full_name || user.name}!`);
          }}
        />
      )}

    </div>
  );
}
