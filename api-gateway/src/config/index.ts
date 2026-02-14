import dotenv from 'dotenv';

dotenv.config();

function requiredEnv(key: string, defaultValue?: string): string {
  const value = process.env[key] ?? defaultValue;
  if (value === undefined) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

function optionalEnv(key: string, defaultValue: string): string {
  return process.env[key] ?? defaultValue;
}

function numericEnv(key: string, defaultValue: number): number {
  const raw = process.env[key];
  if (raw === undefined) {
    return defaultValue;
  }
  const parsed = parseInt(raw, 10);
  if (isNaN(parsed)) {
    throw new Error(`Environment variable ${key} must be a number, got: ${raw}`);
  }
  return parsed;
}

export interface Config {
  port: number;
  nodeEnv: string;
  jwtSecret: string;
  corsOrigin: string;
  rateLimit: {
    windowMs: number;
    maxRequests: number;
  };
  services: {
    auth: string;
    employee: string;
    attendance: string;
    payroll: string;
    recruitment: string;
    lms: string;
    policy: string;
  };
}

export const config: Config = {
  port: numericEnv('PORT', 3000),
  nodeEnv: optionalEnv('NODE_ENV', 'development'),
  jwtSecret: requiredEnv('JWT_SECRET', 'dev-secret-change-in-production'),
  corsOrigin: optionalEnv('CORS_ORIGIN', '*'),
  rateLimit: {
    windowMs: numericEnv('RATE_LIMIT_WINDOW_MS', 900000),
    maxRequests: numericEnv('RATE_LIMIT_MAX_REQUESTS', 100),
  },
  services: {
    auth: requiredEnv('AUTH_SERVICE_URL', 'http://localhost:3001'),
    employee: requiredEnv('EMPLOYEE_SERVICE_URL', 'http://localhost:3002'),
    attendance: requiredEnv('ATTENDANCE_SERVICE_URL', 'http://localhost:3003'),
    payroll: requiredEnv('PAYROLL_SERVICE_URL', 'http://localhost:3004'),
    recruitment: requiredEnv('RECRUITMENT_SERVICE_URL', 'http://localhost:3005'),
    lms: requiredEnv('LMS_SERVICE_URL', 'http://localhost:3006'),
    policy: requiredEnv('POLICY_SERVICE_URL', 'http://localhost:3007'),
  },
};
