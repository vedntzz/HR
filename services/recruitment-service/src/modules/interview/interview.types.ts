export interface InterviewFeedback {
  id: string;
  candidateId: string;
  companyId: string;
  interviewerId: string;
  rating: number;
  strengths: string[];
  cultureFit: number;
  technicalScore: number;
  communicationScore: number;
  recommendation:
    | 'strong_yes'
    | 'yes'
    | 'neutral'
    | 'no'
    | 'strong_no';
  decisionSummary: string | null;
  notes: string | null;
  interviewDate: Date;
  createdAt: Date;
}

export interface CreateInterviewFeedbackDto {
  candidateId: string;
  rating: number;
  strengths?: string[];
  cultureFit: number;
  technicalScore: number;
  communicationScore: number;
  recommendation: InterviewFeedback['recommendation'];
  decisionSummary?: string;
  notes?: string;
  interviewDate: string;
}

export interface UpdateInterviewFeedbackDto {
  rating?: number;
  strengths?: string[];
  cultureFit?: number;
  technicalScore?: number;
  communicationScore?: number;
  recommendation?: InterviewFeedback['recommendation'];
  decisionSummary?: string;
  notes?: string;
}
