import { Request, Response, NextFunction } from 'express';
import { PolicyService } from './policy.service';

export class PolicyController {
  constructor(private service: PolicyService) {}

  getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { companyId, userId } = (req as any).tenant;
      const policies = await this.service.findAll(companyId, userId);
      res.json(policies);
    } catch (err) {
      next(err);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { companyId } = (req as any).tenant;
      const policy = await this.service.findById(req.params.id, companyId);
      if (!policy) {
        res.status(404).json({ error: 'Policy not found' });
        return;
      }
      res.json(policy);
    } catch (err) {
      next(err);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { companyId, userId } = (req as any).tenant;
      const policy = await this.service.create(req.body, companyId, userId);
      res.status(201).json(policy);
    } catch (err) {
      next(err);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { companyId } = (req as any).tenant;
      const policy = await this.service.update(req.params.id, companyId, req.body);
      if (!policy) {
        res.status(404).json({ error: 'Policy not found' });
        return;
      }
      res.json(policy);
    } catch (err) {
      next(err);
    }
  };

  acknowledge = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { companyId, userId } = (req as any).tenant;
      const ack = await this.service.acknowledge(req.params.id, userId, companyId);
      res.status(201).json(ack);
    } catch (err) {
      next(err);
    }
  };

  getAcknowledgements = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { companyId } = (req as any).tenant;
      const acks = await this.service.getAcknowledgements(req.params.id, companyId);
      res.json(acks);
    } catch (err) {
      next(err);
    }
  };
}
