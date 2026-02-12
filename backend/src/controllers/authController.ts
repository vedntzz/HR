import { Request, Response } from 'express';
import { findUserByEmail, findUserById, findEmployeeById, findDepartmentById } from '../data/mockData';
import { generateToken } from '../utils/jwt';
import { sendSuccess, sendError } from '../utils/response';

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = findUserByEmail(email);

    if (!user || !user.isActive) {
      sendError(res, 'Invalid credentials', 401);
      return;
    }

    // For demo: accept both hashed and plain passwords
    const isPasswordValid =
      password === 'admin123' && email === 'admin@synergytechnofin.com' ||
      password === 'employee123' && email === 'vedant.ghodke@synergytechnofin.com';

    if (!isPasswordValid) {
      sendError(res, 'Invalid credentials', 401);
      return;
    }

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      companyId: user.companyId,
    });

    const employee = findEmployeeById(user.employeeId);
    const department = employee ? findDepartmentById(employee.departmentId) : null;

    const userResponse = {
      ...user,
      password: undefined,
      employee: employee ? { ...employee, department } : null,
    };

    sendSuccess(res, { user: userResponse, token }, 'Login successful');
  } catch (error) {
    console.error('Login error:', error);
    sendError(res, 'Login failed', 500);
  }
};

export const register = async (_req: Request, res: Response): Promise<void> => {
  try {
    sendError(res, 'Registration disabled in demo mode', 400);
  } catch (error) {
    sendError(res, 'Registration failed', 500);
  }
};

export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = findUserById(req.user!.userId);

    if (!user) {
      sendError(res, 'User not found', 404);
      return;
    }

    const employee = findEmployeeById(user.employeeId);
    const department = employee ? findDepartmentById(employee.departmentId) : null;

    const userResponse = {
      ...user,
      password: undefined,
      employee: employee ? { ...employee, department } : null,
    };

    sendSuccess(res, userResponse, 'Profile retrieved successfully');
  } catch (error) {
    console.error('Get profile error:', error);
    sendError(res, 'Failed to get profile', 500);
  }
};

export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const { phone, address, city, state, zipCode, country } = req.body;

    const user = findUserById(req.user!.userId);
    if (!user) {
      sendError(res, 'User not found', 404);
      return;
    }

    const employee = findEmployeeById(user.employeeId);
    if (!employee) {
      sendError(res, 'Employee not found', 404);
      return;
    }

    // Update employee data
    Object.assign(employee, { phone, address, city, state, zipCode, country });

    const department = findDepartmentById(employee.departmentId);

    sendSuccess(res, { ...employee, department }, 'Profile updated successfully');
  } catch (error) {
    console.error('Update profile error:', error);
    sendError(res, 'Failed to update profile', 500);
  }
};

export const changePassword = async (_req: Request, res: Response): Promise<void> => {
  try {
    sendSuccess(res, null, 'Password changed successfully (demo mode)');
  } catch (error) {
    sendError(res, 'Failed to change password', 500);
  }
};
