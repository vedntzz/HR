import { Pool } from 'pg';
import { EnrollmentRecord, UpdateProgressDto } from './enrollment.types';

export class EnrollmentRepository {
  constructor(private pool: Pool) {}

  async findByEmployee(employeeId: string, companyId: string): Promise<EnrollmentRecord[]> {
    const result = await this.pool.query(
      `SELECT * FROM enrollments WHERE employee_id = $1 AND company_id = $2 ORDER BY assigned_at DESC`,
      [employeeId, companyId],
    );
    return result.rows.map(this.mapRow);
  }

  async findByCourse(courseId: string, companyId: string): Promise<EnrollmentRecord[]> {
    const result = await this.pool.query(
      `SELECT * FROM enrollments WHERE course_id = $1 AND company_id = $2 ORDER BY assigned_at DESC`,
      [courseId, companyId],
    );
    return result.rows.map(this.mapRow);
  }

  async assign(
    courseId: string,
    employeeIds: string[],
    companyId: string,
  ): Promise<EnrollmentRecord[]> {
    const values: any[] = [];
    const placeholders: string[] = [];
    let idx = 1;

    for (const empId of employeeIds) {
      placeholders.push(`($${idx++}, $${idx++}, $${idx++})`);
      values.push(courseId, empId, companyId);
    }

    const result = await this.pool.query(
      `INSERT INTO enrollments (course_id, employee_id, company_id)
       VALUES ${placeholders.join(', ')}
       ON CONFLICT (course_id, employee_id, company_id) DO NOTHING
       RETURNING *`,
      values,
    );
    return result.rows.map(this.mapRow);
  }

  async updateProgress(
    id: string,
    companyId: string,
    data: UpdateProgressDto,
  ): Promise<EnrollmentRecord | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let idx = 1;

    if (data.status !== undefined) {
      fields.push(`status = $${idx++}`);
      values.push(data.status);
    }
    if (data.progress !== undefined) {
      fields.push(`progress = $${idx++}`);
      values.push(data.progress);
    }
    if (data.status === 'completed') {
      fields.push(`completed_at = NOW()`);
    }

    if (fields.length === 0) return null;

    values.push(id, companyId);
    const result = await this.pool.query(
      `UPDATE enrollments SET ${fields.join(', ')} WHERE id = $${idx++} AND company_id = $${idx} RETURNING *`,
      values,
    );
    return result.rows[0] ? this.mapRow(result.rows[0]) : null;
  }

  private mapRow(row: any): EnrollmentRecord {
    return {
      id: row.id,
      courseId: row.course_id,
      employeeId: row.employee_id,
      companyId: row.company_id,
      status: row.status,
      progress: row.progress,
      assignedAt: row.assigned_at,
      completedAt: row.completed_at,
    };
  }
}
