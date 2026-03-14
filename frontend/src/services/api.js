import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 15000,
})

// Response interceptor
api.interceptors.response.use(
  res => res,
  err => {
    const message = err.response?.data?.message || err.message || 'Request failed'
    return Promise.reject(new Error(message))
  }
)

export const papersAPI = {
  submit: (formData) => api.post('/papers/submit', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  getAll: (params) => api.get('/papers', { params }),
  getAllAdmin: (params) => api.get('/papers/all', { params }),
  getMy: () => api.get('/papers/my'),
  getAssigned: () => api.get('/papers/assigned'),
  getById: (id) => api.get(`/papers/${id}`),
  updateStatus: (id, status) => api.put(`/papers/${id}/status`, { status }),
  assignReviewer: (id, reviewerId) => api.put(`/papers/${id}/assign`, { reviewerId }),
  download: (id) => api.get(`/papers/${id}/download`),
}

export const reviewsAPI = {
  submit: (data) => api.post('/reviews', data),
  getMy: () => api.get('/reviews/my'),
  getByPaper: (paperId) => api.get(`/reviews/paper/${paperId}`),
  getStats: () => api.get('/reviews/stats'),
}

export const usersAPI = {
  getReviewers: () => api.get('/users/reviewers'),
  getPoints: () => api.get('/users/points'),
  getLeaderboard: () => api.get('/users/leaderboard'),
  updateProfile: (data) => api.put('/auth/profile', data),
}

export const blockchainAPI = {
  getStatus: () => api.get('/blockchain/status'),
}

export default api
