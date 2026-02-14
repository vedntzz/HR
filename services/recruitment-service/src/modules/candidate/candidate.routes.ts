import { Router } from 'express';
import { authenticate, authorize } from '../../middleware/auth';
import { validate } from '../../middleware/validate';
import {
  createCandidateSchema,
  updateCandidateSchema,
} from './candidate.schema';
import * as candidateController from './candidate.controller';

const router = Router();

router.use(authenticate);

router.get('/', authorize('hr', 'admin'), candidateController.listAll);

router.get('/:id', authorize('hr', 'admin'), candidateController.getById);

router.post(
  '/',
  authorize('hr', 'admin'),
  validate(createCandidateSchema),
  candidateController.create
);

router.put(
  '/:id',
  authorize('hr', 'admin'),
  validate(updateCandidateSchema),
  candidateController.update
);

export default router;
