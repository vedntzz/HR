import { pool } from './database';

const migrationSQL = `
  CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

  CREATE TABLE IF NOT EXISTS attendance_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id UUID NOT NULL,
    company_id UUID NOT NULL,
    check_in TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    check_out TIMESTAMPTZ,
    status VARCHAR(20) DEFAULT 'checked_in',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
  );

  CREATE INDEX IF NOT EXISTS idx_attendance_company ON attendance_logs(company_id);
  CREATE INDEX IF NOT EXISTS idx_attendance_employee ON attendance_logs(company_id, employee_id);
  CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance_logs(company_id, employee_id, check_in);
`;

async function migrate(): Promise<void> {
  try {
    console.log('Running attendance-service migrations...');
    await pool.query(migrationSQL);
    console.log('Attendance-service migrations completed successfully');
  } catch (error) {
    console.error('Attendance-service migration failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

migrate();
