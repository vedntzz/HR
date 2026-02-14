export interface EmployeeRecord {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  departmentId: string | null;
  position: string | null;
  managerId: string | null;
  hireDate: string;
  companyId: string;
  avatarUrl: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateEmployeeDto {
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  position: string;
  phone?: string;
  managerId?: string;
  hireDate: string;
  companyId: string;
}

export interface UpdateEmployeeDto {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  departmentId?: string;
  position?: string;
  managerId?: string | null;
  hireDate?: string;
  avatarUrl?: string;
  isActive?: boolean;
}

export interface EmployeeFilters {
  departmentId?: string;
  isActive?: boolean;
  search?: string;
  managerId?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface OrgChartNode {
  id: string;
  firstName: string;
  lastName: string;
  position: string | null;
  departmentId: string | null;
  managerId: string | null;
  directReports: OrgChartNode[];
}
