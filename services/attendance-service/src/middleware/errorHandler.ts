import { Request, Response, NextFunction } from 'express';
import { AppError } from '../modules/attendance/attendance.service';

interface ErrorResponse {
  success: false;
  error: string;
  statusCode: number;
  stack?: string;
}

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  console.error('Error:', err.message);

  if (err instanceof AppError) {
    const response: ErrorResponse = {
      success: false,
      error: err.message,
      statusCode: err.statusCode,
    };
    res.status(err.statusCode).json(response);
    return;
  }

  if (err.name === 'ZodError') {
    res.status(400).json({
      success: false,
      error: 'Validation failed',
      statusCode: 400,
      details: JSON.parse(err.message),
    });
    return;
  }

  if (err.name === 'JsonWebTokenError') {
    res.status(401).json({
      success: false,
      error: 'Invalid token',
      statusCode: 401,
    });
    return;
  }

  if (err.name === 'TokenExpiredError') {
    res.status(401).json({
      success: false,
      error: 'Token expired',
      statusCode: 401,
    });
    return;
  }

  const statusCode = 500;
  const response: ErrorResponse = {
    success: false,
    error: 'Internal server error',
    statusCode,
  };

  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
    response.error = err.message;
  }

  res.status(statusCode).json(response);
}
