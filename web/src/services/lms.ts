import { apiGet, apiPost, apiPut } from '@/lib/api';

export interface Course {
  id: string;
  title: string;
  description: string;
  contentUrl?: string;
  durationMinutes: number;
  isMandatory: boolean;
  createdBy: string;
  createdAt: string;
}

export interface Enrollment {
  id: string;
  courseId: string;
  courseTitle?: string;
  courseDescription?: string;
  employeeId: string;
  status: 'not_started' | 'in_progress' | 'completed';
  progress: number;
  assignedAt: string;
  completedAt?: string;
}

export async function getCourses(): Promise<Course[]> {
  return apiGet('/api/lms/courses');
}

export async function getCourse(id: string): Promise<Course> {
  return apiGet(`/api/lms/courses/${id}`);
}

export async function getMyEnrollments(): Promise<Enrollment[]> {
  return apiGet('/api/lms/enrollments/me');
}

export async function updateProgress(
  enrollmentId: string,
  progress: number,
  status?: string
): Promise<Enrollment> {
  return apiPut(`/api/lms/enrollments/${enrollmentId}/progress`, {
    progress,
    status,
  });
}

export async function assignCourse(
  courseId: string,
  employeeIds: string[]
): Promise<void> {
  await apiPost('/api/lms/enrollments/assign', { courseId, employeeIds });
}
