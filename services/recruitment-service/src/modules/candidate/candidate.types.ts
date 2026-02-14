export interface CandidateRecord {
  id: string;
  companyId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  positionApplied: string;
  resumeUrl: string | null;
  stage:
    | 'applied'
    | 'screening'
    | 'interview'
    | 'offer'
    | 'hired'
    | 'rejected';
  source: string | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCandidateDto {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  positionApplied: string;
  resumeUrl?: string;
  source?: string;
  notes?: string;
}

export interface UpdateCandidateDto {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  positionApplied?: string;
  resumeUrl?: string;
  stage?: CandidateRecord['stage'];
  source?: string;
  notes?: string;
}
