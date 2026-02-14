import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { UnauthorizedError } from './errorHandler';

export interface TenantContext {
  userId: string;
  email: string;
  role: string;
  companyId: string;
}

interface JwtPayload {
  sub: string;
  email: string;
  role: string;
  companyId: string;
  iat?: number;
  exp?: number;
}

export function authMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('Missing or invalid authorization header');
    }

    const token = authHeader.slice(7);
    if (!token) {
      throw new UnauthorizedError('Token not provided');
    }

    const decoded = jwt.verify(token, config.jwt.secret) as JwtPayload;

    if (!decoded.sub || !decoded.companyId) {
      throw new UnauthorizedError('Invalid token payload');
    }

    const tenant: TenantContext = {
      userId: decoded.sub,
      email: decoded.email,
      role: decoded.role,
      companyId: decoded.companyId,
    };

    (req as any).tenant = tenant;
    next();
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      next(error);
      return;
    }
    if (error instanceof jwt.JsonWebTokenError) {
      next(new UnauthorizedError('Invalid token'));
      return;
    }
    if (error instanceof jwt.TokenExpiredError) {
      next(new UnauthorizedError('Token expired'));
      return;
    }
    next(new UnauthorizedError('Authentication failed'));
  }
}
