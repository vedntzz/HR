export interface PolicyRecord {
  id: string;
  companyId: string;
  title: string;
  content: string;
  category: string;
  version: string;
  isActive: boolean;
  createdBy: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface PolicyAcknowledgement {
  id: string;
  policyId: string;
  employeeId: string;
  companyId: string;
  acknowledgedAt: Date;
}

export interface CreatePolicyDto {
  title: string;
  content: string;
  category?: string;
  version?: string;
  isActive?: boolean;
}

export interface UpdatePolicyDto {
  title?: string;
  content?: string;
  category?: string;
  version?: string;
  isActive?: boolean;
}
