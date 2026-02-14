import { apiGet, apiPost } from '@/lib/api';

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  checkIn: string;
  checkOut: string | null;
  status: 'checked_in' | 'checked_out';
  notes?: string;
}

export interface AttendanceSummary {
  totalDays: number;
  avgHours: number;
  lateCount: number;
}

export async function checkIn(notes?: string): Promise<AttendanceRecord> {
  return apiPost('/api/attendance/check-in', { notes });
}

export async function checkOut(): Promise<AttendanceRecord> {
  return apiPost('/api/attendance/check-out');
}

export async function getTodayStatus(): Promise<AttendanceRecord | null> {
  return apiGet('/api/attendance/me/today');
}

export async function getMyAttendance(
  month?: number,
  year?: number
): Promise<AttendanceRecord[]> {
  const params = new URLSearchParams();
  if (month) params.set('month', String(month));
  if (year) params.set('year', String(year));
  return apiGet(`/api/attendance/me?${params}`);
}

export async function getAllAttendance(date?: string): Promise<AttendanceRecord[]> {
  const params = date ? `?date=${date}` : '';
  return apiGet(`/api/attendance/all${params}`);
}
