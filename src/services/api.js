const API_BASE = 'http://127.0.0.1:8000/api/v1';

export function getAuthHeader() {
  const token = localStorage.getItem('taxdesk_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function requestApi(endpoint, options = {}) {
  const headers = {
    ...getAuthHeader(),
    ...(options.headers || {})
  };

  if (options.body && !(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(options.body);
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers
  });

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem('taxdesk_token');
      localStorage.removeItem('taxdesk_user');
    }
    const errorData = await response.json().catch(() => ({ detail: 'API Error' }));
    throw new Error(errorData.detail || `Request failed with status ${response.status}`);
  }

  return response.json();
}

// --- AUTH API ---
export const authApi = {
  login: (credentials) => requestApi('/auth/login', { method: 'POST', body: credentials }),
  register: (userData) => requestApi('/auth/register', { method: 'POST', body: userData }),
  getMe: () => requestApi('/auth/me'),
  getUsers: () => requestApi('/auth/users')
};

// --- CLIENTS API ---
export const clientsApi = {
  list: (params = {}) => {
    const query = new URLSearchParams();
    if (params.entity_type) query.append('entity_type', params.entity_type);
    if (params.search) query.append('search', params.search);
    return requestApi(`/clients?${query.toString()}`);
  },
  create: (clientData) => requestApi('/clients', { method: 'POST', body: clientData }),
  get: (id) => requestApi(`/clients/${id}`),
  update: (id, clientData) => requestApi(`/clients/${id}`, { method: 'PUT', body: clientData }),
  delete: (id) => requestApi(`/clients/${id}`, { method: 'DELETE' }),
  getDashboard: (id) => requestApi(`/clients/${id}/dashboard`)
};

// --- COMPLIANCE CALENDAR API ---
export const complianceApi = {
  list: (params = {}) => {
    const query = new URLSearchParams();
    if (params.category) query.append('category', params.category);
    if (params.urgency) query.append('urgency', params.urgency);
    if (params.client_id) query.append('client_id', params.client_id);
    if (params.search) query.append('search', params.search);
    return requestApi(`/compliance?${query.toString()}`);
  },
  generateAll: () => requestApi('/compliance/generate-all', { method: 'POST' }),
  update: (id, taskData) => requestApi(`/compliance/${id}`, { method: 'PUT', body: taskData })
};

// --- DOCUMENTS & PUBLIC UPLOAD LINK API ---
export const documentsApi = {
  list: (params = {}) => {
    const query = new URLSearchParams();
    if (params.client_id) query.append('client_id', params.client_id);
    if (params.status_filter) query.append('status_filter', params.status_filter);
    return requestApi(`/documents?${query.toString()}`);
  },
  request: (data) => requestApi(`/documents/request?client_id=${data.client_id}&doc_name=${encodeURIComponent(data.doc_name)}&doc_type=${encodeURIComponent(data.doc_type || 'Sales Register')}${data.task_id ? `&task_id=${data.task_id}` : ''}`, { method: 'POST' }),
  updateStatus: (id, statusVal) => requestApi(`/documents/${id}/status?status_value=${statusVal}`, { method: 'PUT' }),
  getPublicTokenInfo: (token) => requestApi(`/documents/public/token/${token}`),
  uploadPublicFile: async (token, file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch(`${API_BASE}/documents/public/upload/${token}`, {
      method: 'POST',
      body: formData
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({ detail: 'Upload failed' }));
      throw new Error(err.detail || 'Upload failed');
    }
    return response.json();
  }
};

// --- RECONCILIATION API ---
export const reconciliationApi = {
  listJobs: () => requestApi('/reconciliation'),
  runMatch: async (formData) => {
    const response = await fetch(`${API_BASE}/reconciliation/match`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: formData
    });
    if (!response.ok) throw new Error('Reconciliation failed');
    return response.json();
  },
  downloadExcel: async (formData) => {
    const response = await fetch(`${API_BASE}/reconciliation/export-excel`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: formData
    });
    if (!response.ok) throw new Error('Excel generation failed');
    return response.blob();
  }
};

// --- TASKS & KANBAN API ---
export const tasksApi = {
  assign: (data) => requestApi('/tasks/assign', { method: 'POST', body: data }),
  updateStage: (taskId, stage) => requestApi(`/tasks/${taskId}/stage?status_stage=${stage}`, { method: 'PUT' })
};

// --- ANALYTICS API ---
export const analyticsApi = {
  getOverview: () => requestApi('/analytics')
};
