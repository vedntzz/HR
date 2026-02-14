import { pool } from '../../config/database';
import {
  OnboardingChecklist,
  CreateOnboardingDto,
  UpdateOnboardingDto,
} from './onboarding.types';

const mapRow = (row: any): OnboardingChecklist => ({
  id: row.id,
  candidateId: row.candidate_id,
  companyId: row.company_id,
  employeeId: row.employee_id,
  title: row.title,
  items: row.items || [],
  isCompleted: row.is_completed,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

export const findAll = async (
  companyId: string
): Promise<OnboardingChecklist[]> => {
  const result = await pool.query(
    `SELECT * FROM onboarding_checklists
     WHERE company_id = $1
     ORDER BY created_at DESC`,
    [companyId]
  );
  return result.rows.map(mapRow);
};

export const findByCandidate = async (
  candidateId: string,
  companyId: string
): Promise<OnboardingChecklist[]> => {
  const result = await pool.query(
    `SELECT * FROM onboarding_checklists
     WHERE candidate_id = $1 AND company_id = $2
     ORDER BY created_at DESC`,
    [candidateId, companyId]
  );
  return result.rows.map(mapRow);
};

export const findById = async (
  id: string,
  companyId: string
): Promise<OnboardingChecklist | null> => {
  const result = await pool.query(
    `SELECT * FROM onboarding_checklists
     WHERE id = $1 AND company_id = $2`,
    [id, companyId]
  );
  return result.rows.length > 0 ? mapRow(result.rows[0]) : null;
};

export const create = async (
  data: CreateOnboardingDto,
  companyId: string
): Promise<OnboardingChecklist> => {
  const result = await pool.query(
    `INSERT INTO onboarding_checklists
       (candidate_id, company_id, employee_id, title, items)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [
      data.candidateId,
      companyId,
      data.employeeId || null,
      data.title,
      JSON.stringify(data.items),
    ]
  );
  return mapRow(result.rows[0]);
};

export const update = async (
  id: string,
  companyId: string,
  data: UpdateOnboardingDto
): Promise<OnboardingChecklist | null> => {
  const fields: string[] = [];
  const values: any[] = [];
  let idx = 1;

  if (data.title !== undefined) {
    fields.push(`title = $${idx++}`);
    values.push(data.title);
  }
  if (data.employeeId !== undefined) {
    fields.push(`employee_id = $${idx++}`);
    values.push(data.employeeId);
  }
  if (data.items !== undefined) {
    fields.push(`items = $${idx++}`);
    values.push(JSON.stringify(data.items));
  }
  if (data.isCompleted !== undefined) {
    fields.push(`is_completed = $${idx++}`);
    values.push(data.isCompleted);
  }

  if (fields.length === 0) return null;

  fields.push('updated_at = NOW()');
  values.push(id, companyId);

  const result = await pool.query(
    `UPDATE onboarding_checklists SET ${fields.join(', ')}
     WHERE id = $${idx++} AND company_id = $${idx}
     RETURNING *`,
    values
  );
  return result.rows.length > 0 ? mapRow(result.rows[0]) : null;
};
