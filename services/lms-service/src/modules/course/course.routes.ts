import { Router } from 'express';
import pool from '../../config/database';
import { authenticate, authorize } from '../../middleware/auth';
import { validate } from '../../middleware/validate';
import { createCourseSchema, updateCourseSchema } from './course.schema';
import { CourseRepository } from './course.repository';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';

const router = Router();

const repo = new CourseRepository(pool);
const service = new CourseService(repo);
const controller = new CourseController(service);

router.use(authenticate);

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', authorize('admin', 'hr'), validate(createCourseSchema), controller.create);
router.put('/:id', authorize('admin', 'hr'), validate(updateCourseSchema), controller.update);

export default router;
