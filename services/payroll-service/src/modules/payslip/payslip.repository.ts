import { pool } from '../../config/database';
import { PayslipRecord, GeneratePayslipDto } from './payslip.types';

const mapRow = (row: any): PayslipRecord => ({
  id: row.id,
  employeeId: row.employee_id,
  companyId: row.company_id,
  payPeriodStart: row.pay_period_start,
  payPeriodEnd: row.pay_period_end,
  basicSalary: parseFloat(row.basic_salary),
  allowances: parseFloat(row.allowances),
  deductions: parseFloat(row.deductions),
  tax: parseFloat(row.tax),
  netPay: parseFloat(row.net_pay),
  currency: row.currency,
  status: row.status,
  generatedAt: row.generated_at,
});

export const findByEmployee = async (
  employeeId: string,
  companyId: string
): Promise<PayslipRecord[]> => {
  const result = await pool.query(
    `SELECT * FROM payslips
     WHERE employee_id = $1 AND company_id = $2
     ORDER BY pay_period_end DESC`,
    [employeeId, companyId]
  );
  return result.rows.map(mapRow);
};

export const findById = async (
  id: string,
  companyId: string
): Promise<PayslipRecord | null> => {
  const result = await pool.query(
    `SELECT * FROM payslips
     WHERE id = $1 AND company_id = $2`,
    [id, companyId]
  );
  return result.rows.length > 0 ? mapRow(result.rows[0]) : null;
};

export const create = async (
  data: GeneratePayslipDto,
  companyId: string
): Promise<PayslipRecord> => {
  const netPay =
    data.basicSalary +
    (data.allowances || 0) -
    (data.deductions || 0) -
    (data.tax || 0);

  const result = await pool.query(
    `INSERT INTO payslips
       (employee_id, company_id, pay_period_start, pay_period_end,
        basic_salary, allowances, deductions, tax, net_pay, currency, status)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'USD', 'generated')
     RETURNING *`,
    [
      data.employeeId,
      companyId,
      data.payPeriodStart,
      data.payPeriodEnd,
      data.basicSalary,
      data.allowances || 0,
      data.deductions || 0,
      data.tax || 0,
      netPay,
    ]
  );
  return mapRow(result.rows[0]);
};

export const findAll = async (
  companyId: string,
  filters?: { employeeId?: string; status?: string }
): Promise<PayslipRecord[]> => {
  let query = 'SELECT * FROM payslips WHERE company_id = $1';
  const params: any[] = [companyId];
  let paramIndex = 2;

  if (filters?.employeeId) {
    query += ` AND employee_id = $${paramIndex++}`;
    params.push(filters.employeeId);
  }
  if (filters?.status) {
    query += ` AND status = $${paramIndex++}`;
    params.push(filters.status);
  }

  query += ' ORDER BY generated_at DESC';
  const result = await pool.query(query, params);
  return result.rows.map(mapRow);
};
