export interface PayslipRecord {
  id: string;
  employeeId: string;
  companyId: string;
  payPeriodStart: Date;
  payPeriodEnd: Date;
  basicSalary: number;
  allowances: number;
  deductions: number;
  tax: number;
  netPay: number;
  currency: string;
  status: 'draft' | 'generated' | 'sent';
  generatedAt: Date;
}

export interface GeneratePayslipDto {
  employeeId: string;
  payPeriodStart: string;
  payPeriodEnd: string;
  basicSalary: number;
  allowances?: number;
  deductions?: number;
  tax?: number;
}
