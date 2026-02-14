import { query } from '../../config/database';
import {
  AttendanceRecord,
  AttendanceRow,
  AttendanceSummary,
  PaginatedResult,
} from './attendance.types';

function mapRowToRecord(row: AttendanceRow): AttendanceRecord {
  const checkIn = new Date(row.check_in);
  const checkOut = row.check_out ? new Date(row.check_out) : null;
  const duration = checkOut
    ? Math.round((checkOut.getTime() - checkIn.getTime()) / (1000 * 60))
    : null;

  return {
    id: row.id,
    employeeId: row.employee_id,
    companyId: row.company_id,
    checkIn,
    checkOut,
    status: row.status,
    notes: row.notes,
    duration,
    createdAt: new Date(row.created_at),
  };
}

export class AttendanceRepository {
  async findTodayByEmployee(
    employeeId: string,
    companyId: string
  ): Promise<AttendanceRecord | null> {
    const sql = `
      SELECT * FROM attendance_logs
      WHERE employee_id = $1
        AND company_id = $2
        AND check_in::date = CURRENT_DATE
      ORDER BY check_in DESC
      LIMIT 1
    `;
    const result = await query<AttendanceRow>(sql, [employeeId, companyId]);
    return result.rows[0] ? mapRowToRecord(result.rows[0]) : null;
  }

  async checkIn(
    employeeId: string,
    companyId: string,
    notes?: string
  ): Promise<AttendanceRecord> {
    const sql = `
      INSERT INTO attendance_logs (employee_id, company_id, check_in, status, notes)
      VALUES ($1, $2, NOW(), 'checked_in', $3)
      RETURNING *
    `;
    const result = await query<AttendanceRow>(sql, [employeeId, companyId, notes ?? null]);
    return mapRowToRecord(result.rows[0]);
  }

  async checkOut(id: string, companyId: string): Promise<AttendanceRecord> {
    const sql = `
      UPDATE attendance_logs
      SET check_out = NOW(),
          status = 'checked_out'
      WHERE id = $1
        AND company_id = $2
      RETURNING *
    `;
    const result = await query<AttendanceRow>(sql, [id, companyId]);
    return mapRowToRecord(result.rows[0]);
  }

  async findByEmployee(
    employeeId: string,
    companyId: string,
    month?: number,
    year?: number
  ): Promise<AttendanceRecord[]> {
    let sql = `
      SELECT * FROM attendance_logs
      WHERE employee_id = $1
        AND company_id = $2
    `;
    const params: unknown[] = [employeeId, companyId];

    if (month !== undefined && year !== undefined) {
      sql += ` AND EXTRACT(MONTH FROM check_in) = $3 AND EXTRACT(YEAR FROM check_in) = $4`;
      params.push(month, year);
    }

    sql += ` ORDER BY check_in DESC`;

    const result = await query<AttendanceRow>(sql, params);
    return result.rows.map(mapRowToRecord);
  }

  async findAll(
    companyId: string,
    date?: string,
    departmentFilter?: string,
    page: number = 1,
    limit: number = 20
  ): Promise<PaginatedResult<AttendanceRecord>> {
    const offset = (page - 1) * limit;
    let whereClauses = `WHERE a.company_id = $1`;
    const params: unknown[] = [companyId];
    let paramIndex = 2;

    if (date) {
      whereClauses += ` AND a.check_in::date = $${paramIndex}`;
      params.push(date);
      paramIndex++;
    }

    if (departmentFilter) {
      whereClauses += ` AND a.employee_id IN (
        SELECT id FROM employees WHERE department_id = $${paramIndex} AND company_id = $1
      )`;
      params.push(departmentFilter);
      paramIndex++;
    }

    const countSql = `SELECT COUNT(*) as total FROM attendance_logs a ${whereClauses}`;
    const countResult = await query<{ total: string }>(countSql, params);
    const total = parseInt(countResult.rows[0].total, 10);

    const dataSql = `
      SELECT a.* FROM attendance_logs a
      ${whereClauses}
      ORDER BY a.check_in DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;
    params.push(limit, offset);
    const dataResult = await query<AttendanceRow>(dataSql, params);

    return {
      data: dataResult.rows.map(mapRowToRecord),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getSummary(
    employeeId: string,
    companyId: string,
    month: number,
    year: number
  ): Promise<AttendanceSummary> {
    const sql = `
      SELECT
        COUNT(*)::int AS total_days,
        COALESCE(AVG(
          EXTRACT(EPOCH FROM (check_out - check_in)) / 3600
        ), 0)::float AS avg_hours,
        COUNT(
          CASE WHEN EXTRACT(HOUR FROM check_in) >= 9
                AND EXTRACT(MINUTE FROM check_in) > 15
          THEN 1 END
        )::int AS late_count
      FROM attendance_logs
      WHERE employee_id = $1
        AND company_id = $2
        AND EXTRACT(MONTH FROM check_in) = $3
        AND EXTRACT(YEAR FROM check_in) = $4
        AND status = 'checked_out'
    `;
    const result = await query<{
      total_days: number;
      avg_hours: number;
      late_count: number;
    }>(sql, [employeeId, companyId, month, year]);

    const row = result.rows[0];
    return {
      totalDays: row.total_days,
      avgHours: Math.round(row.avg_hours * 100) / 100,
      lateCount: row.late_count,
    };
  }
}
