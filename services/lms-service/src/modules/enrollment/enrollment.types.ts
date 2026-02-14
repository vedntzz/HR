export interface EnrollmentRecord {
  id: string;
  courseId: string;
  employeeId: string;
  companyId: string;
  status: string;
  progress: number;
  assignedAt: Date;
  completedAt: Date | null;
}

export interface AssignEnrollmentDto {
  courseId: string;
  employeeIds: string[];
}

export interface UpdateProgressDto {
  status?: string;
  progress?: number;
}
