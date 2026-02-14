import { z } from 'zod';

export const createDepartmentSchema = z.object({
  name: z
    .string()
    .min(1, 'Department name is required')
    .max(100, 'Department name must be 100 characters or less')
    .trim(),
  description: z
    .string()
    .max(500, 'Description must be 500 characters or less')
    .trim()
    .optional(),
  headId: z.string().uuid('Invalid head employee ID').optional(),
});

export const updateDepartmentSchema = z.object({
  name: z
    .string()
    .min(1, 'Department name must not be empty')
    .max(100, 'Department name must be 100 characters or less')
    .trim()
    .optional(),
  description: z
    .string()
    .max(500, 'Description must be 500 characters or less')
    .trim()
    .optional(),
  headId: z.string().uuid('Invalid head employee ID').optional(),
});

export const departmentIdParamSchema = z.object({
  id: z.string().uuid('Invalid department ID'),
});
