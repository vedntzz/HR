import { Router } from 'express';
import { authenticate, authorize } from '../../middleware/auth';
import { validate } from '../../middleware/validate';
import {
  createInterviewFeedbackSchema,
  updateInterviewFeedbackSchema,
} from './interview.schema';
import * as interviewController from './interview.controller';

const router = Router();

router.use(authenticate);

router.get(
  '/all',
  authorize('hr', 'admin'),
  interviewController.listAll
);

router.get(
  '/candidate/:candidateId',
  authorize('hr', 'admin'),
  interviewController.listByCandidate
);

router.get(
  '/:id',
  authorize('hr', 'admin'),
  interviewController.getById
);

router.post(
  '/',
  authorize('hr', 'admin'),
  validate(createInterviewFeedbackSchema),
  interviewController.create
);

router.put(
  '/:id',
  authorize('hr', 'admin'),
  validate(updateInterviewFeedbackSchema),
  interviewController.update
);

export default router;
