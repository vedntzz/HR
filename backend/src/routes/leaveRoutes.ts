import { Router } from 'express';
import { body } from 'express-validator';
import {
  createLeaveRequest,
  getMyLeaveRequests,
  getLeaveBalance,
  getAllLeaveRequests,
  updateLeaveStatus,
  deleteLeaveRequest,
} from '../controllers/leaveController';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validator';
import { auditLog } from '../middleware/auditLog';

const router = Router();

router.post(
  '/',
  authenticate,
  [
    body('leaveType').isIn(['ANNUAL', 'SICK', 'EMERGENCY', 'MATERNITY', 'PATERNITY', 'COMP_OFF', 'UNPAID']),
    body('startDate').isISO8601().withMessage('Valid start date is required'),
    body('endDate').isISO8601().withMessage('Valid end date is required'),
    body('reason').notEmpty().withMessage('Reason is required'),
  ],
  validate,
  auditLog('CREATE', 'LEAVE_REQUEST'),
  createLeaveRequest
);

router.get('/my-requests', authenticate, getMyLeaveRequests);
router.get('/balance', authenticate, getLeaveBalance);
router.get('/all', authenticate, authorize('ADMIN', 'HR', 'MANAGER'), getAllLeaveRequests);

router.put(
  '/:id/status',
  authenticate,
  authorize('ADMIN', 'HR', 'MANAGER'),
  [
    body('status').isIn(['APPROVED', 'REJECTED', 'CANCELLED']),
    body('comments').optional().isString(),
  ],
  validate,
  auditLog('UPDATE_STATUS', 'LEAVE_REQUEST'),
  updateLeaveStatus
);

router.delete('/:id', authenticate, deleteLeaveRequest);

export default router;
