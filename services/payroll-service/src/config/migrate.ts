import { pool } from './database';

const createTables = async (): Promise<void> => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    await client.query(`
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

      CREATE TABLE IF NOT EXISTS payroll_config (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        employee_id UUID NOT NULL,
        company_id UUID NOT NULL,
        basic_salary DECIMAL(12,2) NOT NULL,
        allowances JSONB DEFAULT '{}',
        deductions JSONB DEFAULT '{}',
        net_salary DECIMAL(12,2),
        currency VARCHAR(3) DEFAULT 'USD',
        effective_date DATE NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS idx_payroll_config_company
        ON payroll_config(company_id);
      CREATE INDEX IF NOT EXISTS idx_payroll_config_employee
        ON payroll_config(employee_id, company_id);

      CREATE TABLE IF NOT EXISTS payslips (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        employee_id UUID NOT NULL,
        company_id UUID NOT NULL,
        pay_period_start DATE NOT NULL,
        pay_period_end DATE NOT NULL,
        basic_salary DECIMAL(12,2) NOT NULL,
        allowances DECIMAL(12,2) DEFAULT 0,
        deductions DECIMAL(12,2) DEFAULT 0,
        tax DECIMAL(12,2) DEFAULT 0,
        net_pay DECIMAL(12,2) NOT NULL,
        currency VARCHAR(3) DEFAULT 'USD',
        status VARCHAR(20) DEFAULT 'generated',
        generated_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS idx_payslips_company
        ON payslips(company_id);
      CREATE INDEX IF NOT EXISTS idx_payslips_employee
        ON payslips(employee_id, company_id);
    `);

    await client.query('COMMIT');
    console.log('Migration completed successfully');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Migration failed:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
};

createTables().catch((err) => {
  console.error(err);
  process.exit(1);
});
