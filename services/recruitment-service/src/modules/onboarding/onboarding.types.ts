export interface ChecklistItem {
  label: string;
  completed: boolean;
  completedAt?: Date;
}

export interface OnboardingChecklist {
  id: string;
  candidateId: string;
  companyId: string;
  employeeId: string | null;
  title: string;
  items: ChecklistItem[];
  isCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateOnboardingDto {
  candidateId: string;
  employeeId?: string;
  title: string;
  items: { label: string; completed?: boolean }[];
}

export interface UpdateOnboardingDto {
  title?: string;
  employeeId?: string;
  items?: ChecklistItem[];
  isCompleted?: boolean;
}
