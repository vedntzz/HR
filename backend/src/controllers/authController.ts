import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../config/database';
import { generateToken } from '../utils/jwt';
import { sendSuccess, sendError } from '../utils/response';

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        employee: {
          include: {
            department: true,
          },
        },
      },
    });

    if (!user || !user.isActive) {
      return sendError(res, 'Invalid credentials', 401);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return sendError(res, 'Invalid credentials', 401);
    }

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      companyId: user.companyId,
    });

    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    const { password: _, ...userWithoutPassword } = user;

    sendSuccess(res, { user: userWithoutPassword, token }, 'Login successful');
  } catch (error) {
    console.error('Login error:', error);
    sendError(res, 'Login failed', 500);
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, firstName, lastName, departmentId, designation } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return sendError(res, 'User already exists', 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const company = await prisma.company.findFirst();
    if (!company) {
      return sendError(res, 'Company not found', 404);
    }

    const employeeCount = await prisma.employee.count({
      where: { companyId: company.id },
    });
    const employeeCode = `STF-${new Date().getFullYear()}-${String(employeeCount + 1).padStart(3, '0')}`;

    const employee = await prisma.employee.create({
      data: {
        firstName,
        lastName,
        email,
        employeeCode,
        designation,
        departmentId,
        joiningDate: new Date(),
        companyId: company.id,
      },
    });

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: 'EMPLOYEE',
        companyId: company.id,
        employeeId: employee.id,
      },
    });

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      companyId: user.companyId,
    });

    const { password: _, ...userWithoutPassword } = user;

    sendSuccess(res, { user: userWithoutPassword, token }, 'Registration successful', 201);
  } catch (error) {
    console.error('Registration error:', error);
    sendError(res, 'Registration failed', 500);
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
      include: {
        employee: {
          include: {
            department: true,
          },
        },
      },
    });

    if (!user) {
      return sendError(res, 'User not found', 404);
    }

    const { password: _, ...userWithoutPassword } = user;

    sendSuccess(res, userWithoutPassword, 'Profile retrieved successfully');
  } catch (error) {
    console.error('Get profile error:', error);
    sendError(res, 'Failed to get profile', 500);
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const { phone, address, city, state, zipCode, country } = req.body;

    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
    });

    if (!user || !user.employeeId) {
      return sendError(res, 'Employee not found', 404);
    }

    const updatedEmployee = await prisma.employee.update({
      where: { id: user.employeeId },
      data: { phone, address, city, state, zipCode, country },
      include: { department: true },
    });

    sendSuccess(res, updatedEmployee, 'Profile updated successfully');
  } catch (error) {
    console.error('Update profile error:', error);
    sendError(res, 'Failed to update profile', 500);
  }
};

export const changePassword = async (req: Request, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
    });

    if (!user) {
      return sendError(res, 'User not found', 404);
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

    if (!isPasswordValid) {
      return sendError(res, 'Current password is incorrect', 400);
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    sendSuccess(res, null, 'Password changed successfully');
  } catch (error) {
    console.error('Change password error:', error);
    sendError(res, 'Failed to change password', 500);
  }
};
