import { z } from 'zod';

export const createEmployeeSchema = z.object({
  firstName: z
    .string()
    .min(1, 'First name is required')
    .max(100, 'First name must be 100 characters or less')
    .trim(),
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .max(100, 'Last name must be 100 characters or less')
    .trim(),
  email: z
    .string()
    .email('Invalid email address')
    .max(255, 'Email must be 255 characters or less')
    .toLowerCase()
    .trim(),
  department: z.string().uuid('Invalid department ID'),
  position: z
    .string()
    .min(1, 'Position is required')
    .max(100, 'Position must be 100 characters or less')
    .trim(),
  phone: z
    .string()
    .max(50, 'Phone must be 50 characters or less')
    .optional(),
  managerId: z.string().uuid('Invalid manager ID').optional(),
  hireDate: z.string().regex(
    /^\d{4}-\d{2}-\d{2}$/,
    'Hire date must be in YYYY-MM-DD format'
  ),
});

export const updateEmployeeSchema = z.object({
  firstName: z
    .string()
    .min(1)
    .max(100)
    .trim()
    .optional(),
  lastName: z
    .string()
    .min(1)
    .max(100)
    .trim()
    .optional(),
  email: z
    .string()
    .email()
    .max(255)
    .toLowerCase()
    .trim()
    .optional(),
  phone: z
    .string()
    .max(50)
    .optional(),
  departmentId: z.string().uuid().optional(),
  position: z
    .string()
    .min(1)
    .max(100)
    .trim()
    .optional(),
  managerId: z.string().uuid().nullable().optional(),
  hireDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
  avatarUrl: z
    .string()
    .url()
    .max(500)
    .optional(),
  isActive: z.boolean().optional(),
});

export const employeeIdParamSchema = z.object({
  id: z.string().uuid('Invalid employee ID'),
});

export const listEmployeesQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  departmentId: z.string().uuid().optional(),
  isActive: z
    .enum(['true', 'false'])
    .transform((v) => v === 'true')
    .optional(),
  search: z.string().max(200).optional(),
  managerId: z.string().uuid().optional(),
});
