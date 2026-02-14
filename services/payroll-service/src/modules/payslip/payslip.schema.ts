import { z } from 'zod';

const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

export const generatePayslipSchema = z.object({
  employeeId: z.string().uuid('Employee ID must be a valid UUID'),
  payPeriodStart: z
    .string()
    .regex(dateRegex, 'Pay period start must be YYYY-MM-DD'),
  payPeriodEnd: z
    .string()
    .regex(dateRegex, 'Pay period end must be YYYY-MM-DD'),
  basicSalary: z.number().positive('Basic salary must be positive'),
  allowances: z.number().min(0).optional().default(0),
  deductions: z.number().min(0).optional().default(0),
  tax: z.number().min(0).optional().default(0),
});
