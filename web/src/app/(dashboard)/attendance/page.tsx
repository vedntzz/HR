'use client';
import { useState } from 'react';
import { Card, Button, Badge, Table } from '@/components/ui';

type TodayStatus = 'not_checked_in' | 'checked_in' | 'completed';

const MOCK_RECORDS = [
  { date: '2025-02-10', checkIn: '09:02 AM', checkOut: '06:15 PM', duration: '9h 13m', status: 'completed' },
  { date: '2025-02-09', checkIn: '08:55 AM', checkOut: '05:45 PM', duration: '8h 50m', status: 'completed' },
  { date: '2025-02-08', checkIn: '09:30 AM', checkOut: '06:00 PM', duration: '8h 30m', status: 'completed' },
  { date: '2025-02-07', checkIn: '08:45 AM', checkOut: '05:30 PM', duration: '8h 45m', status: 'completed' },
  { date: '2025-02-06', checkIn: '09:10 AM', checkOut: '06:20 PM', duration: '9h 10m', status: 'completed' },
];

export default function AttendancePage() {
  const [status, setStatus] = useState<TodayStatus>('not_checked_in');
  const [checkInTime, setCheckInTime] = useState('');

  function handleCheckIn() {
    const now = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    setCheckInTime(now);
    setStatus('checked_in');
  }

  function handleCheckOut() {
    setStatus('completed');
  }

  return (
    <div className="space-y-6">
      {/* Today's Status */}
      <Card>
        <div className="flex flex-col items-center py-8">
          {status === 'not_checked_in' && (
            <>
              <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Not Checked In</h3>
              <p className="text-sm text-gray-500 mb-6">Mark your attendance for today</p>
              <Button size="lg" onClick={handleCheckIn}>Check In</Button>
            </>
          )}

          {status === 'checked_in' && (
            <>
              <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center mb-4">
                <div className="w-4 h-4 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Checked In</h3>
              <p className="text-3xl font-bold text-emerald-600 mb-1">{checkInTime}</p>
              <p className="text-sm text-gray-500 mb-6">Working time is being tracked</p>
              <Button variant="secondary" size="lg" onClick={handleCheckOut}>Check Out</Button>
            </>
          )}

          {status === 'completed' && (
            <>
              <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center mb-4">
                <svg className="w-10 h-10 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Day Complete</h3>
              <div className="flex items-center gap-6 mt-2 text-sm">
                <div className="text-center">
                  <p className="text-gray-500">Check In</p>
                  <p className="font-semibold text-gray-900">{checkInTime}</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-500">Check Out</p>
                  <p className="font-semibold text-gray-900">
                    {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </Card>

      {/* Attendance History */}
      <Card title="Attendance History" subtitle="Your recent attendance records">
        <Table
          columns={[
            { key: 'date', label: 'Date' },
            { key: 'checkIn', label: 'Check In' },
            { key: 'checkOut', label: 'Check Out' },
            { key: 'duration', label: 'Duration' },
            {
              key: 'status',
              label: 'Status',
              render: () => <Badge variant="success">Completed</Badge>,
            },
          ]}
          data={MOCK_RECORDS as unknown as Record<string, unknown>[]}
          emptyMessage="No attendance records found"
        />
      </Card>
    </div>
  );
}
