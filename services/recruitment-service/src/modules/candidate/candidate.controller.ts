import { Request, Response, NextFunction } from 'express';
import * as candidateService from './candidate.service';
import { sendSuccess } from '../../utils/response';

export const listAll = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const tenant = (req as any).tenant;
    const filters = { stage: req.query.stage as string | undefined };
    const candidates = await candidateService.listAll(
      tenant.companyId,
      filters
    );
    sendSuccess(res, candidates);
  } catch (error) {
    next(error);
  }
};

export const getById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const tenant = (req as any).tenant;
    const candidate = await candidateService.getById(
      req.params.id,
      tenant.companyId
    );
    sendSuccess(res, candidate);
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
    const candidate = await candidateService.create(
      req.body,
      tenant.companyId
    );
    sendSuccess(res, candidate, 201);
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
    const candidate = await candidateService.update(
      req.params.id,
      tenant.companyId,
      req.body
    );
    sendSuccess(res, candidate);
  } catch (error) {
    next(error);
  }
};
