export interface CourseRecord {
  id: string;
  companyId: string;
  title: string;
  description: string | null;
  contentUrl: string | null;
  durationMinutes: number;
  isMandatory: boolean;
  createdBy: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCourseDto {
  title: string;
  description?: string;
  contentUrl?: string;
  durationMinutes?: number;
  isMandatory?: boolean;
}

export interface UpdateCourseDto {
  title?: string;
  description?: string;
  contentUrl?: string;
  durationMinutes?: number;
  isMandatory?: boolean;
}
