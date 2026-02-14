import { Router } from 'express';
import pool from '../../config/database';
import { authenticate, authorize } from '../../middleware/auth';
import { validate } from '../../middleware/validate';
import { createPolicySchema, updatePolicySchema } from './policy.schema';
import { PolicyRepository } from './policy.repository';
import { PolicyService } from './policy.service';
import { PolicyController } from './policy.controller';

const router = Router();

const repo = new PolicyRepository(pool);
const service = new PolicyService(repo);
const controller = new PolicyController(service);

router.use(authenticate);

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', authorize('admin', 'hr'), validate(createPolicySchema), controller.create);
router.put('/:id', authorize('admin', 'hr'), validate(updatePolicySchema), controller.update);
router.post('/:id/acknowledge', controller.acknowledge);
router.get('/:id/acknowledgements', authorize('admin', 'hr'), controller.getAcknowledgements);

export default router;
