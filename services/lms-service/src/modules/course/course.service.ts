import { CourseRepository } from './course.repository';
import { CourseRecord, CreateCourseDto, UpdateCourseDto } from './course.types';

export class CourseService {
  constructor(private repo: CourseRepository) {}

  async findAll(companyId: string): Promise<CourseRecord[]> {
    return this.repo.findAll(companyId);
  }

  async findById(id: string, companyId: string): Promise<CourseRecord | null> {
    return this.repo.findById(id, companyId);
  }

  async create(
    data: CreateCourseDto,
    companyId: string,
    createdBy: string,
  ): Promise<CourseRecord> {
    return this.repo.create(data, companyId, createdBy);
  }

  async update(
    id: string,
    companyId: string,
    data: UpdateCourseDto,
  ): Promise<CourseRecord | null> {
    return this.repo.update(id, companyId, data);
  }
}
