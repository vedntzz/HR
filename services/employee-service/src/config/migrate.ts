import { pool } from './database';

const CREATE_DEPARTMENTS_TABLE = `
  CREATE TABLE IF NOT EXISTS departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    company_id UUID NOT NULL,
    head_id UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(name, company_id)
  );
`;

const CREATE_EMPLOYEES_TABLE = `
  CREATE TABLE IF NOT EXISTS employees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
    position VARCHAR(100),
    manager_id UUID REFERENCES employees(id) ON DELETE SET NULL,
    hire_date DATE NOT NULL,
    company_id UUID NOT NULL,
    avatar_url VARCHAR(500),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(email, company_id)
  );
`;

const CREATE_INDEXES = `
  CREATE INDEX IF NOT EXISTS idx_employees_company_id ON employees(company_id);
  CREATE INDEX IF NOT EXISTS idx_employees_department_id ON employees(department_id);
  CREATE INDEX IF NOT EXISTS idx_employees_manager_id ON employees(manager_id);
  CREATE INDEX IF NOT EXISTS idx_employees_user_id ON employees(user_id);
  CREATE INDEX IF NOT EXISTS idx_departments_company_id ON departments(company_id);
`;

const CREATE_UPDATED_AT_FUNCTION = `
  CREATE OR REPLACE FUNCTION update_updated_at_column()
  RETURNS TRIGGER AS $$
  BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
  END;
  $$ LANGUAGE plpgsql;
`;

const CREATE_TRIGGERS = `
  DROP TRIGGER IF EXISTS set_departments_updated_at ON departments;
  CREATE TRIGGER set_departments_updated_at
    BEFORE UPDATE ON departments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

  DROP TRIGGER IF EXISTS set_employees_updated_at ON employees;
  CREATE TRIGGER set_employees_updated_at
    BEFORE UPDATE ON employees
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
`;

async function migrate(): Promise<void> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    console.log('Creating departments table...');
    await client.query(CREATE_DEPARTMENTS_TABLE);

    console.log('Creating employees table...');
    await client.query(CREATE_EMPLOYEES_TABLE);

    console.log('Creating indexes...');
    await client.query(CREATE_INDEXES);

    console.log('Creating updated_at trigger function...');
    await client.query(CREATE_UPDATED_AT_FUNCTION);

    console.log('Creating triggers...');
    await client.query(CREATE_TRIGGERS);

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
}

migrate().catch((err) => {
  console.error('Migration process failed:', err);
  process.exit(1);
});
