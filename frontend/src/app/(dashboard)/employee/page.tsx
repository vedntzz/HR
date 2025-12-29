'use client';

import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Calendar, Clock, FileText, TrendingUp } from 'lucide-react';
import api from '@/services/api';
import { LeaveBalance } from '@/types';

export default function EmployeeDashboard() {
  const [leaveBalance, setLeaveBalance] = useState<LeaveBalance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeaveBalance();
  }, []);

  const loadLeaveBalance = async () => {
    try {
      const response = await api.get('/leave/balance');
      setLeaveBalance(response.data.data);
    } catch (error) {
      console.error('Failed to load leave balance:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    {
      title: 'Leave Balance',
      value: leaveBalance.reduce((sum, item) => sum + item.available, 0),
      subtitle: 'days available',
      icon: Calendar,
      color: 'bg-primary-light text-primary',
    },
    {
      title: 'Working Hours',
      value: '176',
      subtitle: 'this month',
      icon: Clock,
      color: 'bg-accent-light text-accent',
    },
    {
      title: 'Pending Requests',
      value: '2',
      subtitle: 'awaiting approval',
      icon: FileText,
      color: 'bg-orange-100 text-orange-600',
    },
    {
      title: 'Performance',
      value: '94%',
      subtitle: 'last review',
      icon: TrendingUp,
      color: 'bg-purple-100 text-purple-600',
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-primary-soft to-card rounded-lg border border-border p-6">
          <h1 className="text-2xl font-display font-bold text-foreground mb-1">
            Welcome back!
          </h1>
          <p className="text-muted-foreground">
            You have 3 pending tasks and 2 upcoming events today
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">
                        {stat.title}
                      </p>
                      <p className="text-2xl font-display font-bold text-foreground">
                        {stat.value}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">{stat.subtitle}</p>
                    </div>
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Leave Balance Details */}
        <Card>
          <CardHeader>
            <CardTitle>Leave Balance Details</CardTitle>
            <CardDescription>Your current leave balance across all types</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">Loading...</div>
            ) : (
              <div className="space-y-4">
                {leaveBalance.map((leave) => (
                  <div key={leave.leaveType} className="border-b border-border pb-4 last:border-0 last:pb-0">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-foreground">{leave.name}</span>
                      <span className="text-sm font-semibold text-foreground">
                        {leave.available} / {leave.total}
                      </span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-success rounded-full transition-all"
                        style={{ width: `${(leave.available / leave.total) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { title: 'Apply Leave', icon: Calendar },
            { title: 'Check In', icon: Clock },
            { title: 'View Payslip', icon: FileText },
            { title: 'Update Profile', icon: TrendingUp },
          ].map((action) => {
            const Icon = action.icon;
            return (
              <Card
                key={action.title}
                className="hover:border-primary hover:shadow-md transition-all cursor-pointer"
              >
                <CardContent className="pt-6 text-center">
                  <div className="w-12 h-12 bg-primary-light text-primary rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Icon className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-semibold text-foreground">{action.title}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
