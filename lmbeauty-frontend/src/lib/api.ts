import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
import type { ApiResponse, ApiError } from '@/types';

const api: AxiosInstance = axios.create({
  baseURL: (() => {
    let url = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    url = url.replace(/\/$/, '');
    if (!url.endsWith('/api')) {
      url = url + '/api';
    }
    return url;
  })(),
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

// Request interceptor - add auth token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      console.log('API Request:', config.method?.toUpperCase(), config.url);
      console.log('Token available:', !!token);
      
      if (token && token !== 'null' && token !== 'undefined') {
        config.headers.Authorization = `Bearer ${token}`;
        console.log('Authorization header set');
      } else {
        console.log('No valid token found');
      }
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - handle 401 and token refresh
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiError>) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      const url = originalRequest.url || '';
      const isAuthEndpoint = url.includes('/auth/') || url.includes('/oauth/');
      
      if (isAuthEndpoint) {
        return Promise.reject(error);
      }

      // Don't retry for specific endpoints that might have different auth requirements
      const isSpecialEndpoint = url.includes('/treatments/all') || url.includes('/admin/treatments');
      if (isSpecialEndpoint) {
        console.log('401 on special endpoint, not refreshing token:', url);
        return Promise.reject(error);
      }

      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refreshToken');

      if (!refreshToken) {
        console.log('No refresh token available, clearing auth data');
        clearAuthData(true);
        return Promise.reject(error);
      }

      try {
        console.log('Attempting token refresh...');
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        // Remove /api from baseUrl if it exists to avoid double /api
        const cleanBaseUrl = baseUrl.replace(/\/api$/, '');
        const refreshResponse = await axios.post(
          `${cleanBaseUrl}/api/auth/refresh`,
          { refreshToken },
          { 
            withCredentials: true,
            timeout: 10000 // 10 second timeout for refresh
          }
        );

        console.log('Refresh response:', refreshResponse.data);
        
        // Handle different response formats
        const responseData = refreshResponse.data.data || refreshResponse.data;
        const newAccessToken = responseData.accessToken || responseData.token;
        const newRefreshToken = responseData.refreshToken;

        if (newAccessToken) {
          console.log('Token refresh successful');
          localStorage.setItem('accessToken', newAccessToken);
          if (newRefreshToken) {
            localStorage.setItem('refreshToken', newRefreshToken);
          }
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          }
          return api(originalRequest);
        } else {
          throw new Error('No access token in refresh response');
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        
        // Only clear auth data and redirect for actual auth failures
        if (axios.isAxiosError(refreshError) && refreshError.response?.status === 401) {
          clearAuthData();
          if (typeof window !== 'undefined') {
            localStorage.setItem('redirectAfterLogin', window.location.pathname);
            alert('Ihre Session ist abgelaufen. Sie werden zur Anmeldung weitergeleitet.');
            window.location.href = '/anmelden?session=expired';
          }
        } else {
          // For other errors, don't redirect - just log and continue
          console.log('Token refresh failed but not redirecting:', refreshError);
        }
        
        return Promise.reject(error); // Return original error, not refresh error
      }
    }

    return Promise.reject(error);
  }
);

export const clearAuthData = (redirect = false) => {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
  
  if (redirect && !window.location.pathname.includes('/anmelden')) {
    window.location.href = '/anmelden?session=expired';
  }
};

export const handleApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;
    return data?.message || data?.error || error.message || 'Ein Fehler ist aufgetreten';
  }
  return error instanceof Error ? error.message : 'Ein unerwarteter Fehler ist aufgetreten';
};

export const apiClient = {
  get: async <T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
    const response = await api.get<ApiResponse<T>>(url, config);
    return response.data;
  },
  post: async <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
    const response = await api.post<ApiResponse<T>>(url, data, config);
    return response.data;
  },
  put: async <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
    const response = await api.put<ApiResponse<T>>(url, data, config);
    return response.data;
  },
  patch: async <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
    const response = await api.patch<ApiResponse<T>>(url, data, config);
    return response.data;
  },
  delete: async <T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
    const response = await api.delete<ApiResponse<T>>(url, config);
    return response.data;
  },
};

export default api;
