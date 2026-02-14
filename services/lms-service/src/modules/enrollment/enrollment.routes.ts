import { Router } from 'express';
import pool from '../../config/database';
import { authenticate, authorize } from '../../middleware/auth';
import { validate } from '../../middleware/validate';
import { assignEnrollmentSchema, updateProgressSchema } from './enrollment.schema';
import { EnrollmentRepository } from './enrollment.repository';
import { EnrollmentService } from './enrollment.service';
import { EnrollmentController } from './enrollment.controller';

const router = Router();

const repo = new EnrollmentRepository(pool);
const service = new EnrollmentService(repo);
const controller = new EnrollmentController(service);

router.use(authenticate);

router.get('/me', controller.getMyEnrollments);
router.get('/course/:courseId', authorize('admin', 'hr'), controller.getByCourse);
router.post('/assign', authorize('admin', 'hr'), validate(assignEnrollmentSchema), controller.assign);
router.put('/:id/progress', validate(updateProgressSchema), controller.updateProgress);

export default router;
