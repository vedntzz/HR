import { Request, Response, NextFunction } from 'express';
import * as payslipService from './payslip.service';
import { sendSuccess } from '../../utils/response';

export const getMyPayslips = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const tenant = (req as any).tenant;
    const payslips = await payslipService.getMyPayslips(
      tenant.userId,
      tenant.companyId
    );
    sendSuccess(res, payslips);
  } catch (error) {
    next(error);
  }
};

export const getDetail = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const tenant = (req as any).tenant;
    const payslip = await payslipService.getDetail(
      req.params.id,
      tenant.companyId
    );
    sendSuccess(res, payslip);
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
    const filters = {
      employeeId: req.query.employeeId as string | undefined,
      status: req.query.status as string | undefined,
    };
    const payslips = await payslipService.listAll(tenant.companyId, filters);
    sendSuccess(res, payslips);
  } catch (error) {
    next(error);
  }
};

export const generate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const tenant = (req as any).tenant;
    const payslip = await payslipService.generate(
      req.body,
      tenant.companyId
    );
    sendSuccess(res, payslip, 201);
  } catch (error) {
    next(error);
  }
};
