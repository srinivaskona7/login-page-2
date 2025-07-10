import axios from 'axios';

// Base URLs for different services
const USER_SERVICE_URL = process.env.REACT_APP_USER_SERVICE_URL || 'http://localhost:3001';
const COURSE_SERVICE_URL = process.env.REACT_APP_COURSE_SERVICE_URL || 'http://localhost:3002';

// Create axios instances for different services
const userServiceAPI = axios.create({
  baseURL: USER_SERVICE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

const courseServiceAPI = axios.create({
  baseURL: COURSE_SERVICE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
const addAuthInterceptor = (apiInstance) => {
  apiInstance.interceptors.request.use(
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
};

// Response interceptor for error handling
const addResponseInterceptor = (apiInstance) => {
  apiInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        // Token expired or invalid
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );
};

// Add interceptors to both API instances
addAuthInterceptor(userServiceAPI);
addAuthInterceptor(courseServiceAPI);
addResponseInterceptor(userServiceAPI);
addResponseInterceptor(courseServiceAPI);

// Auth API endpoints
export const authAPI = {
  register: (userData) => userServiceAPI.post('/api/auth/register', userData),
  login: (email, password) => userServiceAPI.post('/api/auth/login', { email, password }),
  verifyOTP: (email, otp) => userServiceAPI.post('/api/auth/verify-otp', { email, otp }),
  resendOTP: (email) => userServiceAPI.post('/api/auth/resend-otp', { email }),
  logout: () => userServiceAPI.post('/api/auth/logout'),
  getCurrentUser: () => userServiceAPI.get('/api/auth/me'),
  updateProfile: (profileData) => userServiceAPI.put('/api/users/profile', profileData),
};

// Course API endpoints
export const courseAPI = {
  getAllCourses: (params = {}) => courseServiceAPI.get('/api/courses', { params }),
  getFeaturedCourses: (limit = 6) => courseServiceAPI.get('/api/courses/featured', { params: { limit } }),
  getCourseById: (id) => courseServiceAPI.get(`/api/courses/${id}`),
  getStats: () => courseServiceAPI.get('/api/courses/stats/overview'),
};

// Generic API error handler
export const handleAPIError = (error) => {
  if (error.response) {
    // Server responded with error status
    return {
      message: error.response.data?.error || error.response.data?.message || 'Server error',
      status: error.response.status,
      data: error.response.data
    };
  } else if (error.request) {
    // Request was made but no response received
    return {
      message: 'Network error - please check your connection',
      status: 0,
      data: null
    };
  } else {
    // Something else happened
    return {
      message: error.message || 'An unexpected error occurred',
      status: 0,
      data: null
    };
  }
};

// Health check endpoints
export const healthAPI = {
  checkUserService: () => userServiceAPI.get('/health'),
  checkCourseService: () => courseServiceAPI.get('/health'),
};

export default {
  authAPI,
  courseAPI,
  healthAPI,
  handleAPIError
};