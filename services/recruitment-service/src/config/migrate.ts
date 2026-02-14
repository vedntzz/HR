import { pool } from './database';

const createTables = async (): Promise<void> => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    await client.query(`
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

      CREATE TABLE IF NOT EXISTS candidates (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        company_id UUID NOT NULL,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        position_applied VARCHAR(200) NOT NULL,
        resume_url TEXT,
        stage VARCHAR(30) DEFAULT 'applied',
        source VARCHAR(100),
        notes TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS idx_candidates_company
        ON candidates(company_id);
      CREATE INDEX IF NOT EXISTS idx_candidates_stage
        ON candidates(company_id, stage);
      CREATE INDEX IF NOT EXISTS idx_candidates_email
        ON candidates(email, company_id);

      CREATE TABLE IF NOT EXISTS interview_feedback (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        candidate_id UUID NOT NULL REFERENCES candidates(id),
        company_id UUID NOT NULL,
        interviewer_id UUID NOT NULL,
        rating INT CHECK (rating >= 1 AND rating <= 5),
        strengths TEXT[],
        culture_fit INT CHECK (culture_fit >= 1 AND culture_fit <= 5),
        technical_score INT CHECK (technical_score >= 1 AND technical_score <= 5),
        communication_score INT CHECK (communication_score >= 1 AND communication_score <= 5),
        recommendation VARCHAR(20) NOT NULL,
        decision_summary TEXT,
        notes TEXT,
        interview_date TIMESTAMPTZ NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS idx_interview_feedback_company
        ON interview_feedback(company_id);
      CREATE INDEX IF NOT EXISTS idx_interview_feedback_candidate
        ON interview_feedback(candidate_id, company_id);

      CREATE TABLE IF NOT EXISTS onboarding_checklists (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        candidate_id UUID NOT NULL REFERENCES candidates(id),
        company_id UUID NOT NULL,
        employee_id UUID,
        title VARCHAR(200) NOT NULL,
        items JSONB NOT NULL DEFAULT '[]',
        is_completed BOOLEAN DEFAULT false,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS idx_onboarding_company
        ON onboarding_checklists(company_id);
      CREATE INDEX IF NOT EXISTS idx_onboarding_candidate
        ON onboarding_checklists(candidate_id, company_id);
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
