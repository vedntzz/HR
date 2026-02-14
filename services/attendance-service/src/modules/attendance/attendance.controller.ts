import { Request, Response, NextFunction } from 'express';
import { AttendanceService } from './attendance.service';
import { AuthPayload } from './attendance.types';

export class AttendanceController {
  private service: AttendanceService;

  constructor(service?: AttendanceService) {
    this.service = service ?? new AttendanceService();
  }

  checkIn = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { employeeId, companyId } = req.user as AuthPayload;
      const { notes } = req.body as { notes?: string };
      const record = await this.service.checkIn(employeeId, companyId, notes);
      res.status(201).json({ success: true, data: record });
    } catch (error) {
      next(error);
    }
  };

  checkOut = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { employeeId, companyId } = req.user as AuthPayload;
      const record = await this.service.checkOut(employeeId, companyId);
      res.status(200).json({ success: true, data: record });
    } catch (error) {
      next(error);
    }
  };

  getMyRecords = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { employeeId, companyId } = req.user as AuthPayload;
      const month = req.query.month ? Number(req.query.month) : undefined;
      const year = req.query.year ? Number(req.query.year) : undefined;
      const records = await this.service.getMyAttendance(employeeId, companyId, month, year);
      res.status(200).json({ success: true, data: records });
    } catch (error) {
      next(error);
    }
  };

  getTodayStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { employeeId, companyId } = req.user as AuthPayload;
      const record = await this.service.getTodayStatus(employeeId, companyId);
      res.status(200).json({ success: true, data: record });
    } catch (error) {
      next(error);
    }
  };

  getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { companyId } = req.user as AuthPayload;
      const { date, departmentFilter, page, limit } = req.query as {
        date?: string;
        departmentFilter?: string;
        page?: string;
        limit?: string;
      };
      const result = await this.service.getAllAttendance(
        companyId,
        date,
        departmentFilter,
        page ? Number(page) : undefined,
        limit ? Number(limit) : undefined
      );
      res.status(200).json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  };

  getSummary = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { employeeId, companyId, role } = req.user as AuthPayload;
      const month = Number(req.query.month);
      const year = Number(req.query.year);
      const targetEmployeeId = req.query.employeeId as string | undefined;

      const resolvedEmployeeId =
        targetEmployeeId && (role === 'admin' || role === 'hr')
          ? targetEmployeeId
          : employeeId;

      const summary = await this.service.getMonthlySummary(
        resolvedEmployeeId,
        companyId,
        month,
        year
      );
      res.status(200).json({ success: true, data: summary });
    } catch (error) {
      next(error);
    }
  };
}
