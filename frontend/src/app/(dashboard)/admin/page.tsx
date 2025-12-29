'use client';

import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Users, Calendar, Clock, DollarSign, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import api from '@/services/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    leaveRequests: 0,
    attendanceToday: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [employeesRes, attendanceRes] = await Promise.all([
        api.get('/employees'),
        api.get('/attendance/stats/today'),
      ]);

      setStats({
        totalEmployees: employeesRes.data.data.length,
        leaveRequests: 18,
        attendanceToday: attendanceRes.data.data.percentage,
      });
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const dashboardStats = [
    {
      title: 'Total Employees',
      value: stats.totalEmployees,
      change: '+12%',
      positive: true,
      subtitle: 'from last month',
      icon: Users,
      color: 'bg-primary-light text-primary',
    },
    {
      title: 'Leave Requests',
      value: stats.leaveRequests,
      change: '5 pending',
      positive: false,
      subtitle: 'approval needed',
      icon: Calendar,
      color: 'bg-orange-100 text-orange-600',
    },
    {
      title: 'Attendance Today',
      value: `${Math.round(stats.attendanceToday)}%`,
      change: '312 present',
      positive: true,
      subtitle: 'employees checked in',
      icon: Clock,
      color: 'bg-accent-light text-accent',
    },
    {
      title: 'Payroll Status',
      value: 'Ready',
      change: 'Dec 31',
      positive: true,
      subtitle: 'processing date',
      icon: DollarSign,
      color: 'bg-primary-light text-primary',
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground mb-1">
              Dashboard Overview
            </h1>
            <p className="text-muted-foreground">
              Welcome back. Here&apos;s what&apos;s happening with your team today.
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="secondary">Export Report</Button>
            <Button>Add Employee</Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {dashboardStats.map((stat) => {
            const Icon = stat.icon;
            const ChangeIcon = stat.positive ? ArrowUpRight : ArrowDownRight;

            return (
              <Card key={stat.title} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <p className="text-xs font-medium text-muted-foreground mb-1">
                        {stat.title}
                      </p>
                      <p className="text-2xl font-display font-bold text-foreground">
                        {loading ? '...' : stat.value}
                      </p>
                    </div>
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs">
                    <span className={stat.positive ? 'text-success' : 'text-muted-foreground'}>
                      {stat.change}
                    </span>
                    <span className="text-muted-foreground">{stat.subtitle}</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { title: 'Add Employee', icon: Users },
            { title: 'Apply Leave', icon: Calendar },
            { title: 'View Reports', icon: TrendingUp },
            { title: 'Mark Attendance', icon: Clock },
            { title: 'Process Payroll', icon: DollarSign },
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

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Leave Requests</CardTitle>
              <CardDescription>Latest leave applications from your team</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                No recent leave requests
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Today&apos;s Attendance</CardTitle>
              <CardDescription>Employee check-in status for today</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Present</span>
                  <span className="text-sm font-semibold text-success">
                    {loading ? '...' : `${Math.round(stats.attendanceToday)}%`}
                  </span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-success rounded-full"
                    style={{ width: `${stats.attendanceToday}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
