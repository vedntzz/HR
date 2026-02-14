import { AttendanceRepository } from './attendance.repository';
import {
  AttendanceRecord,
  AttendanceSummary,
  PaginatedResult,
} from './attendance.types';

export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class AttendanceService {
  private repository: AttendanceRepository;

  constructor(repository?: AttendanceRepository) {
    this.repository = repository ?? new AttendanceRepository();
  }

  async checkIn(
    employeeId: string,
    companyId: string,
    notes?: string
  ): Promise<AttendanceRecord> {
    const existing = await this.repository.findTodayByEmployee(employeeId, companyId);

    if (existing && existing.status === 'checked_in') {
      throw new AppError(409, 'Employee is already checked in for today');
    }

    return this.repository.checkIn(employeeId, companyId, notes);
  }

  async checkOut(
    employeeId: string,
    companyId: string
  ): Promise<AttendanceRecord> {
    const existing = await this.repository.findTodayByEmployee(employeeId, companyId);

    if (!existing) {
      throw new AppError(404, 'No check-in record found for today');
    }

    if (existing.status === 'checked_out') {
      throw new AppError(409, 'Employee has already checked out for today');
    }

    return this.repository.checkOut(existing.id, companyId);
  }

  async getMyAttendance(
    employeeId: string,
    companyId: string,
    month?: number,
    year?: number
  ): Promise<AttendanceRecord[]> {
    return this.repository.findByEmployee(employeeId, companyId, month, year);
  }

  async getTodayStatus(
    employeeId: string,
    companyId: string
  ): Promise<AttendanceRecord | null> {
    return this.repository.findTodayByEmployee(employeeId, companyId);
  }

  async getAllAttendance(
    companyId: string,
    date?: string,
    departmentFilter?: string,
    page?: number,
    limit?: number
  ): Promise<PaginatedResult<AttendanceRecord>> {
    return this.repository.findAll(companyId, date, departmentFilter, page, limit);
  }

  async getMonthlySummary(
    employeeId: string,
    companyId: string,
    month: number,
    year: number
  ): Promise<AttendanceSummary> {
    return this.repository.getSummary(employeeId, companyId, month, year);
  }
}
