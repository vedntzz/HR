import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { AuthPayload } from '../modules/attendance/attendance.types';

declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}

export function authenticate(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      success: false,
      error: 'No authentication token provided',
      statusCode: 401,
    });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, config.jwt.secret) as AuthPayload;

    if (!decoded.companyId) {
      res.status(401).json({
        success: false,
        error: 'Token missing tenant context (companyId)',
        statusCode: 401,
      });
      return;
    }

    if (!decoded.employeeId) {
      res.status(401).json({
        success: false,
        error: 'Token missing employee context (employeeId)',
        statusCode: 401,
      });
      return;
    }

    req.user = decoded;
    next();
  } catch (error) {
    next(error);
  }
}

export function authorize(...allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = req.user as AuthPayload | undefined;

    if (!user) {
      res.status(401).json({
        success: false,
        error: 'Authentication required',
        statusCode: 401,
      });
      return;
    }

    if (!allowedRoles.includes(user.role)) {
      res.status(403).json({
        success: false,
        error: 'Insufficient permissions',
        statusCode: 403,
      });
      return;
    }

    next();
  };
}
