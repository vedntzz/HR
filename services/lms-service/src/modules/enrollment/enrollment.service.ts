import { EnrollmentRepository } from './enrollment.repository';
import { EnrollmentRecord, UpdateProgressDto } from './enrollment.types';

export class EnrollmentService {
  constructor(private repo: EnrollmentRepository) {}

  async findByEmployee(employeeId: string, companyId: string): Promise<EnrollmentRecord[]> {
    return this.repo.findByEmployee(employeeId, companyId);
  }

  async findByCourse(courseId: string, companyId: string): Promise<EnrollmentRecord[]> {
    return this.repo.findByCourse(courseId, companyId);
  }

  async assign(
    courseId: string,
    employeeIds: string[],
    companyId: string,
  ): Promise<EnrollmentRecord[]> {
    return this.repo.assign(courseId, employeeIds, companyId);
  }

  async updateProgress(
    id: string,
    companyId: string,
    data: UpdateProgressDto,
  ): Promise<EnrollmentRecord | null> {
    return this.repo.updateProgress(id, companyId, data);
  }
}
