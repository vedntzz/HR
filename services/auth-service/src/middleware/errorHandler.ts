import { Request, Response, NextFunction } from 'express';
import { AppError, ValidationError } from '../errors';

interface ApiErrorResponse {
  success: false;
  message: string;
  code: string;
  details?: Record<string, string[]>;
  stack?: string;
}

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof ValidationError) {
    const response: ApiErrorResponse = {
      success: false,
      message: err.message,
      code: err.code,
      details: err.details,
    };

    res.status(err.statusCode).json(response);
    return;
  }

  if (err instanceof AppError) {
    const response: ApiErrorResponse = {
      success: false,
      message: err.message,
      code: err.code,
    };

    res.status(err.statusCode).json(response);
    return;
  }

  // Log unexpected errors
  console.error('Unhandled error:', err);

  const isDevelopment = process.env.NODE_ENV === 'development';

  const response: ApiErrorResponse = {
    success: false,
    message: isDevelopment ? err.message : 'An unexpected error occurred',
    code: 'INTERNAL_SERVER_ERROR',
    ...(isDevelopment && { stack: err.stack }),
  };

  res.status(500).json(response);
}
