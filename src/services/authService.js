import { authApi } from './api';

// Check if current session token is valid
export async function checkAuthStatus() {
  const token = localStorage.getItem('taxdesk_token');
  if (!token) return null;

  try {
    const user = await authApi.getMe();
    return { user };
  } catch (err) {
    localStorage.removeItem('taxdesk_token');
    localStorage.removeItem('taxdesk_user');
    return null;
  }
}

// Local Email/Password Login
export async function loginLocalUser({ email, password }) {
  const data = await authApi.login({ email, password });
  if (data.access_token) {
    localStorage.setItem('taxdesk_token', data.access_token);
  }
  if (data.user) {
    localStorage.setItem('taxdesk_user', JSON.stringify(data.user));
  }
  return data;
}

// Google OAuth Login
export async function signInWithGoogle() {
  // Simulating Google OAuth Sign-in integration
  const mockGoogleUser = {
    id: 'g_' + Date.now(),
    name: 'Google Practice Partner',
    email: 'partner@taxdesk.in',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80'
  };
  localStorage.setItem('taxdesk_token', 'google_oauth_token_' + Date.now());
  localStorage.setItem('taxdesk_user', JSON.stringify(mockGoogleUser));
  return { user: mockGoogleUser };
}

// GitHub OAuth Login
export async function signInWithGithub() {
  // Simulating GitHub OAuth Sign-in integration
  const mockGithubUser = {
    id: 'gh_' + Date.now(),
    name: 'GitHub Lead Developer',
    email: 'dev@taxdesk.in',
    role: 'senior',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80'
  };
  localStorage.setItem('taxdesk_token', 'github_oauth_token_' + Date.now());
  localStorage.setItem('taxdesk_user', JSON.stringify(mockGithubUser));
  return { user: mockGithubUser };
}

// Logout session
export async function logoutUser() {
  localStorage.removeItem('taxdesk_token');
  localStorage.removeItem('taxdesk_user');
  return true;
}

// Networking & Connection APIs
let localConnections = [
  { id: '101', name: 'Rajesh Sharma, FCA', username: 'rajesh_fca', role: 'Partner', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&q=80' },
  { id: '102', name: 'Priya Mehta, ACA', username: 'priya_tax', role: 'Senior Audit Manager', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80' }
];

let localAvailableUsers = [
  { id: '101', name: 'Rajesh Sharma, FCA', username: 'rajesh_fca', role: 'Partner' },
  { id: '102', name: 'Priya Mehta, ACA', username: 'priya_tax', role: 'Senior Audit Manager' },
  { id: '103', name: 'Anil Kumar', username: 'anil_maripi', role: 'Lead Architect' },
  { id: '104', name: 'Sneha Roy', username: 'sneha_compliance', role: 'GST Specialist' },
  { id: '105', name: 'Vikram Verma', username: 'vikram_v', role: 'Financial Controller' }
];

let localPendingRequests = [
  { id: 'req_1', request_id: 'req_1', name: 'Sneha Roy', username: 'sneha_compliance' }
];

export async function fetchConnections() {
  return localConnections;
}

export async function fetchUsers() {
  return localAvailableUsers;
}

export async function toggleConnection(targetUserId) {
  const existsIndex = localConnections.findIndex(c => c.id === targetUserId);
  if (existsIndex >= 0) {
    localConnections.splice(existsIndex, 1);
    return { status: 'unfollowed' };
  } else {
    const userToAdd = localAvailableUsers.find(u => u.id === targetUserId);
    if (userToAdd) {
      localConnections.push({
        ...userToAdd,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userToAdd.username}`
      });
    }
    return { status: 'followed' };
  }
}

export async function sendFollowRequest(targetUserId) {
  return { status: 'requested', targetUserId };
}

export async function fetchPendingFollowRequests() {
  return localPendingRequests;
}

export async function confirmFollowRequest(requestId) {
  const reqIndex = localPendingRequests.findIndex(r => r.id === requestId);
  if (reqIndex >= 0) {
    const req = localPendingRequests[reqIndex];
    localPendingRequests.splice(reqIndex, 1);
    localConnections.push({
      id: 'usr_' + Date.now(),
      name: req.name,
      username: req.username,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${req.username}`
    });
  }
  return { status: 'accepted' };
}

export async function rejectFollowRequest(requestId) {
  localPendingRequests = localPendingRequests.filter(r => r.id !== requestId);
  return { status: 'rejected' };
}
