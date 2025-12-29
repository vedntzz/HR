import { Router } from 'express';
import { body } from 'express-validator';
import {
  getMyPayslips,
  getPayslipById,
  getAllPayrolls,
  generatePayroll,
  processPayroll,
} from '../controllers/payrollController';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validator';
import { auditLog } from '../middleware/auditLog';

const router = Router();

router.get('/my-payslips', authenticate, getMyPayslips);
router.get('/all', authenticate, authorize('ADMIN', 'HR'), getAllPayrolls);
router.get('/:id', authenticate, getPayslipById);

router.post(
  '/generate',
  authenticate,
  authorize('ADMIN', 'HR'),
  [
    body('employeeId').notEmpty().withMessage('Employee ID is required'),
    body('month').isInt({ min: 1, max: 12 }).withMessage('Valid month is required'),
    body('year').isInt({ min: 2020 }).withMessage('Valid year is required'),
  ],
  validate,
  auditLog('GENERATE', 'PAYROLL'),
  generatePayroll
);

router.put(
  '/:id/process',
  authenticate,
  authorize('ADMIN', 'HR'),
  auditLog('PROCESS', 'PAYROLL'),
  processPayroll
);

export default router;
