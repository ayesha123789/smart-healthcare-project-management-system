import axios from 'axios';

const API_BASE = '/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const projectAPI = {
  get: () => api.get('/project'),
  update: (data) => api.put('/project', data),
  close: (data) => api.post('/project/close', data)
};

export const userAPI = {
  getAll: () => api.get('/users'),
  create: (data) => api.post('/users', data)
};

export const milestoneAPI = {
  getAll: () => api.get('/milestones'),
  update: (id, data) => api.put(`/milestones/${id}`, data)
};

export const requirementAPI = {
  getAll: (params) => api.get('/requirements', { params }),
  create: (data) => api.post('/requirements', data),
  update: (id, data) => api.put(`/requirements/${id}`, data),
  setApproval: (id, status, remarks) => api.patch(`/requirements/${id}/approval`, { status, remarks }),
  delete: (id) => api.delete(`/requirements/${id}`)
};

export const wbsAPI = {
  getAll: () => api.get('/wbs'),
  create: (data) => api.post('/wbs', data),
  update: (id, data) => api.put(`/wbs/${id}`, data),
  delete: (id) => api.delete(`/wbs/${id}`)
};

export const changeRequestAPI = {
  getAll: () => api.get('/change-requests'),
  create: (data) => api.post('/change-requests', data),
  approve: (id, remarks) => api.patch(`/change-requests/${id}/approve`, { remarks }),
  reject: (id, remarks) => api.patch(`/change-requests/${id}/reject`, { remarks })
};

export const taskAPI = {
  getAll: () => api.get('/tasks'),
  create: (data) => api.post('/tasks', data),
  update: (id, data) => api.put(`/tasks/${id}`, data),
  delete: (id) => api.delete(`/tasks/${id}`)
};

export const evmAPI = {
  getMetrics: () => api.get('/evm')
};

export const defectAPI = {
  getAll: (params) => api.get('/defects', { params }),
  create: (data) => api.post('/defects', data),
  update: (id, data) => api.put(`/defects/${id}`, data),
  delete: (id) => api.delete(`/defects/${id}`)
};

export const qualityAPI = {
  getAll: () => api.get('/quality'),
  create: (data) => api.post('/quality', data),
  update: (id, data) => api.put(`/quality/${id}`, data)
};

export const riskAPI = {
  getAll: (params) => api.get('/risks', { params }),
  create: (data) => api.post('/risks', data),
  update: (id, data) => api.put(`/risks/${id}`, data),
  delete: (id) => api.delete(`/risks/${id}`)
};

export const systemAPI = {
  reseed: () => api.post('/seed')
};

export default api;
