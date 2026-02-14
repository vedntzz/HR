import { pool } from './database';

const migrationSQL = `
  CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

  CREATE TYPE user_role AS ENUM ('admin', 'hr', 'manager', 'employee');

  CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role user_role NOT NULL DEFAULT 'employee',
    company_id UUID NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(email, company_id)
  );

  CREATE TABLE IF NOT EXISTS refresh_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(500) NOT NULL UNIQUE,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
  );

  CREATE INDEX IF NOT EXISTS idx_users_company ON users(company_id);
  CREATE INDEX IF NOT EXISTS idx_users_email_company ON users(email, company_id);
`;

async function migrate(): Promise<void> {
  try {
    console.log('Running auth-service migrations...');
    await pool.query(migrationSQL);
    console.log('Auth-service migrations completed successfully');
  } catch (error) {
    console.error('Auth-service migration failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

migrate();
