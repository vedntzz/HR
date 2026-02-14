import * as onboardingRepo from './onboarding.repository';
import {
  OnboardingChecklist,
  CreateOnboardingDto,
  UpdateOnboardingDto,
} from './onboarding.types';
import { NotFoundError } from '../../utils/errors';

export const listAll = async (
  companyId: string
): Promise<OnboardingChecklist[]> => {
  return onboardingRepo.findAll(companyId);
};

export const listByCandidate = async (
  candidateId: string,
  companyId: string
): Promise<OnboardingChecklist[]> => {
  return onboardingRepo.findByCandidate(candidateId, companyId);
};

export const getById = async (
  id: string,
  companyId: string
): Promise<OnboardingChecklist> => {
  const checklist = await onboardingRepo.findById(id, companyId);
  if (!checklist) {
    throw new NotFoundError('Onboarding checklist');
  }
  return checklist;
};

export const create = async (
  data: CreateOnboardingDto,
  companyId: string
): Promise<OnboardingChecklist> => {
  return onboardingRepo.create(data, companyId);
};

export const update = async (
  id: string,
  companyId: string,
  data: UpdateOnboardingDto
): Promise<OnboardingChecklist> => {
  const updated = await onboardingRepo.update(id, companyId, data);
  if (!updated) {
    throw new NotFoundError('Onboarding checklist');
  }
  return updated;
};
