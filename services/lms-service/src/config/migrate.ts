import pool from './database';

const migrate = async (): Promise<void> => {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

      CREATE TABLE IF NOT EXISTS courses (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        company_id UUID NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        content_url VARCHAR(500),
        duration_minutes INTEGER DEFAULT 0,
        is_mandatory BOOLEAN DEFAULT false,
        created_by UUID,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS idx_courses_company ON courses(company_id);

      CREATE TABLE IF NOT EXISTS enrollments (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
        employee_id UUID NOT NULL,
        company_id UUID NOT NULL,
        status VARCHAR(20) DEFAULT 'not_started',
        progress INTEGER DEFAULT 0,
        assigned_at TIMESTAMPTZ DEFAULT NOW(),
        completed_at TIMESTAMPTZ,
        UNIQUE(course_id, employee_id, company_id)
      );

      CREATE INDEX IF NOT EXISTS idx_enrollments_company ON enrollments(company_id);
    `);
    console.log('LMS migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  } finally {
    client.release();
  }
  await pool.end();
};

migrate();
