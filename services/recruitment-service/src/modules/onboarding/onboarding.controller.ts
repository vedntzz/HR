import { Request, Response, NextFunction } from 'express';
import * as onboardingService from './onboarding.service';
import { sendSuccess } from '../../utils/response';

export const listAll = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const tenant = (req as any).tenant;
    const checklists = await onboardingService.listAll(tenant.companyId);
    sendSuccess(res, checklists);
  } catch (error) {
    next(error);
  }
};

export const listByCandidate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const tenant = (req as any).tenant;
    const checklists = await onboardingService.listByCandidate(
      req.params.candidateId,
      tenant.companyId
    );
    sendSuccess(res, checklists);
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
    const checklist = await onboardingService.getById(
      req.params.id,
      tenant.companyId
    );
    sendSuccess(res, checklist);
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
    const checklist = await onboardingService.create(
      req.body,
      tenant.companyId
    );
    sendSuccess(res, checklist, 201);
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
    const checklist = await onboardingService.update(
      req.params.id,
      tenant.companyId,
      req.body
    );
    sendSuccess(res, checklist);
  } catch (error) {
    next(error);
  }
};
