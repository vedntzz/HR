import { Request, Response, NextFunction } from 'express';
import { CourseService } from './course.service';

export class CourseController {
  constructor(private service: CourseService) {}

  getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { companyId } = (req as any).tenant;
      const courses = await this.service.findAll(companyId);
      res.json(courses);
    } catch (err) {
      next(err);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { companyId } = (req as any).tenant;
      const course = await this.service.findById(req.params.id, companyId);
      if (!course) {
        res.status(404).json({ error: 'Course not found' });
        return;
      }
      res.json(course);
    } catch (err) {
      next(err);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { companyId, userId } = (req as any).tenant;
      const course = await this.service.create(req.body, companyId, userId);
      res.status(201).json(course);
    } catch (err) {
      next(err);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { companyId } = (req as any).tenant;
      const course = await this.service.update(req.params.id, companyId, req.body);
      if (!course) {
        res.status(404).json({ error: 'Course not found' });
        return;
      }
      res.json(course);
    } catch (err) {
      next(err);
    }
  };
}
