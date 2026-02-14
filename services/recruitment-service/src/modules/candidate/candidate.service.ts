import * as candidateRepo from './candidate.repository';
import {
  CandidateRecord,
  CreateCandidateDto,
  UpdateCandidateDto,
} from './candidate.types';
import { NotFoundError } from '../../utils/errors';

export const listAll = async (
  companyId: string,
  filters?: { stage?: string }
): Promise<CandidateRecord[]> => {
  return candidateRepo.findAll(companyId, filters);
};

export const getById = async (
  id: string,
  companyId: string
): Promise<CandidateRecord> => {
  const candidate = await candidateRepo.findById(id, companyId);
  if (!candidate) {
    throw new NotFoundError('Candidate');
  }
  return candidate;
};

export const create = async (
  data: CreateCandidateDto,
  companyId: string
): Promise<CandidateRecord> => {
  return candidateRepo.create(data, companyId);
};

export const update = async (
  id: string,
  companyId: string,
  data: UpdateCandidateDto
): Promise<CandidateRecord> => {
  const updated = await candidateRepo.update(id, companyId, data);
  if (!updated) {
    throw new NotFoundError('Candidate');
  }
  return updated;
};
