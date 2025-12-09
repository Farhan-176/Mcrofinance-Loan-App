import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  changePassword: (data) => api.post('/auth/change-password', data),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
};

// Loan APIs
export const loanAPI = {
  getCategories: () => api.get('/loan/categories'),
  calculateLoan: (data) => api.post('/loan/calculate', data),
  createRequest: (data) => api.post('/loan/request', data),
  addGuarantors: (loanRequestId, data) => api.post(`/loan/request/${loanRequestId}/guarantors`, data),
  uploadDocuments: (loanRequestId, formData) =>
    api.post(`/loan/request/${loanRequestId}/documents`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  getUserRequests: () => api.get('/loan/requests'),
  getRequest: (id) => api.get(`/loan/request/${id}`),
  generateSlip: (loanRequestId) => api.get(`/loan/slip/${loanRequestId}`),
};

// Admin APIs
export const adminAPI = {
  getApplications: (params) => api.get('/admin/applications', { params }),
  getStats: () => api.get('/admin/stats'),
  updateStatus: (id, data) => api.put(`/admin/application/${id}/status`, data),
  assignToken: (id, data) => api.post(`/admin/application/${id}/assign`, data),
  getByToken: (tokenNumber) => api.get(`/admin/application/token/${tokenNumber}`),
};

export default api;
