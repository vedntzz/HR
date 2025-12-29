import { Router } from 'express';
import { body } from 'express-validator';
import {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getDepartments,
} from '../controllers/employeeController';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validator';
import { auditLog } from '../middleware/auditLog';

const router = Router();

router.get('/', authenticate, authorize('ADMIN', 'HR', 'MANAGER'), getAllEmployees);
router.get('/departments', authenticate, getDepartments);
router.get('/:id', authenticate, authorize('ADMIN', 'HR', 'MANAGER'), getEmployeeById);

router.post(
  '/',
  authenticate,
  authorize('ADMIN', 'HR'),
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('firstName').notEmpty().withMessage('First name is required'),
    body('lastName').notEmpty().withMessage('Last name is required'),
    body('designation').notEmpty().withMessage('Designation is required'),
    body('departmentId').notEmpty().withMessage('Department is required'),
    body('joiningDate').isISO8601().withMessage('Valid joining date is required'),
  ],
  validate,
  auditLog('CREATE', 'EMPLOYEE'),
  createEmployee
);

router.put(
  '/:id',
  authenticate,
  authorize('ADMIN', 'HR'),
  auditLog('UPDATE', 'EMPLOYEE'),
  updateEmployee
);

router.delete(
  '/:id',
  authenticate,
  authorize('ADMIN', 'HR'),
  auditLog('DELETE', 'EMPLOYEE'),
  deleteEmployee
);

export default router;
