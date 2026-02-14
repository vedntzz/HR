import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JwtPayload, TenantContext, UserRole, ErrorCode } from '../types';

const JWT_SECRET = process.env.JWT_SECRET || 'hrflow-dev-secret-change-me';

/**
 * Verifies the Bearer token and attaches tenant context to the request.
 */
export function authenticate(req: Request, res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    res.status(401).json({
      success: false,
      error: 'Authentication required',
      code: ErrorCode.UNAUTHORIZED,
    });
    return;
  }

  try {
    const token = header.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

    const tenant: TenantContext = {
      userId: decoded.sub,
      email: decoded.email,
      role: decoded.role,
      companyId: decoded.companyId,
    };

    (req as any).tenant = tenant;
    next();
  } catch {
    res.status(401).json({
      success: false,
      error: 'Invalid or expired token',
      code: ErrorCode.UNAUTHORIZED,
    });
  }
}

/**
 * Role-based access control middleware factory.
 */
export function authorize(...allowedRoles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const tenant = (req as any).tenant as TenantContext | undefined;

    if (!tenant) {
      res.status(401).json({
        success: false,
        error: 'Authentication required',
        code: ErrorCode.UNAUTHORIZED,
      });
      return;
    }

    if (!allowedRoles.includes(tenant.role)) {
      res.status(403).json({
        success: false,
        error: 'Insufficient permissions',
        code: ErrorCode.FORBIDDEN,
      });
      return;
    }

    next();
  };
}
