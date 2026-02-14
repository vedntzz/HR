import { Pool, QueryResult } from 'pg';
import {
  EmployeeRecord,
  CreateEmployeeDto,
  UpdateEmployeeDto,
  PaginationParams,
  EmployeeFilters,
  PaginatedResult,
} from './employee.types';

export class EmployeeRepository {
  constructor(private readonly db: Pool) {}

  async findAll(
    companyId: string,
    pagination: PaginationParams,
    filters: EmployeeFilters
  ): Promise<PaginatedResult<EmployeeRecord>> {
    const { page, limit } = pagination;
    const offset = (page - 1) * limit;
    const conditions: string[] = ['e.company_id = $1'];
    const params: unknown[] = [companyId];
    let paramIndex = 2;

    this.applyFilters(conditions, params, filters, paramIndex);
    paramIndex = params.length + 1;

    const whereClause = conditions.join(' AND ');

    const countQuery = `SELECT COUNT(*) FROM employees e WHERE ${whereClause}`;
    const countResult: QueryResult = await this.db.query(countQuery, params);
    const total = parseInt(countResult.rows[0].count, 10);

    const dataQuery = `
      SELECT e.* FROM employees e
      WHERE ${whereClause}
      ORDER BY e.last_name ASC, e.first_name ASC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;
    const dataResult = await this.db.query(dataQuery, [...params, limit, offset]);

    return {
      data: dataResult.rows.map(this.mapRow),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findById(id: string, companyId: string): Promise<EmployeeRecord | null> {
    const result = await this.db.query(
      'SELECT * FROM employees WHERE id = $1 AND company_id = $2',
      [id, companyId]
    );
    return result.rows.length > 0 ? this.mapRow(result.rows[0]) : null;
  }

  async findByEmail(email: string, companyId: string): Promise<EmployeeRecord | null> {
    const result = await this.db.query(
      'SELECT * FROM employees WHERE email = $1 AND company_id = $2',
      [email, companyId]
    );
    return result.rows.length > 0 ? this.mapRow(result.rows[0]) : null;
  }

  async create(data: CreateEmployeeDto, userId: string): Promise<EmployeeRecord> {
    const result = await this.db.query(
      `INSERT INTO employees
        (user_id, first_name, last_name, email, phone, department_id, position, manager_id, hire_date, company_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [
        userId,
        data.firstName,
        data.lastName,
        data.email,
        data.phone ?? null,
        data.department,
        data.position,
        data.managerId ?? null,
        data.hireDate,
        data.companyId,
      ]
    );
    return this.mapRow(result.rows[0]);
  }

  async update(
    id: string,
    companyId: string,
    data: UpdateEmployeeDto
  ): Promise<EmployeeRecord | null> {
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
      UPDATE employees SET ${fields.join(', ')}
      WHERE id = $${paramIndex} AND company_id = $${paramIndex + 1}
      RETURNING *
    `;
    const result = await this.db.query(query, params);
    return result.rows.length > 0 ? this.mapRow(result.rows[0]) : null;
  }

  async getTeamMembers(
    managerId: string,
    companyId: string
  ): Promise<EmployeeRecord[]> {
    const result = await this.db.query(
      `SELECT * FROM employees
       WHERE manager_id = $1 AND company_id = $2 AND is_active = true
       ORDER BY last_name ASC, first_name ASC`,
      [managerId, companyId]
    );
    return result.rows.map(this.mapRow);
  }

  async getOrgChart(companyId: string): Promise<EmployeeRecord[]> {
    const result = await this.db.query(
      `SELECT * FROM employees
       WHERE company_id = $1 AND is_active = true
       ORDER BY last_name ASC, first_name ASC`,
      [companyId]
    );
    return result.rows.map(this.mapRow);
  }

  private applyFilters(
    conditions: string[],
    params: unknown[],
    filters: EmployeeFilters,
    startIndex: number
  ): void {
    let idx = startIndex;
    if (filters.departmentId) {
      conditions.push(`e.department_id = $${idx}`);
      params.push(filters.departmentId);
      idx++;
    }
    if (filters.isActive !== undefined) {
      conditions.push(`e.is_active = $${idx}`);
      params.push(filters.isActive);
      idx++;
    }
    if (filters.search) {
      conditions.push(
        `(e.first_name ILIKE $${idx} OR e.last_name ILIKE $${idx} OR e.email ILIKE $${idx})`
      );
      params.push(`%${filters.search}%`);
      idx++;
    }
    if (filters.managerId) {
      conditions.push(`e.manager_id = $${idx}`);
      params.push(filters.managerId);
    }
  }

  private buildFieldMap(data: UpdateEmployeeDto): Record<string, unknown> {
    const map: Record<string, unknown> = {};
    if (data.firstName !== undefined) map['first_name'] = data.firstName;
    if (data.lastName !== undefined) map['last_name'] = data.lastName;
    if (data.email !== undefined) map['email'] = data.email;
    if (data.phone !== undefined) map['phone'] = data.phone;
    if (data.departmentId !== undefined) map['department_id'] = data.departmentId;
    if (data.position !== undefined) map['position'] = data.position;
    if (data.managerId !== undefined) map['manager_id'] = data.managerId;
    if (data.hireDate !== undefined) map['hire_date'] = data.hireDate;
    if (data.avatarUrl !== undefined) map['avatar_url'] = data.avatarUrl;
    if (data.isActive !== undefined) map['is_active'] = data.isActive;
    return map;
  }

  private mapRow(row: any): EmployeeRecord {
    return {
      id: row.id,
      userId: row.user_id,
      firstName: row.first_name,
      lastName: row.last_name,
      email: row.email,
      phone: row.phone,
      departmentId: row.department_id,
      position: row.position,
      managerId: row.manager_id,
      hireDate: row.hire_date,
      companyId: row.company_id,
      avatarUrl: row.avatar_url,
      isActive: row.is_active,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
}
