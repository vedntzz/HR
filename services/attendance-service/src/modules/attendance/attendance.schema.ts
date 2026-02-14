import { z } from 'zod';

export const checkInSchema = z.object({
  body: z.object({
    notes: z.string().max(500).optional(),
  }),
});

export const checkOutSchema = z.object({
  body: z.object({}).strict().optional(),
});

export const attendanceQuerySchema = z.object({
  query: z.object({
    month: z
      .string()
      .regex(/^\d{1,2}$/)
      .transform(Number)
      .pipe(z.number().min(1).max(12))
      .optional(),
    year: z
      .string()
      .regex(/^\d{4}$/)
      .transform(Number)
      .pipe(z.number().min(2000).max(2100))
      .optional(),
    employeeId: z.string().uuid().optional(),
    date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/)
      .optional(),
    departmentFilter: z.string().uuid().optional(),
    page: z
      .string()
      .regex(/^\d+$/)
      .transform(Number)
      .pipe(z.number().min(1))
      .optional()
      .default('1'),
    limit: z
      .string()
      .regex(/^\d+$/)
      .transform(Number)
      .pipe(z.number().min(1).max(100))
      .optional()
      .default('20'),
  }),
});

export const summaryQuerySchema = z.object({
  query: z.object({
    month: z
      .string()
      .regex(/^\d{1,2}$/)
      .transform(Number)
      .pipe(z.number().min(1).max(12)),
    year: z
      .string()
      .regex(/^\d{4}$/)
      .transform(Number)
      .pipe(z.number().min(2000).max(2100)),
    employeeId: z.string().uuid().optional(),
  }),
});

export type CheckInInput = z.infer<typeof checkInSchema>;
export type AttendanceQueryInput = z.infer<typeof attendanceQuerySchema>;
export type SummaryQueryInput = z.infer<typeof summaryQuerySchema>;
