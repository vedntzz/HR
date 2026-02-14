import { apiGet, apiPost } from '@/lib/api';

export interface Policy {
  id: string;
  title: string;
  content: string;
  category: 'hr' | 'it' | 'finance' | 'general' | 'compliance';
  version: string;
  isActive: boolean;
  createdBy: string;
  createdAt: string;
  acknowledged?: boolean;
  acknowledgedAt?: string;
}

export async function getPolicies(): Promise<Policy[]> {
  return apiGet('/api/policies/policies');
}

export async function getPolicy(id: string): Promise<Policy> {
  return apiGet(`/api/policies/policies/${id}`);
}

export async function acknowledgePolicy(id: string): Promise<void> {
  await apiPost(`/api/policies/policies/${id}/acknowledge`);
}

export async function createPolicy(data: Partial<Policy>): Promise<Policy> {
  return apiPost('/api/policies/policies', data);
}
