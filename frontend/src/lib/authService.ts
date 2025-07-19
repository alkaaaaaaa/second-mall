import { apiClient } from './api';
import type { 
  AuthResponse, 
  LoginRequest, 
  RegisterRequest, 
  User 
} from '@/types';

// 身份认证服务
export const authService = {
  // 用户登录
  async login(data: LoginRequest) {
    try {
      const response = await apiClient.post<AuthResponse>('/users/login', data);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  // 用户注册
  async register(data: RegisterRequest) {
    try {
      const response = await apiClient.post<User>('/users/register', data);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  // 获取当前用户信息
  async getCurrentUser() {
    try {
      const response = await apiClient.get<User>('/users/profile');
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  // 更新用户信息
  async updateUserProfile(data: Partial<User>) {
    try {
      const response = await apiClient.put<User>('/users/profile', data);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  // 检查用户名是否可用
  async checkUsername(username: string) {
    try {
      const response = await apiClient.get<boolean>(`/users/check-username?username=${encodeURIComponent(username)}`);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  // 检查邮箱是否可用
  async checkEmail(email: string) {
    try {
      const response = await apiClient.get<boolean>(`/users/check-email?email=${encodeURIComponent(email)}`);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }
};
