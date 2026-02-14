import { Router } from 'express';
import { AttendanceController } from './attendance.controller';
import { authenticate, authorize } from '../../middleware/auth';
import { validate } from '../../middleware/validate';
import {
  checkInSchema,
  attendanceQuerySchema,
  summaryQuerySchema,
} from './attendance.schema';

const router = Router();
const controller = new AttendanceController();

router.use(authenticate);

router.post('/check-in', validate(checkInSchema), controller.checkIn);
router.post('/check-out', controller.checkOut);

router.get('/me', validate(attendanceQuerySchema), controller.getMyRecords);
router.get('/me/today', controller.getTodayStatus);

router.get(
  '/all',
  authorize('admin', 'hr'),
  validate(attendanceQuerySchema),
  controller.getAll
);

router.get('/summary', validate(summaryQuerySchema), controller.getSummary);

export { router as attendanceRoutes };
