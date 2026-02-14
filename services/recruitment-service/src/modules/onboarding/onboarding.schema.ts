import { z } from 'zod';

const checklistItemSchema = z.object({
  label: z.string().min(1, 'Label is required'),
  completed: z.boolean().optional().default(false),
  completedAt: z.string().datetime().optional(),
});

export const createOnboardingSchema = z.object({
  candidateId: z.string().uuid('Candidate ID must be a valid UUID'),
  employeeId: z.string().uuid('Employee ID must be a valid UUID').optional(),
  title: z.string().min(1, 'Title is required').max(200),
  items: z.array(checklistItemSchema).min(1, 'At least one item is required'),
});

export const updateOnboardingSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  employeeId: z.string().uuid().optional(),
  items: z.array(checklistItemSchema).optional(),
  isCompleted: z.boolean().optional(),
});
