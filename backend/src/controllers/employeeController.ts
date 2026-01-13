import { Request, Response } from 'express';
import { mockDatabase, findDepartmentById } from '../data/mockData';
import { sendSuccess, sendError } from '../utils/response';

export const getAllEmployees = async (req: Request, res: Response) => {
  try {
    const employees = mockDatabase.employees.map((emp) => {
      const department = findDepartmentById(emp.departmentId);
      const user = mockDatabase.users.find((u) => u.employeeId === emp.id);
      return {
        ...emp,
        department,
        user: user
          ? {
              id: user.id,
              email: user.email,
              role: user.role,
              isActive: user.isActive,
            }
          : null,
      };
    });

    sendSuccess(res, employees, 'Employees retrieved successfully');
  } catch (error) {
    sendError(res, 'Failed to get employees', 500);
  }
};

export const getEmployeeById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const employee = mockDatabase.employees.find((e) => e.id === id);

    if (!employee) {
      return sendError(res, 'Employee not found', 404);
    }

    const department = findDepartmentById(employee.departmentId);
    const user = mockDatabase.users.find((u) => u.employeeId === id);

    sendSuccess(
      res,
      {
        ...employee,
        department,
        user: user
          ? {
              id: user.id,
              email: user.email,
              role: user.role,
              isActive: user.isActive,
            }
          : null,
      },
      'Employee retrieved successfully'
    );
  } catch (error) {
    sendError(res, 'Failed to get employee', 500);
  }
};

export const createEmployee = async (req: Request, res: Response) => {
  try {
    sendError(res, 'Employee creation disabled in demo mode', 400);
  } catch (error) {
    sendError(res, 'Failed to create employee', 500);
  }
};

export const updateEmployee = async (req: Request, res: Response) => {
  try {
    sendError(res, 'Employee update disabled in demo mode', 400);
  } catch (error) {
    sendError(res, 'Failed to update employee', 500);
  }
};

export const deleteEmployee = async (req: Request, res: Response) => {
  try {
    sendError(res, 'Employee deletion disabled in demo mode', 400);
  } catch (error) {
    sendError(res, 'Failed to delete employee', 500);
  }
};

export const getDepartments = async (req: Request, res: Response) => {
  try {
    const departments = mockDatabase.departments.map((dept) => ({
      ...dept,
      _count: {
        employees: mockDatabase.employees.filter((e) => e.departmentId === dept.id).length,
      },
    }));

    sendSuccess(res, departments, 'Departments retrieved successfully');
  } catch (error) {
    sendError(res, 'Failed to get departments', 500);
  }
};
