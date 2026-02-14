import { Request, Response, NextFunction } from 'express';
import { DepartmentService } from './department.service';
import { TenantContext } from '../../middleware/auth';

export class DepartmentController {
  constructor(private readonly service: DepartmentService) {}

  list = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const tenant = (req as any).tenant as TenantContext;
      const departments = await this.service.list(tenant.companyId);

      res.json({ status: 'success', data: departments });
    } catch (error) {
      next(error);
    }
  };

  getById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const tenant = (req as any).tenant as TenantContext;
      const department = await this.service.getById(
        req.params.id as string,
        tenant.companyId
      );

      res.json({ status: 'success', data: department });
    } catch (error) {
      next(error);
    }
  };

  create = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const tenant = (req as any).tenant as TenantContext;
      const department = await this.service.create(
        req.body,
        tenant.companyId
      );

      res.status(201).json({ status: 'success', data: department });
    } catch (error) {
      next(error);
    }
  };

  update = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const tenant = (req as any).tenant as TenantContext;
      const department = await this.service.update(
        req.params.id as string,
        tenant.companyId,
        req.body
      );

      res.json({ status: 'success', data: department });
    } catch (error) {
      next(error);
    }
  };
}
