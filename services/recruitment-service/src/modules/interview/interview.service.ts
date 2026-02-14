import * as interviewRepo from './interview.repository';
import {
  InterviewFeedback,
  CreateInterviewFeedbackDto,
  UpdateInterviewFeedbackDto,
} from './interview.types';
import { NotFoundError } from '../../utils/errors';

export const listByCandidate = async (
  candidateId: string,
  companyId: string
): Promise<InterviewFeedback[]> => {
  return interviewRepo.findByCandidate(candidateId, companyId);
};

export const getById = async (
  id: string,
  companyId: string
): Promise<InterviewFeedback> => {
  const feedback = await interviewRepo.findById(id, companyId);
  if (!feedback) {
    throw new NotFoundError('Interview feedback');
  }
  return feedback;
};

export const listAll = async (
  companyId: string
): Promise<InterviewFeedback[]> => {
  return interviewRepo.findAll(companyId);
};

export const create = async (
  data: CreateInterviewFeedbackDto,
  interviewerId: string,
  companyId: string
): Promise<InterviewFeedback> => {
  return interviewRepo.create(data, interviewerId, companyId);
};

export const update = async (
  id: string,
  companyId: string,
  data: UpdateInterviewFeedbackDto
): Promise<InterviewFeedback> => {
  const updated = await interviewRepo.update(id, companyId, data);
  if (!updated) {
    throw new NotFoundError('Interview feedback');
  }
  return updated;
};
