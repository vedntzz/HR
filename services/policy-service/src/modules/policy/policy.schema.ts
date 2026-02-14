import { z } from 'zod';

export const createPolicySchema = z.object({
  title: z.string().min(1).max(255),
  content: z.string().min(1),
  category: z.string().max(50).optional(),
  version: z.string().max(20).optional(),
  isActive: z.boolean().optional(),
});

export const updatePolicySchema = z.object({
  title: z.string().min(1).max(255).optional(),
  content: z.string().min(1).optional(),
  category: z.string().max(50).optional(),
  version: z.string().max(20).optional(),
  isActive: z.boolean().optional(),
});
