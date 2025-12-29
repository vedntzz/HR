'use client';

import { Shield, Bell, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '../ui/Button';
import { getInitials } from '@/lib/utils';

export function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-card border-b border-border">
      <div className="h-full max-w-screen-2xl mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-primary to-success rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-display font-bold text-foreground">SYNERGY</span>
            <div className="h-6 w-px bg-border mx-2" />
            <span className="text-sm font-medium text-muted-foreground">
              {user?.role === 'ADMIN' ? 'Admin Portal' : 'Employee Portal'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="w-4 h-4" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-danger rounded-full" />
          </Button>

          <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors cursor-pointer">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-success rounded-lg flex items-center justify-center text-white text-xs font-semibold">
              {user?.employee && getInitials(user.employee.firstName, user.employee.lastName)}
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-semibold text-foreground">
                {user?.employee?.firstName} {user?.employee?.lastName}
              </p>
              <p className="text-xs text-muted-foreground">{user?.employee?.designation}</p>
            </div>
          </div>

          <Button variant="ghost" size="sm" onClick={logout}>
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
