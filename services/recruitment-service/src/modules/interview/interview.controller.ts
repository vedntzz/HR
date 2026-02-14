import { Request, Response, NextFunction } from 'express';
import * as interviewService from './interview.service';
import { sendSuccess } from '../../utils/response';

export const listByCandidate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const tenant = (req as any).tenant;
    const feedbacks = await interviewService.listByCandidate(
      req.params.candidateId,
      tenant.companyId
    );
    sendSuccess(res, feedbacks);
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
    const feedback = await interviewService.getById(
      req.params.id,
      tenant.companyId
    );
    sendSuccess(res, feedback);
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
    const feedbacks = await interviewService.listAll(tenant.companyId);
    sendSuccess(res, feedbacks);
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
    const feedback = await interviewService.create(
      req.body,
      tenant.userId,
      tenant.companyId
    );
    sendSuccess(res, feedback, 201);
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
    const feedback = await interviewService.update(
      req.params.id,
      tenant.companyId,
      req.body
    );
    sendSuccess(res, feedback);
  } catch (error) {
    next(error);
  }
};
