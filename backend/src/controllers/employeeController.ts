import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../config/database';
import { sendSuccess, sendError } from '../utils/response';

export const getAllEmployees = async (req: Request, res: Response) => {
  try {
    const { department, search, isActive } = req.query;

    const where: any = {
      companyId: req.user!.companyId,
    };

    if (department) {
      where.departmentId = department;
    }

    if (search) {
      where.OR = [
        { firstName: { contains: search as string, mode: 'insensitive' } },
        { lastName: { contains: search as string, mode: 'insensitive' } },
        { email: { contains: search as string, mode: 'insensitive' } },
        { employeeCode: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    if (isActive !== undefined) {
      where.isActive = isActive === 'true';
    }

    const employees = await prisma.employee.findMany({
      where,
      include: {
        department: true,
        user: {
          select: {
            id: true,
            email: true,
            role: true,
            isActive: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    sendSuccess(res, employees, 'Employees retrieved successfully');
  } catch (error) {
    console.error('Get employees error:', error);
    sendError(res, 'Failed to get employees', 500);
  }
};

export const getEmployeeById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const employee = await prisma.employee.findUnique({
      where: { id },
      include: {
        department: true,
        user: {
          select: {
            id: true,
            email: true,
            role: true,
            isActive: true,
            lastLogin: true,
          },
        },
      },
    });

    if (!employee) {
      return sendError(res, 'Employee not found', 404);
    }

    if (employee.companyId !== req.user!.companyId) {
      return sendError(res, 'Unauthorized access', 403);
    }

    sendSuccess(res, employee, 'Employee retrieved successfully');
  } catch (error) {
    console.error('Get employee error:', error);
    sendError(res, 'Failed to get employee', 500);
  }
};

export const createEmployee = async (req: Request, res: Response) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      dateOfBirth,
      gender,
      address,
      city,
      state,
      zipCode,
      designation,
      departmentId,
      joiningDate,
      salary,
      role,
    } = req.body;

    const existingEmployee = await prisma.employee.findFirst({
      where: { email },
    });

    if (existingEmployee) {
      return sendError(res, 'Employee with this email already exists', 400);
    }

    const employeeCount = await prisma.employee.count({
      where: { companyId: req.user!.companyId },
    });
    const employeeCode = `STF-${new Date().getFullYear()}-${String(employeeCount + 1).padStart(3, '0')}`;

    const employee = await prisma.employee.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        gender,
        address,
        city,
        state,
        zipCode,
        employeeCode,
        designation,
        departmentId,
        joiningDate: new Date(joiningDate),
        salary: salary ? parseFloat(salary) : null,
        companyId: req.user!.companyId,
      },
      include: {
        department: true,
      },
    });

    const defaultPassword = 'Welcome@123';
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: role || 'EMPLOYEE',
        companyId: req.user!.companyId,
        employeeId: employee.id,
      },
    });

    sendSuccess(res, employee, 'Employee created successfully', 201);
  } catch (error) {
    console.error('Create employee error:', error);
    sendError(res, 'Failed to create employee', 500);
  }
};

export const updateEmployee = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const employee = await prisma.employee.findUnique({
      where: { id },
    });

    if (!employee) {
      return sendError(res, 'Employee not found', 404);
    }

    if (employee.companyId !== req.user!.companyId) {
      return sendError(res, 'Unauthorized access', 403);
    }

    if (updateData.salary) {
      updateData.salary = parseFloat(updateData.salary);
    }

    if (updateData.dateOfBirth) {
      updateData.dateOfBirth = new Date(updateData.dateOfBirth);
    }

    if (updateData.joiningDate) {
      updateData.joiningDate = new Date(updateData.joiningDate);
    }

    const updatedEmployee = await prisma.employee.update({
      where: { id },
      data: updateData,
      include: {
        department: true,
      },
    });

    sendSuccess(res, updatedEmployee, 'Employee updated successfully');
  } catch (error) {
    console.error('Update employee error:', error);
    sendError(res, 'Failed to update employee', 500);
  }
};

export const deleteEmployee = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const employee = await prisma.employee.findUnique({
      where: { id },
    });

    if (!employee) {
      return sendError(res, 'Employee not found', 404);
    }

    if (employee.companyId !== req.user!.companyId) {
      return sendError(res, 'Unauthorized access', 403);
    }

    await prisma.employee.update({
      where: { id },
      data: { isActive: false },
    });

    await prisma.user.updateMany({
      where: { employeeId: id },
      data: { isActive: false },
    });

    sendSuccess(res, null, 'Employee deactivated successfully');
  } catch (error) {
    console.error('Delete employee error:', error);
    sendError(res, 'Failed to deactivate employee', 500);
  }
};

export const getDepartments = async (req: Request, res: Response) => {
  try {
    const departments = await prisma.department.findMany({
      where: {
        companyId: req.user!.companyId,
        isActive: true,
      },
      include: {
        _count: {
          select: {
            employees: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    });

    sendSuccess(res, departments, 'Departments retrieved successfully');
  } catch (error) {
    console.error('Get departments error:', error);
    sendError(res, 'Failed to get departments', 500);
  }
};
