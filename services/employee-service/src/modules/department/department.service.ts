import { DepartmentRepository } from './department.repository';
import {
  DepartmentRecord,
  CreateDepartmentDto,
  UpdateDepartmentDto,
} from './department.types';
import { NotFoundError } from '../../middleware/errorHandler';

export class DepartmentService {
  constructor(private readonly repository: DepartmentRepository) {}

  async list(companyId: string): Promise<DepartmentRecord[]> {
    return this.repository.findAll(companyId);
  }

  async getById(
    id: string,
    companyId: string
  ): Promise<DepartmentRecord> {
    const department = await this.repository.findById(id, companyId);
    if (!department) {
      throw new NotFoundError('Department', id);
    }
    return department;
  }

  async create(
    data: CreateDepartmentDto,
    companyId: string
  ): Promise<DepartmentRecord> {
    return this.repository.create(data, companyId);
  }

  async update(
    id: string,
    companyId: string,
    data: UpdateDepartmentDto
  ): Promise<DepartmentRecord> {
    const existing = await this.repository.findById(id, companyId);
    if (!existing) {
      throw new NotFoundError('Department', id);
    }

    const updated = await this.repository.update(id, companyId, data);
    if (!updated) {
      throw new NotFoundError('Department', id);
    }
    return updated;
  }
}
