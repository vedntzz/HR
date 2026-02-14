import { EmployeeRepository } from './employee.repository';
import {
  EmployeeRecord,
  CreateEmployeeDto,
  UpdateEmployeeDto,
  PaginationParams,
  EmployeeFilters,
  PaginatedResult,
  OrgChartNode,
} from './employee.types';
import {
  NotFoundError,
  ConflictError,
  ValidationError,
} from '../../middleware/errorHandler';

export class EmployeeService {
  constructor(private readonly repository: EmployeeRepository) {}

  async list(
    companyId: string,
    pagination: PaginationParams,
    filters: EmployeeFilters
  ): Promise<PaginatedResult<EmployeeRecord>> {
    return this.repository.findAll(companyId, pagination, filters);
  }

  async getById(id: string, companyId: string): Promise<EmployeeRecord> {
    const employee = await this.repository.findById(id, companyId);
    if (!employee) {
      throw new NotFoundError('Employee', id);
    }
    return employee;
  }

  async create(
    data: CreateEmployeeDto,
    userId: string
  ): Promise<EmployeeRecord> {
    const existing = await this.repository.findByEmail(
      data.email,
      data.companyId
    );
    if (existing) {
      throw new ConflictError(
        `Employee with email '${data.email}' already exists in this company`
      );
    }

    if (data.managerId) {
      await this.validateManagerExists(data.managerId, data.companyId);
    }

    return this.repository.create(data, userId);
  }

  async update(
    id: string,
    companyId: string,
    data: UpdateEmployeeDto
  ): Promise<EmployeeRecord> {
    const existing = await this.repository.findById(id, companyId);
    if (!existing) {
      throw new NotFoundError('Employee', id);
    }

    if (data.email && data.email !== existing.email) {
      await this.validateEmailUnique(data.email, companyId, id);
    }

    if (data.managerId !== undefined && data.managerId !== null) {
      this.validateNotSelfManaged(id, data.managerId);
      await this.validateManagerExists(data.managerId, companyId);
    }

    const updated = await this.repository.update(id, companyId, data);
    if (!updated) {
      throw new NotFoundError('Employee', id);
    }
    return updated;
  }

  async getTeam(
    managerId: string,
    companyId: string
  ): Promise<EmployeeRecord[]> {
    return this.repository.getTeamMembers(managerId, companyId);
  }

  async getOrgChart(companyId: string): Promise<OrgChartNode[]> {
    const employees = await this.repository.getOrgChart(companyId);
    return this.buildOrgTree(employees);
  }

  private async validateManagerExists(
    managerId: string,
    companyId: string
  ): Promise<void> {
    const manager = await this.repository.findById(managerId, companyId);
    if (!manager) {
      throw new ValidationError(
        `Manager with id '${managerId}' not found in this company`
      );
    }
    if (!manager.isActive) {
      throw new ValidationError('Cannot assign an inactive employee as manager');
    }
  }

  private async validateEmailUnique(
    email: string,
    companyId: string,
    excludeId: string
  ): Promise<void> {
    const existing = await this.repository.findByEmail(email, companyId);
    if (existing && existing.id !== excludeId) {
      throw new ConflictError(
        `Employee with email '${email}' already exists in this company`
      );
    }
  }

  private validateNotSelfManaged(employeeId: string, managerId: string): void {
    if (employeeId === managerId) {
      throw new ValidationError('An employee cannot be their own manager');
    }
  }

  private buildOrgTree(employees: EmployeeRecord[]): OrgChartNode[] {
    const nodeMap = new Map<string, OrgChartNode>();

    for (const emp of employees) {
      nodeMap.set(emp.id, {
        id: emp.id,
        firstName: emp.firstName,
        lastName: emp.lastName,
        position: emp.position,
        departmentId: emp.departmentId,
        managerId: emp.managerId,
        directReports: [],
      });
    }

    const roots: OrgChartNode[] = [];
    for (const node of nodeMap.values()) {
      if (node.managerId && nodeMap.has(node.managerId)) {
        nodeMap.get(node.managerId)!.directReports.push(node);
      } else {
        roots.push(node);
      }
    }

    return roots;
  }
}
