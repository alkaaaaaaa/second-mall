import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthActions {
  login: (token: string, user: User) => void;
  logout: () => void;
  setUser: (user: User) => void;
  setLoading: (loading: boolean) => void;
  initializeAuth: () => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, _get) => ({
      // 状态
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      // 操作
      login: (token: string, user: User) => {
        set({ 
          token, 
          user, 
          isAuthenticated: true 
        });
        
        // 将token和用户信息保存到localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(user));
        }
      },

      logout: () => {
        set({ 
          user: null, 
          token: null, 
          isAuthenticated: false 
        });
        
        // 清除localStorage
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      },

      setUser: (user: User) => {
        set({ user });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      initializeAuth: () => {
        set({ isLoading: true });
        
        // 检查本地存储中的认证信息
        if (typeof window !== 'undefined') {
          const token = localStorage.getItem('token');
          const userJson = localStorage.getItem('user');
          
          if (token && userJson) {
            try {
              const user = JSON.parse(userJson);
              set({
                token,
                user,
                isAuthenticated: true,
                isLoading: false
              });
              return;
            } catch (error) {
              // JSON解析错误，清除无效数据
              localStorage.removeItem('token');
              localStorage.removeItem('user');
            }
          }
        }
        
        // 如果没有有效的认证信息，设置为未登录状态
        set({ isLoading: false });
      },
    }),
    {
      name: 'auth-storage', // localStorage key
      partialize: (state) => ({ 
        user: state.user, 
        token: state.token,
        isAuthenticated: state.isAuthenticated
      }),
    }
  )
); 