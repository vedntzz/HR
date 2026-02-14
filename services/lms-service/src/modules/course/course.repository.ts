import { Pool } from 'pg';
import { CourseRecord, CreateCourseDto, UpdateCourseDto } from './course.types';

export class CourseRepository {
  constructor(private pool: Pool) {}

  async findAll(companyId: string): Promise<CourseRecord[]> {
    const result = await this.pool.query(
      `SELECT * FROM courses WHERE company_id = $1 ORDER BY created_at DESC`,
      [companyId],
    );
    return result.rows.map(this.mapRow);
  }

  async findById(id: string, companyId: string): Promise<CourseRecord | null> {
    const result = await this.pool.query(
      `SELECT * FROM courses WHERE id = $1 AND company_id = $2`,
      [id, companyId],
    );
    return result.rows[0] ? this.mapRow(result.rows[0]) : null;
  }

  async create(
    data: CreateCourseDto,
    companyId: string,
    createdBy: string,
  ): Promise<CourseRecord> {
    const result = await this.pool.query(
      `INSERT INTO courses (company_id, title, description, content_url, duration_minutes, is_mandatory, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [companyId, data.title, data.description ?? null, data.contentUrl ?? null,
       data.durationMinutes ?? 0, data.isMandatory ?? false, createdBy],
    );
    return this.mapRow(result.rows[0]);
  }

  async update(
    id: string,
    companyId: string,
    data: UpdateCourseDto,
  ): Promise<CourseRecord | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let idx = 1;

    if (data.title !== undefined) { fields.push(`title = $${idx++}`); values.push(data.title); }
    if (data.description !== undefined) { fields.push(`description = $${idx++}`); values.push(data.description); }
    if (data.contentUrl !== undefined) { fields.push(`content_url = $${idx++}`); values.push(data.contentUrl); }
    if (data.durationMinutes !== undefined) { fields.push(`duration_minutes = $${idx++}`); values.push(data.durationMinutes); }
    if (data.isMandatory !== undefined) { fields.push(`is_mandatory = $${idx++}`); values.push(data.isMandatory); }

    if (fields.length === 0) return this.findById(id, companyId);

    fields.push(`updated_at = NOW()`);
    values.push(id, companyId);

    const result = await this.pool.query(
      `UPDATE courses SET ${fields.join(', ')} WHERE id = $${idx++} AND company_id = $${idx} RETURNING *`,
      values,
    );
    return result.rows[0] ? this.mapRow(result.rows[0]) : null;
  }

  private mapRow(row: any): CourseRecord {
    return {
      id: row.id,
      companyId: row.company_id,
      title: row.title,
      description: row.description,
      contentUrl: row.content_url,
      durationMinutes: row.duration_minutes,
      isMandatory: row.is_mandatory,
      createdBy: row.created_by,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
}
