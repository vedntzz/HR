import { pool } from '../../config/database';
import {
  CandidateRecord,
  CreateCandidateDto,
  UpdateCandidateDto,
} from './candidate.types';

const mapRow = (row: any): CandidateRecord => ({
  id: row.id,
  companyId: row.company_id,
  firstName: row.first_name,
  lastName: row.last_name,
  email: row.email,
  phone: row.phone,
  positionApplied: row.position_applied,
  resumeUrl: row.resume_url,
  stage: row.stage,
  source: row.source,
  notes: row.notes,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

export const findAll = async (
  companyId: string,
  filters?: { stage?: string }
): Promise<CandidateRecord[]> => {
  let query = 'SELECT * FROM candidates WHERE company_id = $1';
  const params: any[] = [companyId];

  if (filters?.stage) {
    query += ' AND stage = $2';
    params.push(filters.stage);
  }

  query += ' ORDER BY created_at DESC';
  const result = await pool.query(query, params);
  return result.rows.map(mapRow);
};

export const findById = async (
  id: string,
  companyId: string
): Promise<CandidateRecord | null> => {
  const result = await pool.query(
    'SELECT * FROM candidates WHERE id = $1 AND company_id = $2',
    [id, companyId]
  );
  return result.rows.length > 0 ? mapRow(result.rows[0]) : null;
};

export const create = async (
  data: CreateCandidateDto,
  companyId: string
): Promise<CandidateRecord> => {
  const result = await pool.query(
    `INSERT INTO candidates
       (company_id, first_name, last_name, email, phone,
        position_applied, resume_url, source, notes)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     RETURNING *`,
    [
      companyId,
      data.firstName,
      data.lastName,
      data.email,
      data.phone || null,
      data.positionApplied,
      data.resumeUrl || null,
      data.source || null,
      data.notes || null,
    ]
  );
  return mapRow(result.rows[0]);
};

export const update = async (
  id: string,
  companyId: string,
  data: UpdateCandidateDto
): Promise<CandidateRecord | null> => {
  const fields: string[] = [];
  const values: any[] = [];
  let idx = 1;

  const fieldMap: Record<string, string> = {
    firstName: 'first_name',
    lastName: 'last_name',
    email: 'email',
    phone: 'phone',
    positionApplied: 'position_applied',
    resumeUrl: 'resume_url',
    stage: 'stage',
    source: 'source',
    notes: 'notes',
  };

  for (const [key, column] of Object.entries(fieldMap)) {
    const value = (data as any)[key];
    if (value !== undefined) {
      fields.push(`${column} = $${idx++}`);
      values.push(value);
    }
  }

  if (fields.length === 0) return null;

  fields.push('updated_at = NOW()');
  values.push(id, companyId);

  const result = await pool.query(
    `UPDATE candidates SET ${fields.join(', ')}
     WHERE id = $${idx++} AND company_id = $${idx}
     RETURNING *`,
    values
  );
  return result.rows.length > 0 ? mapRow(result.rows[0]) : null;
};
