import { Router } from 'express';
import { EmployeeController } from './employee.controller';
import { EmployeeService } from './employee.service';
import { EmployeeRepository } from './employee.repository';
import { pool } from '../../config/database';
import { validate } from '../../middleware/validate';
import { authMiddleware } from '../../middleware/auth';
import {
  createEmployeeSchema,
  updateEmployeeSchema,
  employeeIdParamSchema,
  listEmployeesQuerySchema,
} from './employee.schema';

const repository = new EmployeeRepository(pool);
const service = new EmployeeService(repository);
const controller = new EmployeeController(service);

const router = Router();

router.use(authMiddleware);

router.get(
  '/team/mine',
  controller.getMyTeam
);

router.get(
  '/org-chart',
  controller.getOrgChart
);

router.get(
  '/',
  validate({ query: listEmployeesQuerySchema }),
  controller.list
);

router.get(
  '/:id',
  validate({ params: employeeIdParamSchema }),
  controller.getById
);

router.post(
  '/',
  validate({ body: createEmployeeSchema }),
  controller.create
);

router.put(
  '/:id',
  validate({ params: employeeIdParamSchema, body: updateEmployeeSchema }),
  controller.update
);

export default router;
