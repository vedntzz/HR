import { Router, Request, Response, NextFunction } from 'express';
import { DepartmentController } from './department.controller';
import { DepartmentService } from './department.service';
import { DepartmentRepository } from './department.repository';
import { pool } from '../../config/database';
import { validate } from '../../middleware/validate';
import { authMiddleware, TenantContext } from '../../middleware/auth';
import { ForbiddenError } from '../../middleware/errorHandler';
import {
  createDepartmentSchema,
  updateDepartmentSchema,
  departmentIdParamSchema,
} from './department.schema';

const repository = new DepartmentRepository(pool);
const service = new DepartmentService(repository);
const controller = new DepartmentController(service);

function requireAdminOrHr(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  const tenant = (req as any).tenant as TenantContext;
  if (tenant.role !== 'admin' && tenant.role !== 'hr') {
    next(new ForbiddenError('Only admin or HR users can perform this action'));
    return;
  }
  next();
}

const router = Router();

router.use(authMiddleware);

router.get(
  '/',
  controller.list
);

router.get(
  '/:id',
  validate({ params: departmentIdParamSchema }),
  controller.getById
);

router.post(
  '/',
  requireAdminOrHr,
  validate({ body: createDepartmentSchema }),
  controller.create
);

router.put(
  '/:id',
  requireAdminOrHr,
  validate({ params: departmentIdParamSchema, body: updateDepartmentSchema }),
  controller.update
);

export default router;
