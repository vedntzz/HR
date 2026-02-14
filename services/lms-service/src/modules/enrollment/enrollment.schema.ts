import { z } from 'zod';

export const assignEnrollmentSchema = z.object({
  courseId: z.string().uuid(),
  employeeIds: z.array(z.string().uuid()).min(1),
});

export const updateProgressSchema = z.object({
  status: z.enum(['not_started', 'in_progress', 'completed']).optional(),
  progress: z.number().int().min(0).max(100).optional(),
});
