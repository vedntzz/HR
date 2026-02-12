import { Request, Response, NextFunction } from 'express';
import prisma from '../config/database';

export const auditLog = (action: string, entity: string) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const originalJson = res.json.bind(res);

    res.json = function (body: any) {
      // Only log successful operations
      if (req.user && res.statusCode >= 200 && res.statusCode < 300) {
        prisma.auditLog
          .create({
            data: {
              userId: req.user.userId,
              action,
              entity,
              entityId: req.params.id || body?.data?.id || null,
              newValues: JSON.stringify(body),
              ipAddress: req.ip,
              userAgent: req.get('user-agent') || null,
            },
          })
          .catch((err) => console.error('Audit log error:', err));
      }

      return originalJson(body);
    };

    next();
  };
};
