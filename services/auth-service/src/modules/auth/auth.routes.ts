import { Router } from 'express';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthRepository } from './auth.repository';
import { validate } from '../../middleware/validate';
import { authenticate } from '../../middleware/authenticate';
import { registerSchema, loginSchema, refreshSchema } from './auth.schema';
import { pool } from '../../config/database';

export function createAuthRouter(): Router {
  const router = Router();

  const authRepository = new AuthRepository(pool);
  const authService = new AuthService(authRepository);
  const authController = new AuthController(authService);

  router.post('/register', validate(registerSchema), authController.register);
  router.post('/login', validate(loginSchema), authController.login);
  router.post('/refresh', validate(refreshSchema), authController.refresh);
  router.get('/profile', authenticate, authController.getProfile);

  return router;
}
