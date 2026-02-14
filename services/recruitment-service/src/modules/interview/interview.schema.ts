import { z } from 'zod';

const recommendations = [
  'strong_yes',
  'yes',
  'neutral',
  'no',
  'strong_no',
] as const;

const scoreField = z.number().int().min(1).max(5);

export const createInterviewFeedbackSchema = z.object({
  candidateId: z.string().uuid('Candidate ID must be a valid UUID'),
  rating: scoreField,
  strengths: z.array(z.string()).optional().default([]),
  cultureFit: scoreField,
  technicalScore: scoreField,
  communicationScore: scoreField,
  recommendation: z.enum(recommendations),
  decisionSummary: z.string().optional(),
  notes: z.string().optional(),
  interviewDate: z.string().datetime('Interview date must be ISO 8601'),
});

export const updateInterviewFeedbackSchema = z.object({
  rating: scoreField.optional(),
  strengths: z.array(z.string()).optional(),
  cultureFit: scoreField.optional(),
  technicalScore: scoreField.optional(),
  communicationScore: scoreField.optional(),
  recommendation: z.enum(recommendations).optional(),
  decisionSummary: z.string().optional(),
  notes: z.string().optional(),
});
