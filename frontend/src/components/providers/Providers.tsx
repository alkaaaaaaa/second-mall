'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';

// 全局提供者组件，用于管理应用级状态
export default function Providers({ children }: { children: React.ReactNode }) {
  const { initializeAuth } = useAuthStore();

  // 初始化身份验证状态
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return (
    <>{children}</>
  );
}
