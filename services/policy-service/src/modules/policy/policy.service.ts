import { PolicyRepository } from './policy.repository';
import { PolicyRecord, PolicyAcknowledgement, CreatePolicyDto, UpdatePolicyDto } from './policy.types';

export class PolicyService {
  constructor(private repo: PolicyRepository) {}

  async findAll(companyId: string, employeeId?: string): Promise<any[]> {
    return this.repo.findAll(companyId, employeeId);
  }

  async findById(id: string, companyId: string): Promise<PolicyRecord | null> {
    return this.repo.findById(id, companyId);
  }

  async create(data: CreatePolicyDto, companyId: string, createdBy: string): Promise<PolicyRecord> {
    return this.repo.create(data, companyId, createdBy);
  }

  async update(id: string, companyId: string, data: UpdatePolicyDto): Promise<PolicyRecord | null> {
    return this.repo.update(id, companyId, data);
  }

  async acknowledge(
    policyId: string,
    employeeId: string,
    companyId: string,
  ): Promise<PolicyAcknowledgement> {
    return this.repo.acknowledge(policyId, employeeId, companyId);
  }

  async getAcknowledgements(
    policyId: string,
    companyId: string,
  ): Promise<PolicyAcknowledgement[]> {
    return this.repo.getAcknowledgements(policyId, companyId);
  }
}
