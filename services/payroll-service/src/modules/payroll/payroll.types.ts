export interface PayrollRecord {
  id: string;
  employeeId: string;
  companyId: string;
  basicSalary: number;
  allowances: Record<string, number>;
  deductions: Record<string, number>;
  netSalary: number;
  currency: string;
  effectiveDate: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePayrollDto {
  employeeId: string;
  basicSalary: number;
  allowances?: Record<string, number>;
  deductions?: Record<string, number>;
  netSalary: number;
  currency?: string;
  effectiveDate: string;
}

export interface UpdatePayrollDto {
  basicSalary?: number;
  allowances?: Record<string, number>;
  deductions?: Record<string, number>;
  netSalary?: number;
  currency?: string;
  effectiveDate?: string;
}

export interface PayrollPagination {
  page: number;
  limit: number;
}
