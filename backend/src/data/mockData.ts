// Mock in-memory data store
export interface MockUser {
  id: string;
  email: string;
  password: string;
  role: 'ADMIN' | 'EMPLOYEE' | 'HR' | 'MANAGER';
  isActive: boolean;
  employeeId: string;
  companyId: string;
}

export interface MockEmployee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  employeeCode: string;
  designation: string;
  departmentId: string;
  joiningDate: string;
  salary?: number;
  isActive: boolean;
  companyId: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}

export interface MockDepartment {
  id: string;
  name: string;
  code: string;
  description?: string;
  companyId: string;
}

export interface MockLeaveRequest {
  id: string;
  employeeId: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
}

export interface MockAttendance {
  id: string;
  employeeId: string;
  date: string;
  checkIn?: string;
  checkOut?: string;
  status: 'PRESENT' | 'ABSENT';
  workHours?: number;
}

// Mock database
export const mockDatabase = {
  companies: [
    {
      id: 'company-1',
      name: 'Synergy Technofin',
      email: 'info@synergytechnofin.com',
    },
  ],

  departments: [
    {
      id: 'dept-1',
      name: 'Technology',
      code: 'TECH',
      description: 'Technology and IT services',
      companyId: 'company-1',
    },
    {
      id: 'dept-2',
      name: 'Finance',
      code: 'FIN',
      description: 'Financial services',
      companyId: 'company-1',
    },
    {
      id: 'dept-3',
      name: 'Agribusiness',
      code: 'AGR',
      description: 'Agricultural business operations',
      companyId: 'company-1',
    },
  ] as MockDepartment[],

  employees: [
    {
      id: 'emp-1',
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@synergytechnofin.com',
      employeeCode: 'STF-ADMIN-001',
      designation: 'System Administrator',
      departmentId: 'dept-1',
      joiningDate: new Date().toISOString(),
      salary: 100000,
      isActive: true,
      companyId: 'company-1',
    },
    {
      id: 'emp-2',
      firstName: 'Vedant',
      lastName: 'Ghodke',
      email: 'vedant.ghodke@synergytechnofin.com',
      employeeCode: 'STF-2024-001',
      designation: 'Software Engineer',
      departmentId: 'dept-1',
      joiningDate: '2024-01-15',
      salary: 75000,
      isActive: true,
      companyId: 'company-1',
    },
  ] as MockEmployee[],

  users: [
    {
      id: 'user-1',
      email: 'admin@synergytechnofin.com',
      password: '$2a$10$8ZqVZ1Q0Z1Q0Z1Q0Z1Q0ZeGxKZ9X8Z9X8Z9X8Z9X8Z9X8Z9X8Z9X8',
      role: 'ADMIN' as const,
      isActive: true,
      employeeId: 'emp-1',
      companyId: 'company-1',
    },
    {
      id: 'user-2',
      email: 'vedant.ghodke@synergytechnofin.com',
      password: '$2a$10$7YpWY0Y0Y0Y0Y0Y0Y0Y0YdFwJY8W7Y8W7Y8W7Y8W7Y8W7Y8W7Y8W7',
      role: 'EMPLOYEE' as const,
      isActive: true,
      employeeId: 'emp-2',
      companyId: 'company-1',
    },
  ] as MockUser[],

  leaveRequests: [
    {
      id: 'leave-1',
      employeeId: 'emp-2',
      leaveType: 'ANNUAL',
      startDate: '2024-12-25',
      endDate: '2024-12-27',
      days: 3,
      reason: 'Christmas vacation',
      status: 'PENDING' as const,
      createdAt: new Date().toISOString(),
    },
  ] as MockLeaveRequest[],

  attendance: [] as MockAttendance[],

  leavePolicies: [
    { leaveType: 'ANNUAL', name: 'Annual Leave', total: 24, companyId: 'company-1' },
    { leaveType: 'SICK', name: 'Sick Leave', total: 10, companyId: 'company-1' },
    { leaveType: 'EMERGENCY', name: 'Emergency Leave', total: 5, companyId: 'company-1' },
    { leaveType: 'COMP_OFF', name: 'Comp Off', total: 3, companyId: 'company-1' },
  ],
};

// Helper functions
export const findUserByEmail = (email: string) => {
  return mockDatabase.users.find((u) => u.email === email);
};

export const findUserById = (id: string) => {
  return mockDatabase.users.find((u) => u.id === id);
};

export const findEmployeeById = (id: string) => {
  return mockDatabase.employees.find((e) => e.id === id);
};

export const findDepartmentById = (id: string) => {
  return mockDatabase.departments.find((d) => d.id === id);
};

export const generateId = () => {
  return 'id-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
};
