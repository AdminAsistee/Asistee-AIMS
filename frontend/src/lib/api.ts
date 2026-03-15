import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8001',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: false,
});

// Attach token to every request — read from Zustand persisted state (single source of truth)
api.interceptors.request.use((config) => {
  // Try aims_token first (set at login), fallback to Zustand persisted store
  let token = localStorage.getItem('aims_token');
  if (!token) {
    try {
      const zustand = JSON.parse(localStorage.getItem('aims-auth') || '{}');
      token = zustand?.state?.token ?? null;
    } catch { /* ignore */ }
  }
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 — only clear session if auth endpoint fails, not on data permission errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthEndpoint = error.config?.url?.includes('/login') ||
      error.config?.url?.includes('/me') ||
      error.config?.url?.includes('/register');

    // Only log the user out if the auth/session endpoint itself rejects them
    if (error.response?.status === 401 && isAuthEndpoint) {
      localStorage.removeItem('aims_token');
      localStorage.removeItem('aims_user');
      localStorage.removeItem('aims-auth');
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
