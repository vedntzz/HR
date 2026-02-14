export interface DepartmentRecord {
  id: string;
  name: string;
  description: string | null;
  companyId: string;
  headId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateDepartmentDto {
  name: string;
  description?: string;
  headId?: string;
}

export interface UpdateDepartmentDto {
  name?: string;
  description?: string;
  headId?: string;
}
