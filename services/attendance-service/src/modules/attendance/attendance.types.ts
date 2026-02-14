export type AttendanceStatus = 'checked_in' | 'checked_out';

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  companyId: string;
  checkIn: Date;
  checkOut: Date | null;
  status: AttendanceStatus;
  notes: string | null;
  duration: number | null;
  createdAt: Date;
}

export interface CheckInDto {
  notes?: string;
}

export interface AttendanceSummary {
  totalDays: number;
  avgHours: number;
  lateCount: number;
}

export interface AttendanceQueryFilters {
  month?: number;
  year?: number;
  employeeId?: string;
  date?: string;
  departmentFilter?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AuthPayload {
  userId: string;
  employeeId: string;
  companyId: string;
  role: string;
}

export interface AttendanceRow {
  id: string;
  employee_id: string;
  company_id: string;
  check_in: Date;
  check_out: Date | null;
  status: AttendanceStatus;
  notes: string | null;
  created_at: Date;
}
