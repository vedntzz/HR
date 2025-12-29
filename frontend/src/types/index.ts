export interface User {
  id: string;
  email: string;
  role: 'ADMIN' | 'EMPLOYEE' | 'MANAGER' | 'HR';
  isActive: boolean;
  employee?: Employee;
}

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  employeeCode: string;
  designation: string;
  department: Department;
  joiningDate: string;
  salary?: number;
  isActive: boolean;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  description?: string;
}

export interface LeaveRequest {
  id: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: LeaveStatus;
  employee: Employee;
  createdAt: string;
}

export type LeaveType = 'ANNUAL' | 'SICK' | 'EMERGENCY' | 'MATERNITY' | 'PATERNITY' | 'COMP_OFF' | 'UNPAID';
export type LeaveStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';

export interface LeaveBalance {
  leaveType: LeaveType;
  name: string;
  total: number;
  used: number;
  available: number;
}

export interface Attendance {
  id: string;
  date: string;
  checkIn?: string;
  checkOut?: string;
  status: AttendanceStatus;
  workHours?: number;
}

export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'HALF_DAY' | 'LEAVE' | 'HOLIDAY' | 'WEEKEND';

export interface Payroll {
  id: string;
  month: number;
  year: number;
  basicSalary: number;
  allowances: number;
  deductions: number;
  tax: number;
  netSalary: number;
  status: PayrollStatus;
  paidDate?: string;
  employee: Employee;
}

export type PayrollStatus = 'DRAFT' | 'PROCESSING' | 'PAID' | 'FAILED';

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface AuthResponse {
  user: User;
  token: string;
}
