import { Request, Response, NextFunction } from 'express';
import { TenantContext, ErrorCode } from '../types';

/**
 * Extracts tenant context from the verified JWT payload
 * attached by the auth middleware. Ensures every downstream
 * handler has access to companyId for query scoping.
 */
export function tenantGuard(req: Request, res: Response, next: NextFunction): void {
  const tenant = (req as any).tenant as TenantContext | undefined;

  if (!tenant?.companyId) {
    res.status(403).json({
      success: false,
      error: 'Tenant context missing. Access denied.',
      code: ErrorCode.TENANT_MISMATCH,
    });
    return;
  }

  next();
}

/**
 * Enforces that a request body or param referencing a companyId
 * matches the authenticated tenant's companyId.
 */
export function enforceTenantIsolation(
  companyIdFromPayload: string,
  companyIdFromResource: string
): boolean {
  return companyIdFromPayload === companyIdFromResource;
}
