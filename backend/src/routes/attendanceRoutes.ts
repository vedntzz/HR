import { Router } from 'express';
import {
  checkIn,
  checkOut,
  getMyAttendance,
  getAllAttendance,
  getTodayStats,
} from '../controllers/attendanceController';
import { authenticate, authorize } from '../middleware/auth';
import { auditLog } from '../middleware/auditLog';

const router = Router();

router.post('/check-in', authenticate, auditLog('CHECK_IN', 'ATTENDANCE'), checkIn);
router.post('/check-out', authenticate, auditLog('CHECK_OUT', 'ATTENDANCE'), checkOut);
router.get('/my-attendance', authenticate, getMyAttendance);
router.get('/all', authenticate, authorize('ADMIN', 'HR', 'MANAGER'), getAllAttendance);
router.get('/stats/today', authenticate, authorize('ADMIN', 'HR', 'MANAGER'), getTodayStats);

export default router;
