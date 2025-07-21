import axios, { AxiosInstance, AxiosResponse } from 'axios';
import type { ApiResponse } from '@/types';

// 创建axios实例
const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    // 从localStorage获取token
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  (response: AxiosResponse<ApiResponse<unknown>>) => {
    // 统一处理响应数据
    const { data } = response;
    if (data.code === 200) {
      return response;
    } else {
      // 处理业务错误
      throw new Error(data.message || '请求失败');
    }
  },
  (error) => {
    // 处理HTTP错误
    if (error.response?.status === 401) {
      // token过期，清除本地存储并跳转到登录页
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    
    const message = error.response?.data?.message || error.message || '网络错误';
    throw new Error(message);
  }
);

// API方法封装
export const apiClient = {
  get: <T>(url: string, params?: Record<string, unknown>): Promise<AxiosResponse<ApiResponse<T>>> =>
    api.get(url, { params }),
  
  post: <T>(url: string, data?: unknown): Promise<AxiosResponse<ApiResponse<T>>> =>
    api.post(url, data),
  
  put: <T>(url: string, data?: unknown): Promise<AxiosResponse<ApiResponse<T>>> =>
    api.put(url, data),
  
  delete: <T>(url: string): Promise<AxiosResponse<ApiResponse<T>>> =>
    api.delete(url),
  
  upload: <T>(url: string, file: File): Promise<AxiosResponse<ApiResponse<T>>> => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

export default api; 