import { pool } from '../../config/database';
import { PayrollRecord, CreatePayrollDto, UpdatePayrollDto, PayrollPagination } from './payroll.types';

const mapRow = (row: any): PayrollRecord => ({
  id: row.id,
  employeeId: row.employee_id,
  companyId: row.company_id,
  basicSalary: parseFloat(row.basic_salary),
  allowances: row.allowances || {},
  deductions: row.deductions || {},
  netSalary: parseFloat(row.net_salary),
  currency: row.currency,
  effectiveDate: row.effective_date,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

export const findByEmployee = async (
  employeeId: string,
  companyId: string
): Promise<PayrollRecord[]> => {
  const result = await pool.query(
    `SELECT * FROM payroll_config
     WHERE employee_id = $1 AND company_id = $2
     ORDER BY effective_date DESC`,
    [employeeId, companyId]
  );
  return result.rows.map(mapRow);
};

export const findAll = async (
  companyId: string,
  pagination: PayrollPagination
): Promise<{ data: PayrollRecord[]; total: number }> => {
  const offset = (pagination.page - 1) * pagination.limit;

  const countResult = await pool.query(
    'SELECT COUNT(*) FROM payroll_config WHERE company_id = $1',
    [companyId]
  );
  const total = parseInt(countResult.rows[0].count, 10);

  const result = await pool.query(
    `SELECT * FROM payroll_config
     WHERE company_id = $1
     ORDER BY created_at DESC
     LIMIT $2 OFFSET $3`,
    [companyId, pagination.limit, offset]
  );

  return { data: result.rows.map(mapRow), total };
};

export const create = async (
  data: CreatePayrollDto & { companyId: string }
): Promise<PayrollRecord> => {
  const result = await pool.query(
    `INSERT INTO payroll_config
       (employee_id, company_id, basic_salary, allowances, deductions, net_salary, currency, effective_date)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING *`,
    [
      data.employeeId, data.companyId, data.basicSalary,
      JSON.stringify(data.allowances || {}),
      JSON.stringify(data.deductions || {}),
      data.netSalary, data.currency || 'USD', data.effectiveDate,
    ]
  );
  return mapRow(result.rows[0]);
};

export const update = async (
  id: string,
  companyId: string,
  data: UpdatePayrollDto
): Promise<PayrollRecord | null> => {
  const fields: string[] = [];
  const values: any[] = [];
  let paramIndex = 1;

  if (data.basicSalary !== undefined) {
    fields.push(`basic_salary = $${paramIndex++}`);
    values.push(data.basicSalary);
  }
  if (data.allowances !== undefined) {
    fields.push(`allowances = $${paramIndex++}`);
    values.push(JSON.stringify(data.allowances));
  }
  if (data.deductions !== undefined) {
    fields.push(`deductions = $${paramIndex++}`);
    values.push(JSON.stringify(data.deductions));
  }
  if (data.netSalary !== undefined) {
    fields.push(`net_salary = $${paramIndex++}`);
    values.push(data.netSalary);
  }
  if (data.currency !== undefined) {
    fields.push(`currency = $${paramIndex++}`);
    values.push(data.currency);
  }
  if (data.effectiveDate !== undefined) {
    fields.push(`effective_date = $${paramIndex++}`);
    values.push(data.effectiveDate);
  }

  if (fields.length === 0) return null;

  fields.push(`updated_at = NOW()`);
  values.push(id, companyId);

  const result = await pool.query(
    `UPDATE payroll_config SET ${fields.join(', ')}
     WHERE id = $${paramIndex++} AND company_id = $${paramIndex}
     RETURNING *`,
    values
  );

  return result.rows.length > 0 ? mapRow(result.rows[0]) : null;
};
