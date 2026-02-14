import dotenv from 'dotenv';

dotenv.config();

function requireEnv(key: string, defaultValue?: string): string {
  const value = process.env[key] ?? defaultValue;
  if (value === undefined) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export const config = {
  port: parseInt(requireEnv('PORT', '3001'), 10),
  nodeEnv: requireEnv('NODE_ENV', 'development'),

  db: {
    host: requireEnv('DB_HOST', 'localhost'),
    port: parseInt(requireEnv('DB_PORT', '5432'), 10),
    database: requireEnv('DB_NAME', 'hrflow_auth'),
    user: requireEnv('DB_USER', 'postgres'),
    password: requireEnv('DB_PASSWORD', 'postgres'),
  },

  jwt: {
    secret: requireEnv('JWT_SECRET', 'dev-secret-change-me'),
    expiresIn: requireEnv('JWT_EXPIRES_IN', '24h'),
    refreshExpiresIn: requireEnv('JWT_REFRESH_EXPIRES_IN', '7d'),
  },

  cors: {
    origin: requireEnv('CORS_ORIGIN', 'http://localhost:3000'),
  },
} as const;

export type Config = typeof config;
