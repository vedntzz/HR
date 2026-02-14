import { z } from 'zod';

export const createPayrollSchema = z.object({
  employeeId: z.string().uuid('Employee ID must be a valid UUID'),
  basicSalary: z.number().positive('Basic salary must be positive'),
  allowances: z.record(z.string(), z.number()).optional().default({}),
  deductions: z.record(z.string(), z.number()).optional().default({}),
  netSalary: z.number().positive('Net salary must be positive'),
  currency: z.string().length(3).optional().default('USD'),
  effectiveDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD'),
});

export const updatePayrollSchema = z.object({
  basicSalary: z.number().positive('Basic salary must be positive').optional(),
  allowances: z.record(z.string(), z.number()).optional(),
  deductions: z.record(z.string(), z.number()).optional(),
  netSalary: z.number().positive('Net salary must be positive').optional(),
  currency: z.string().length(3).optional(),
  effectiveDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD')
    .optional(),
});
