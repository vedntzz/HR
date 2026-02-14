import { Pool } from 'pg';
import {
  DepartmentRecord,
  CreateDepartmentDto,
  UpdateDepartmentDto,
} from './department.types';

export class DepartmentRepository {
  constructor(private readonly db: Pool) {}

  async findAll(companyId: string): Promise<DepartmentRecord[]> {
    const result = await this.db.query(
      'SELECT * FROM departments WHERE company_id = $1 ORDER BY name',
      [companyId]
    );
    return result.rows.map(this.mapRow);
  }

  async findById(
    id: string,
    companyId: string
  ): Promise<DepartmentRecord | null> {
    const result = await this.db.query(
      'SELECT * FROM departments WHERE id = $1 AND company_id = $2',
      [id, companyId]
    );
    return result.rows.length > 0 ? this.mapRow(result.rows[0]) : null;
  }

  async create(
    data: CreateDepartmentDto,
    companyId: string
  ): Promise<DepartmentRecord> {
    const result = await this.db.query(
      `INSERT INTO departments (name, description, head_id, company_id)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [
        data.name,
        data.description ?? null,
        data.headId ?? null,
        companyId,
      ]
    );
    return this.mapRow(result.rows[0]);
  }

  async update(
    id: string,
    companyId: string,
    data: UpdateDepartmentDto
  ): Promise<DepartmentRecord | null> {
    const fields: string[] = [];
    const params: unknown[] = [];
    let paramIndex = 1;

    const fieldMap = this.buildFieldMap(data);
    for (const [column, value] of Object.entries(fieldMap)) {
      fields.push(`${column} = $${paramIndex}`);
      params.push(value);
      paramIndex++;
    }

    if (fields.length === 0) return this.findById(id, companyId);

    params.push(id, companyId);
    const query = `
      UPDATE departments SET ${fields.join(', ')}
      WHERE id = $${paramIndex} AND company_id = $${paramIndex + 1}
      RETURNING *
    `;
    const result = await this.db.query(query, params);
    return result.rows.length > 0 ? this.mapRow(result.rows[0]) : null;
  }

  private buildFieldMap(data: UpdateDepartmentDto): Record<string, unknown> {
    const map: Record<string, unknown> = {};
    if (data.name !== undefined) map['name'] = data.name;
    if (data.description !== undefined) map['description'] = data.description;
    if (data.headId !== undefined) map['head_id'] = data.headId;
    return map;
  }

  private mapRow(row: Record<string, unknown>): DepartmentRecord {
    return {
      id: row.id as string,
      name: row.name as string,
      description: row.description as string | null,
      companyId: row.company_id as string,
      headId: row.head_id as string | null,
      createdAt: row.created_at as Date,
      updatedAt: row.updated_at as Date,
    };
  }
}
