import { z } from 'zod';

const stages = [
  'applied',
  'screening',
  'interview',
  'offer',
  'hired',
  'rejected',
] as const;

export const createCandidateSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(100),
  lastName: z.string().min(1, 'Last name is required').max(100),
  email: z.string().email('Invalid email address'),
  phone: z.string().max(50).optional(),
  positionApplied: z.string().min(1, 'Position is required').max(200),
  resumeUrl: z.string().url('Invalid URL').optional(),
  source: z.string().max(100).optional(),
  notes: z.string().optional(),
});

export const updateCandidateSchema = z.object({
  firstName: z.string().min(1).max(100).optional(),
  lastName: z.string().min(1).max(100).optional(),
  email: z.string().email('Invalid email address').optional(),
  phone: z.string().max(50).optional(),
  positionApplied: z.string().min(1).max(200).optional(),
  resumeUrl: z.string().url('Invalid URL').optional(),
  stage: z.enum(stages).optional(),
  source: z.string().max(100).optional(),
  notes: z.string().optional(),
});
