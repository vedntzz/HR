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
  port: parseInt(requireEnv('PORT', '3003'), 10),
  nodeEnv: requireEnv('NODE_ENV', 'development'),

  db: {
    host: requireEnv('DB_HOST', 'localhost'),
    port: parseInt(requireEnv('DB_PORT', '5432'), 10),
    user: requireEnv('DB_USER', 'postgres'),
    password: requireEnv('DB_PASSWORD', 'postgres'),
    name: requireEnv('DB_NAME', 'hrflow_attendance'),
  },

  jwt: {
    secret: requireEnv('JWT_SECRET', 'dev-secret-change-me'),
  },
} as const;
