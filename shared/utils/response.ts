import { Response } from 'express';
import { ApiResponse, PaginationMeta } from '../types';

export function sendSuccess<T>(res: Response, data: T, status = 200): void {
  const body: ApiResponse<T> = { success: true, data };
  res.status(status).json(body);
}

export function sendPaginated<T>(
  res: Response,
  data: T[],
  meta: PaginationMeta
): void {
  const body: ApiResponse<T[]> = { success: true, data, meta };
  res.status(200).json(body);
}

export function sendError(res: Response, message: string, status = 500): void {
  const body: ApiResponse = { success: false, error: message };
  res.status(status).json(body);
}
