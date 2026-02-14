import { Router } from 'express';
import { authenticate, authorize } from '../../middleware/auth';
import { validate } from '../../middleware/validate';
import { createPayrollSchema, updatePayrollSchema } from './payroll.schema';
import * as payrollController from './payroll.controller';

const router = Router();

router.use(authenticate);

router.get('/me', payrollController.getMyPayroll);

router.get('/all', authorize('hr', 'admin'), payrollController.listAll);

router.post(
  '/',
  authorize('hr', 'admin'),
  validate(createPayrollSchema),
  payrollController.create
);

router.put(
  '/:id',
  authorize('hr', 'admin'),
  validate(updatePayrollSchema),
  payrollController.update
);

export default router;
