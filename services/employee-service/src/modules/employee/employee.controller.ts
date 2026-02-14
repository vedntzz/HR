import { Request, Response, NextFunction } from 'express';
import { EmployeeService } from './employee.service';
import { TenantContext } from '../../middleware/auth';

export class EmployeeController {
  constructor(private readonly service: EmployeeService) {}

  list = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const tenant = (req as any).tenant as TenantContext;
      const { page, limit, departmentId, isActive, search, managerId } =
        req.query as any;

      const result = await this.service.list(
        tenant.companyId,
        { page: page ?? 1, limit: limit ?? 20 },
        { departmentId, isActive, search, managerId }
      );

      res.json({ status: 'success', ...result });
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
      const employee = await this.service.getById(
        req.params.id as string,
        tenant.companyId
      );

      res.json({ status: 'success', data: employee });
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
      const dto = { ...req.body, companyId: tenant.companyId };
      const employee = await this.service.create(dto, tenant.userId);

      res.status(201).json({ status: 'success', data: employee });
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
      const employee = await this.service.update(
        req.params.id as string,
        tenant.companyId,
        req.body
      );

      res.json({ status: 'success', data: employee });
    } catch (error) {
      next(error);
    }
  };

  getMyTeam = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const tenant = (req as any).tenant as TenantContext;
      const team = await this.service.getTeam(tenant.userId, tenant.companyId);

      res.json({ status: 'success', data: team });
    } catch (error) {
      next(error);
    }
  };

  getOrgChart = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const tenant = (req as any).tenant as TenantContext;
      const orgChart = await this.service.getOrgChart(tenant.companyId);

      res.json({ status: 'success', data: orgChart });
    } catch (error) {
      next(error);
    }
  };
}
