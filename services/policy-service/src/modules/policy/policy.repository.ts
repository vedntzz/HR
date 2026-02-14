import { Pool } from 'pg';
import { PolicyRecord, PolicyAcknowledgement, CreatePolicyDto, UpdatePolicyDto } from './policy.types';

export class PolicyRepository {
  constructor(private pool: Pool) {}

  async findAll(companyId: string, employeeId?: string): Promise<any[]> {
    if (employeeId) {
      const result = await this.pool.query(
        `SELECT p.*, pa.acknowledged_at
         FROM policies p
         LEFT JOIN policy_acknowledgements pa
           ON pa.policy_id = p.id AND pa.employee_id = $2 AND pa.company_id = $1
         WHERE p.company_id = $1
         ORDER BY p.created_at DESC`,
        [companyId, employeeId],
      );
      return result.rows.map((row) => ({
        ...this.mapRow(row),
        acknowledgedAt: row.acknowledged_at ?? null,
      }));
    }

    const result = await this.pool.query(
      `SELECT * FROM policies WHERE company_id = $1 ORDER BY created_at DESC`,
      [companyId],
    );
    return result.rows.map(this.mapRow);
  }

  async findById(id: string, companyId: string): Promise<PolicyRecord | null> {
    const result = await this.pool.query(
      `SELECT * FROM policies WHERE id = $1 AND company_id = $2`,
      [id, companyId],
    );
    return result.rows[0] ? this.mapRow(result.rows[0]) : null;
  }

  async create(data: CreatePolicyDto, companyId: string, createdBy: string): Promise<PolicyRecord> {
    const result = await this.pool.query(
      `INSERT INTO policies (company_id, title, content, category, version, is_active, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [companyId, data.title, data.content, data.category ?? 'general',
       data.version ?? 'v1.0', data.isActive ?? true, createdBy],
    );
    return this.mapRow(result.rows[0]);
  }

  async update(id: string, companyId: string, data: UpdatePolicyDto): Promise<PolicyRecord | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let idx = 1;

    if (data.title !== undefined) { fields.push(`title = $${idx++}`); values.push(data.title); }
    if (data.content !== undefined) { fields.push(`content = $${idx++}`); values.push(data.content); }
    if (data.category !== undefined) { fields.push(`category = $${idx++}`); values.push(data.category); }
    if (data.version !== undefined) { fields.push(`version = $${idx++}`); values.push(data.version); }
    if (data.isActive !== undefined) { fields.push(`is_active = $${idx++}`); values.push(data.isActive); }

    if (fields.length === 0) return this.findById(id, companyId);

    fields.push(`updated_at = NOW()`);
    values.push(id, companyId);

    const result = await this.pool.query(
      `UPDATE policies SET ${fields.join(', ')} WHERE id = $${idx++} AND company_id = $${idx} RETURNING *`,
      values,
    );
    return result.rows[0] ? this.mapRow(result.rows[0]) : null;
  }

  async acknowledge(
    policyId: string,
    employeeId: string,
    companyId: string,
  ): Promise<PolicyAcknowledgement> {
    const result = await this.pool.query(
      `INSERT INTO policy_acknowledgements (policy_id, employee_id, company_id)
       VALUES ($1, $2, $3)
       ON CONFLICT (policy_id, employee_id, company_id) DO UPDATE SET acknowledged_at = NOW()
       RETURNING *`,
      [policyId, employeeId, companyId],
    );
    return this.mapAckRow(result.rows[0]);
  }

  async getAcknowledgements(policyId: string, companyId: string): Promise<PolicyAcknowledgement[]> {
    const result = await this.pool.query(
      `SELECT * FROM policy_acknowledgements WHERE policy_id = $1 AND company_id = $2 ORDER BY acknowledged_at DESC`,
      [policyId, companyId],
    );
    return result.rows.map(this.mapAckRow);
  }

  private mapRow(row: any): PolicyRecord {
    return {
      id: row.id,
      companyId: row.company_id,
      title: row.title,
      content: row.content,
      category: row.category,
      version: row.version,
      isActive: row.is_active,
      createdBy: row.created_by,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  private mapAckRow(row: any): PolicyAcknowledgement {
    return {
      id: row.id,
      policyId: row.policy_id,
      employeeId: row.employee_id,
      companyId: row.company_id,
      acknowledgedAt: row.acknowledged_at,
    };
  }
}
