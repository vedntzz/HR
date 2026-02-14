import { Router } from 'express';
import { authenticate, authorize } from '../../middleware/auth';
import { validate } from '../../middleware/validate';
import { generatePayslipSchema } from './payslip.schema';
import * as payslipController from './payslip.controller';

const router = Router();

router.use(authenticate);

router.get('/me', payslipController.getMyPayslips);

router.get('/me/:id', payslipController.getDetail);

router.get('/all', authorize('hr', 'admin'), payslipController.listAll);

router.post(
  '/generate',
  authorize('hr', 'admin'),
  validate(generatePayslipSchema),
  payslipController.generate
);

export default router;
