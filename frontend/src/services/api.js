import axios from 'axios';

// Dynamic API URL: uses relative '/api' routed via Vite proxy or custom env
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000, // 60 seconds to accommodate Render free-tier wake-up (cold starts)
  withCredentials: true, // Enables sending secure HttpOnly cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach JWT Token if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('sr_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Graceful 401 handling (Prevents sudden session drops during presentation)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only treat explicit auth check failures as fatal session expiry, not background metrics/notifications
    const requestUrl = error.config?.url || '';
    if (error.response && error.response.status === 401 && (requestUrl.includes('/auth/me') || requestUrl.includes('/auth/logout'))) {
      localStorage.removeItem('sr_token');
      localStorage.removeItem('sr_user');
      window.dispatchEvent(new CustomEvent('auth:expired', {
        detail: { message: error.response?.data?.message || 'Session expired. Please log in again.' }
      }));
    }
    return Promise.reject(error);
  }
);

// ----------------------------------------------------------------------------
// API Service Methods
// ----------------------------------------------------------------------------
export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (data) => api.post('/auth/reset-password', data),
  changePassword: (data) => api.post('/auth/change-password', data),
  verifyEmail: (token) => api.post('/auth/verify-email', { token }),
  getCurrentUser: () => api.get('/auth/me'),
  getUsers: () => api.get('/auth/users'),
  updateUserStatus: (id, status) => api.patch(`/auth/users/${id}/status`, { status }),
  createUser: (data) => api.post('/auth/users', data),
  updateProfile: (data) => api.put('/auth/profile', data),
  uploadPhoto: (photo_data) => api.post('/auth/profile/photo', { photo_data }),
  deactivateAccount: () => api.post('/auth/deactivate'),
  exportUserData: () => api.get('/auth/export-data'),
  deleteAccount: () => api.delete('/auth/account'),
  resendVerification: () => api.post('/auth/send-verification'),
};

export const candidateService = {
  getAll: (params) => api.get('/candidates', { params }),
  getById: (id) => api.get(`/candidates/${id}`),
  create: (data) => api.post('/candidates', data),
  update: (id, data) => api.put(`/candidates/${id}`, data),
  delete: (id) => api.delete(`/candidates/${id}`),
  getCommunications: (id) => api.get(`/candidates/${id}/communications`),
  sendCommunication: (id, data) => api.post(`/candidates/${id}/communications`, data),
};

export const jobService = {
  getAll: (params) => api.get('/jobs', { params }),
  getById: (id) => api.get(`/jobs/${id}`),
  create: (data) => api.post('/jobs', data),
  update: (id, data) => api.put(`/jobs/${id}`, data),
  delete: (id) => api.delete(`/jobs/${id}`),
};

export const applicationService = {
  getAll: (params) => api.get('/applications', { params }),
  create: (data) => api.post('/applications', data),
  updateStatus: (id, status, notes) => api.patch(`/applications/${id}/status`, { status, notes }),
  scheduleInterview: (id, data) => api.post(`/applications/${id}/schedule-interview`, data),
  getInterviews: (id) => api.get(`/applications/${id}/interviews`),
  getAllInterviews: () => api.get('/applications/interviews/all'),
  updateInterview: (id, data) => api.patch(`/applications/interviews/${id}`, data),
};

export const mlService = {
  predictSalary: (features) => api.post('/ml/predict-salary', features),
  getModelMetrics: () => api.get('/ml/metrics'),
  parseResume: (formDataOrText) => {
    if (formDataOrText instanceof FormData) {
      return api.post('/ml/parse-resume', formDataOrText, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    }
    return api.post('/ml/parse-resume', { text: formDataOrText });
  },
  matchCandidate: (matchingData) => api.post('/ml/match-candidate', matchingData),
  rankCandidates: (data) => api.post('/ml/rank-candidates', data),
  analyzeSkillGaps: (data) => api.post('/ml/analyze-skill-gaps', data),
  generateInterviewQuestions: (data) => api.post('/ml/generate-interview-questions', data),
  recommendCareerRoles: (data) => api.post('/ml/recommend-career-roles', data),
  getSalaryBenchmarks: (data) => api.post('/ml/salary-benchmarks', data),
  checkDuplicateResume: (data) => api.post('/ml/check-duplicate-resume', data),
};

export const analyticsService = {
  getStatisticsSummary: () => api.get('/analytics/statistics-summary'),
  getCorrelation: () => api.get('/analytics/correlation'),
  getDistribution: (bins = 10) => api.get(`/analytics/distribution?bins=${bins}`),
  getExperienceTiers: () => api.get('/analytics/experience-tiers'),
  estimateProbability: (data) => api.post('/analytics/probability', data),
  getOverview: () => api.get('/analytics/overview'),
  getDepartmentAnalytics: () => api.get('/analytics/departments'),
  getHiringConversionFunnel: () => api.get('/analytics/funnel'),
  getMostDemandedSkills: () => api.get('/analytics/demanded-skills'),
  getTimeToHire: () => api.get('/analytics/time-to-hire'),
  getModelPerformance: () => api.get('/analytics/model-performance'),
};

export const dashboardService = {
  getKPIs: () => api.get('/dashboard/kpis'),
  getAuditLogs: () => api.get('/dashboard/audit-logs'),
};

export const companyService = {
  getAll: () => api.get('/companies'),
  getMyCompany: () => api.get('/companies/my-company'),
  updateMyCompany: (data) => api.put('/companies/my-company', data),
  getById: (id) => api.get(`/companies/${id}`),
  create: (data) => api.post('/companies', data),
  update: (id, data) => api.put(`/companies/${id}`, data),
};

export const notificationService = {
  getAll: () => api.get('/notifications'),
  markAsRead: (id) => api.patch(`/notifications/${id}/read`),
  markAllRead: () => api.post('/notifications/mark-all-read'),
  create: (data) => api.post('/notifications', data),
};

export const reportService = {
  getExportUrl: (type, format = 'csv') => `${API_BASE_URL}/reports/export/${type}?format=${format}`,
};

export const membershipService = {
  getPlans: () => api.get('/membership/plans'),
  getMySubscription: () => api.get('/membership/my-subscription'),
  createOrder: (data) => api.post('/membership/create-order', data),
  verifyPayment: (data) => api.post('/membership/verify-payment', data),
  simulateTestPayment: (data) => api.post('/membership/simulate-test-payment', data),
  cancelSubscription: () => api.post('/membership/cancel'),
  getAdminOverview: () => api.get('/membership/admin/overview'),
  updateAdminPricing: (data) => api.put('/membership/admin/pricing', data),
  adminGrantSubscription: (data) => api.post('/membership/admin/grant', data),
  getAiMockInterview: (data) => api.post('/membership/ai-mock-interview', data),
  getAiResumeReview: (data) => api.post('/membership/ai-resume-review', data),
  getCareerRoadmap: (data) => api.post('/membership/career-roadmap', data),
};

export default api;
