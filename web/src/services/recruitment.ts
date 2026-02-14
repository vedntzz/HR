import { apiGet, apiPost, apiPut } from '@/lib/api';

export interface Candidate {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  positionApplied: string;
  resumeUrl?: string;
  stage: 'applied' | 'screening' | 'interview' | 'offer' | 'hired' | 'rejected';
  source?: string;
  notes?: string;
  createdAt: string;
}

export interface InterviewFeedback {
  id: string;
  candidateId: string;
  interviewerId: string;
  rating: number;
  strengths: string[];
  cultureFit: number;
  technicalScore: number;
  communicationScore: number;
  recommendation: 'strong_yes' | 'yes' | 'neutral' | 'no' | 'strong_no';
  decisionSummary: string;
  notes?: string;
  interviewDate: string;
}

export interface PipelineCounts {
  applied: number;
  screening: number;
  interview: number;
  offer: number;
  hired: number;
  rejected: number;
}

export async function getCandidates(
  filters?: Record<string, string>
): Promise<Candidate[]> {
  const params = filters ? `?${new URLSearchParams(filters)}` : '';
  return apiGet(`/api/recruitment/candidates${params}`);
}

export async function getCandidate(id: string): Promise<Candidate> {
  return apiGet(`/api/recruitment/candidates/${id}`);
}

export async function getPipeline(): Promise<PipelineCounts> {
  return apiGet('/api/recruitment/candidates/pipeline');
}

export async function createCandidate(
  data: Partial<Candidate>
): Promise<Candidate> {
  return apiPost('/api/recruitment/candidates', data);
}

export async function updateStage(
  id: string,
  stage: string
): Promise<Candidate> {
  return apiPut(`/api/recruitment/candidates/${id}/stage`, { stage });
}

export async function getFeedback(
  candidateId: string
): Promise<InterviewFeedback[]> {
  return apiGet(`/api/recruitment/interviews/candidate/${candidateId}`);
}

export async function addFeedback(
  candidateId: string,
  data: Partial<InterviewFeedback>
): Promise<InterviewFeedback> {
  return apiPost(`/api/recruitment/interviews/candidate/${candidateId}`, data);
}
