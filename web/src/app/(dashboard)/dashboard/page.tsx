'use client';
import { useAuth } from '@/hooks/useAuth';
import { StatCard, Card, Button } from '@/components/ui';
import Link from 'next/link';

const QUICK_ACTIONS = [
  { label: 'Mark Attendance', href: '/attendance', color: 'bg-blue-600 hover:bg-blue-700', icon: '\u23F1' },
  { label: 'View Payslips', href: '/payroll', color: 'bg-emerald-600 hover:bg-emerald-700', icon: '\uD83D\uDCB0' },
  { label: 'Browse Policies', href: '/policies', color: 'bg-purple-600 hover:bg-purple-700', icon: '\uD83D\uDCC4' },
  { label: 'My Courses', href: '/lms', color: 'bg-amber-600 hover:bg-amber-700', icon: '\uD83D\uDCDA' },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const now = new Date();
  const greeting = now.getHours() < 12 ? 'Good morning' : now.getHours() < 17 ? 'Good afternoon' : 'Good evening';
  const isAdmin = user?.role === 'admin' || user?.role === 'hr';

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          {greeting}, {user?.firstName || user?.email?.split('@')[0] || 'there'}
        </h2>
        <p className="text-gray-500 mt-1">
          {now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {isAdmin ? (
          <>
            <StatCard label="Total Employees" value={48} change="+3 this month" trend="up" icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>} />
            <StatCard label="Present Today" value={42} change="87.5%" trend="up" />
            <StatCard label="Open Positions" value={5} change="2 new" trend="neutral" />
            <StatCard label="Active Courses" value={12} />
          </>
        ) : (
          <>
            <StatCard label="Attendance Streak" value="14 days" change="Best: 28 days" trend="up" />
            <StatCard label="Pending Courses" value={3} change="1 due soon" trend="neutral" />
            <StatCard label="Unread Policies" value={2} change="Action required" trend="neutral" />
            <StatCard label="Team Size" value={8} />
          </>
        )}
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <Card title="Quick Actions">
          <div className="grid grid-cols-2 gap-3">
            {QUICK_ACTIONS.map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className={`${action.color} text-white rounded-xl p-4 flex flex-col items-center justify-center gap-2 transition-colors min-h-[100px]`}
              >
                <span className="text-2xl">{action.icon}</span>
                <span className="text-sm font-medium">{action.label}</span>
              </Link>
            ))}
          </div>
        </Card>

        {/* My Info */}
        <Card title="My Information">
          <div className="space-y-4">
            <InfoRow label="Email" value={user?.email || 'N/A'} />
            <InfoRow label="Role" value={user?.role || 'Employee'} />
            <InfoRow label="Department" value="Engineering" />
            <InfoRow label="Position" value="Software Engineer" />
            <InfoRow label="Reporting Manager" value="Jane Smith" />
            <InfoRow label="HR Contact" value="hr@company.com" />
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card title="Recent Activity" subtitle="Your latest updates">
        <div className="space-y-4">
          {[
            { text: 'Checked in at 9:02 AM', time: 'Today', type: 'attendance' },
            { text: 'Completed "Data Privacy Fundamentals" course', time: 'Yesterday', type: 'lms' },
            { text: 'Acknowledged "Remote Work Policy v2.1"', time: '2 days ago', type: 'policy' },
            { text: 'Payslip for January 2025 generated', time: '5 days ago', type: 'payroll' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-4 py-2">
              <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900">{item.text}</p>
                <p className="text-xs text-gray-500">{item.time}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm font-medium text-gray-900 capitalize">{value}</span>
    </div>
  );
}
