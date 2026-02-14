import { z } from 'zod';

export const createCourseSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().optional(),
  contentUrl: z.string().url().max(500).optional(),
  durationMinutes: z.number().int().min(0).optional(),
  isMandatory: z.boolean().optional(),
});

export const updateCourseSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  description: z.string().optional(),
  contentUrl: z.string().url().max(500).optional(),
  durationMinutes: z.number().int().min(0).optional(),
  isMandatory: z.boolean().optional(),
});
