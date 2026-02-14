import { Request, Response, NextFunction } from 'express';
import * as payrollService from './payroll.service';
import { sendSuccess, sendPaginated } from '../../utils/response';

export const getMyPayroll = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const tenant = (req as any).tenant;
    const records = await payrollService.getEmployeePayroll(
      tenant.userId,
      tenant.companyId
    );
    sendSuccess(res, records);
  } catch (error) {
    next(error);
  }
};

export const listAll = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const tenant = (req as any).tenant;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const result = await payrollService.listAll(tenant.companyId, {
      page,
      limit,
    });
    sendPaginated(res, result.data, page, limit, result.total);
  } catch (error) {
    next(error);
  }
};

export const create = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const tenant = (req as any).tenant;
    const record = await payrollService.create(req.body, tenant.companyId);
    sendSuccess(res, record, 201);
  } catch (error) {
    next(error);
  }
};

export const update = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const tenant = (req as any).tenant;
    const record = await payrollService.update(
      req.params.id,
      tenant.companyId,
      req.body
    );
    sendSuccess(res, record);
  } catch (error) {
    next(error);
  }
};
