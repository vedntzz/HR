'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, User, Calendar, Clock, DollarSign, Users, FileText, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  title: string;
  href: string;
  icon: any;
}

interface SidebarProps {
  role: 'ADMIN' | 'EMPLOYEE' | 'MANAGER' | 'HR';
}

const employeeNav: NavItem[] = [
  { title: 'Dashboard', href: '/employee', icon: Home },
  { title: 'My Profile', href: '/employee/profile', icon: User },
  { title: 'Leave', href: '/employee/leave', icon: Calendar },
  { title: 'Attendance', href: '/employee/attendance', icon: Clock },
  { title: 'Payslips', href: '/employee/payslips', icon: DollarSign },
];

const adminNav: NavItem[] = [
  { title: 'Dashboard', href: '/admin', icon: Home },
  { title: 'Employees', href: '/admin/employees', icon: Users },
  { title: 'Leave', href: '/admin/leave', icon: Calendar },
  { title: 'Attendance', href: '/admin/attendance', icon: Clock },
  { title: 'Payroll', href: '/admin/payroll', icon: DollarSign },
  { title: 'Reports', href: '/admin/reports', icon: FileText },
  { title: 'Settings', href: '/admin/settings', icon: Settings },
];

export function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const navItems = role === 'ADMIN' || role === 'HR' ? adminNav : employeeNav;

  return (
    <aside className="fixed left-0 top-16 bottom-0 w-60 bg-card border-r border-border overflow-y-auto">
      <nav className="p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors relative',
                isActive
                  ? 'bg-primary-soft text-primary font-semibold'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-primary rounded-r" />
              )}
              <Icon className="w-4 h-4" />
              <span>{item.title}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
