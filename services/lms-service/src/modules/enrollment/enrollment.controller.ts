import { Request, Response, NextFunction } from 'express';
import { EnrollmentService } from './enrollment.service';

export class EnrollmentController {
  constructor(private service: EnrollmentService) {}

  getMyEnrollments = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { userId, companyId } = (req as any).tenant;
      const enrollments = await this.service.findByEmployee(userId, companyId);
      res.json(enrollments);
    } catch (err) {
      next(err);
    }
  };

  getByCourse = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { companyId } = (req as any).tenant;
      const enrollments = await this.service.findByCourse(req.params.courseId, companyId);
      res.json(enrollments);
    } catch (err) {
      next(err);
    }
  };

  assign = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { companyId } = (req as any).tenant;
      const { courseId, employeeIds } = req.body;
      const enrollments = await this.service.assign(courseId, employeeIds, companyId);
      res.status(201).json(enrollments);
    } catch (err) {
      next(err);
    }
  };

  updateProgress = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { companyId } = (req as any).tenant;
      const enrollment = await this.service.updateProgress(req.params.id, companyId, req.body);
      if (!enrollment) {
        res.status(404).json({ error: 'Enrollment not found' });
        return;
      }
      res.json(enrollment);
    } catch (err) {
      next(err);
    }
  };
}
