import { apiGet, apiPost, apiPut } from '@/lib/api';

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  department?: string;
  departmentId?: string;
  position?: string;
  managerId?: string;
  managerName?: string;
  hireDate?: string;
  isActive: boolean;
  avatarUrl?: string;
}

export async function getEmployees(
  filters?: Record<string, string>
): Promise<Employee[]> {
  const params = filters ? `?${new URLSearchParams(filters)}` : '';
  return apiGet(`/api/employees/employees${params}`);
}

export async function getEmployee(id: string): Promise<Employee> {
  return apiGet(`/api/employees/employees/${id}`);
}

export async function createEmployee(data: Partial<Employee>): Promise<Employee> {
  return apiPost('/api/employees/employees', data);
}

export async function updateEmployee(
  id: string,
  data: Partial<Employee>
): Promise<Employee> {
  return apiPut(`/api/employees/employees/${id}`, data);
}

export async function getMyTeam(): Promise<Employee[]> {
  return apiGet('/api/employees/employees/team/mine');
}

export async function getOrgChart(): Promise<unknown> {
  return apiGet('/api/employees/employees/org-chart');
}
