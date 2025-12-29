'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
  requiredRole?: 'ADMIN' | 'EMPLOYEE' | 'HR' | 'MANAGER';
}

export function DashboardLayout({ children, requiredRole }: DashboardLayoutProps) {
  const { user, isLoading, loadUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-lg font-semibold text-primary">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar role={user.role} />
      <main className="ml-60 mt-16 p-6">{children}</main>
    </div>
  );
}
