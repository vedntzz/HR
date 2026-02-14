export interface NavItem {
  label: string;
  href: string;
  icon: string;
  roles: string[];
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: 'grid', roles: ['admin', 'hr', 'manager', 'employee'] },
  { label: 'Employees', href: '/employees', icon: 'users', roles: ['admin', 'hr', 'manager'] },
  { label: 'Attendance', href: '/attendance', icon: 'clock', roles: ['admin', 'hr', 'manager', 'employee'] },
  { label: 'Payroll', href: '/payroll', icon: 'dollar', roles: ['admin', 'hr', 'manager', 'employee'] },
  { label: 'Recruitment', href: '/recruitment', icon: 'briefcase', roles: ['admin', 'hr'] },
  { label: 'Learning', href: '/lms', icon: 'book', roles: ['admin', 'hr', 'manager', 'employee'] },
  { label: 'Policies', href: '/policies', icon: 'shield', roles: ['admin', 'hr', 'manager', 'employee'] },
];

export const STAGE_COLORS: Record<string, string> = {
  applied: 'badge-info',
  screening: 'badge-warning',
  interview: 'badge-neutral',
  offer: 'badge-success',
  hired: 'badge-success',
  rejected: 'badge-danger',
};

export const RECOMMENDATION_COLORS: Record<string, string> = {
  strong_yes: 'bg-emerald-500',
  yes: 'bg-emerald-400',
  neutral: 'bg-gray-400',
  no: 'bg-red-400',
  strong_no: 'bg-red-500',
};
