// ─── Core Tenant Types ───────────────────────────────────────
export interface TenantContext {
  companyId: string;
  userId: string;
  role: UserRole;
  email: string;
}

export type UserRole = 'admin' | 'hr' | 'manager' | 'employee';

// ─── JWT Payload ─────────────────────────────────────────────
export interface JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
  companyId: string;
  iat?: number;
  exp?: number;
}

// ─── API Response Envelope ───────────────────────────────────
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  meta?: PaginationMeta;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
}

// ─── Service Communication ───────────────────────────────────
export interface ServiceHealthCheck {
  service: string;
  status: 'healthy' | 'degraded' | 'down';
  timestamp: string;
}

// ─── Common Entity Fields ────────────────────────────────────
export interface BaseEntity {
  id: string;
  companyId: string;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Employee (cross-service reference) ──────────────────────
export interface EmployeeRef {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  department?: string;
  position?: string;
  avatarUrl?: string;
}

// ─── Error Codes ─────────────────────────────────────────────
export enum ErrorCode {
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  CONFLICT = 'CONFLICT',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  TENANT_MISMATCH = 'TENANT_MISMATCH',
}
