import { apiGet, apiPost } from '@/lib/api';

export interface PayrollConfig {
  id: string;
  basicSalary: number;
  allowances: Record<string, number>;
  deductions: Record<string, number>;
  netSalary: number;
  currency: string;
  effectiveDate: string;
}

export interface Payslip {
  id: string;
  payPeriodStart: string;
  payPeriodEnd: string;
  basicSalary: number;
  allowances: number;
  deductions: number;
  tax: number;
  netPay: number;
  currency: string;
  status: string;
  generatedAt: string;
}

export async function getMyPayroll(): Promise<PayrollConfig | null> {
  return apiGet('/api/payroll/payroll/me');
}

export async function getMyPayslips(): Promise<Payslip[]> {
  return apiGet('/api/payroll/payslips/me');
}

export async function getPayslip(id: string): Promise<Payslip> {
  return apiGet(`/api/payroll/payslips/me/${id}`);
}

export async function getAllPayslips(
  filters?: Record<string, string>
): Promise<Payslip[]> {
  const params = filters ? `?${new URLSearchParams(filters)}` : '';
  return apiGet(`/api/payroll/payslips/all${params}`);
}

export async function generatePayslip(
  data: Partial<Payslip>
): Promise<Payslip> {
  return apiPost('/api/payroll/payslips/generate', data);
}
