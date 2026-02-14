import { pool } from '../../config/database';
import {
  InterviewFeedback,
  CreateInterviewFeedbackDto,
  UpdateInterviewFeedbackDto,
} from './interview.types';

const mapRow = (row: any): InterviewFeedback => ({
  id: row.id,
  candidateId: row.candidate_id,
  companyId: row.company_id,
  interviewerId: row.interviewer_id,
  rating: row.rating,
  strengths: row.strengths || [],
  cultureFit: row.culture_fit,
  technicalScore: row.technical_score,
  communicationScore: row.communication_score,
  recommendation: row.recommendation,
  decisionSummary: row.decision_summary,
  notes: row.notes,
  interviewDate: row.interview_date,
  createdAt: row.created_at,
});

export const findByCandidate = async (
  candidateId: string,
  companyId: string
): Promise<InterviewFeedback[]> => {
  const result = await pool.query(
    `SELECT * FROM interview_feedback
     WHERE candidate_id = $1 AND company_id = $2
     ORDER BY interview_date DESC`,
    [candidateId, companyId]
  );
  return result.rows.map(mapRow);
};

export const findById = async (
  id: string,
  companyId: string
): Promise<InterviewFeedback | null> => {
  const result = await pool.query(
    `SELECT * FROM interview_feedback
     WHERE id = $1 AND company_id = $2`,
    [id, companyId]
  );
  return result.rows.length > 0 ? mapRow(result.rows[0]) : null;
};

export const findAll = async (
  companyId: string
): Promise<InterviewFeedback[]> => {
  const result = await pool.query(
    `SELECT * FROM interview_feedback
     WHERE company_id = $1
     ORDER BY interview_date DESC`,
    [companyId]
  );
  return result.rows.map(mapRow);
};

export const create = async (
  data: CreateInterviewFeedbackDto,
  interviewerId: string,
  companyId: string
): Promise<InterviewFeedback> => {
  const result = await pool.query(
    `INSERT INTO interview_feedback
       (candidate_id, company_id, interviewer_id, rating, strengths,
        culture_fit, technical_score, communication_score,
        recommendation, decision_summary, notes, interview_date)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
     RETURNING *`,
    [
      data.candidateId,
      companyId,
      interviewerId,
      data.rating,
      data.strengths || [],
      data.cultureFit,
      data.technicalScore,
      data.communicationScore,
      data.recommendation,
      data.decisionSummary || null,
      data.notes || null,
      data.interviewDate,
    ]
  );
  return mapRow(result.rows[0]);
};

export const update = async (
  id: string,
  companyId: string,
  data: UpdateInterviewFeedbackDto
): Promise<InterviewFeedback | null> => {
  const fields: string[] = [];
  const values: any[] = [];
  let idx = 1;

  const fieldMap: Record<string, string> = {
    rating: 'rating',
    strengths: 'strengths',
    cultureFit: 'culture_fit',
    technicalScore: 'technical_score',
    communicationScore: 'communication_score',
    recommendation: 'recommendation',
    decisionSummary: 'decision_summary',
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

  values.push(id, companyId);

  const result = await pool.query(
    `UPDATE interview_feedback SET ${fields.join(', ')}
     WHERE id = $${idx++} AND company_id = $${idx}
     RETURNING *`,
    values
  );
  return result.rows.length > 0 ? mapRow(result.rows[0]) : null;
};
