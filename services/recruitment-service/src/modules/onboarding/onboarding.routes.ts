import { Router } from 'express';
import { authenticate, authorize } from '../../middleware/auth';
import { validate } from '../../middleware/validate';
import {
  createOnboardingSchema,
  updateOnboardingSchema,
} from './onboarding.schema';
import * as onboardingController from './onboarding.controller';

const router = Router();

router.use(authenticate);

router.get(
  '/',
  authorize('hr', 'admin'),
  onboardingController.listAll
);

router.get(
  '/candidate/:candidateId',
  authorize('hr', 'admin'),
  onboardingController.listByCandidate
);

router.get(
  '/:id',
  authorize('hr', 'admin'),
  onboardingController.getById
);

router.post(
  '/',
  authorize('hr', 'admin'),
  validate(createOnboardingSchema),
  onboardingController.create
);

router.put(
  '/:id',
  authorize('hr', 'admin'),
  validate(updateOnboardingSchema),
  onboardingController.update
);

export default router;
