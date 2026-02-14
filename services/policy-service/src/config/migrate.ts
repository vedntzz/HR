import pool from './database';

const migrate = async (): Promise<void> => {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

      CREATE TABLE IF NOT EXISTS policies (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        company_id UUID NOT NULL,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        category VARCHAR(50) DEFAULT 'general',
        version VARCHAR(20) DEFAULT 'v1.0',
        is_active BOOLEAN DEFAULT true,
        created_by UUID,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS idx_policies_company ON policies(company_id);

      CREATE TABLE IF NOT EXISTS policy_acknowledgements (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        policy_id UUID NOT NULL REFERENCES policies(id) ON DELETE CASCADE,
        employee_id UUID NOT NULL,
        company_id UUID NOT NULL,
        acknowledged_at TIMESTAMPTZ DEFAULT NOW(),
        UNIQUE(policy_id, employee_id, company_id)
      );

      CREATE INDEX IF NOT EXISTS idx_acks_company ON policy_acknowledgements(company_id);
    `);
    console.log('Policy migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  } finally {
    client.release();
  }
  await pool.end();
};

migrate();
