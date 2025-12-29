import { Request, Response } from 'express';
import prisma from '../config/database';
import { sendSuccess, sendError } from '../utils/response';

export const getMyPayslips = async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
    });

    if (!user || !user.employeeId) {
      return sendError(res, 'Employee not found', 404);
    }

    const payslips = await prisma.payroll.findMany({
      where: {
        employeeId: user.employeeId,
        status: 'PAID',
      },
      orderBy: [{ year: 'desc' }, { month: 'desc' }],
      include: {
        employee: {
          select: {
            firstName: true,
            lastName: true,
            employeeCode: true,
            designation: true,
          },
        },
      },
    });

    sendSuccess(res, payslips, 'Payslips retrieved successfully');
  } catch (error) {
    console.error('Get payslips error:', error);
    sendError(res, 'Failed to get payslips', 500);
  }
};

export const getPayslipById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const payslip = await prisma.payroll.findUnique({
      where: { id },
      include: {
        employee: {
          include: {
            department: true,
          },
        },
      },
    });

    if (!payslip) {
      return sendError(res, 'Payslip not found', 404);
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
    });

    if (payslip.employeeId !== user?.employeeId && req.user!.role !== 'ADMIN') {
      return sendError(res, 'Unauthorized access', 403);
    }

    sendSuccess(res, payslip, 'Payslip retrieved successfully');
  } catch (error) {
    console.error('Get payslip error:', error);
    sendError(res, 'Failed to get payslip', 500);
  }
};

export const getAllPayrolls = async (req: Request, res: Response) => {
  try {
    const { month, year, status, department } = req.query;

    const where: any = {
      employee: {
        companyId: req.user!.companyId,
      },
    };

    if (month) {
      where.month = parseInt(month as string);
    }

    if (year) {
      where.year = parseInt(year as string);
    }

    if (status) {
      where.status = status;
    }

    if (department) {
      where.employee.departmentId = department;
    }

    const payrolls = await prisma.payroll.findMany({
      where,
      include: {
        employee: {
          include: {
            department: true,
          },
        },
      },
      orderBy: [{ year: 'desc' }, { month: 'desc' }],
    });

    sendSuccess(res, payrolls, 'Payrolls retrieved successfully');
  } catch (error) {
    console.error('Get payrolls error:', error);
    sendError(res, 'Failed to get payrolls', 500);
  }
};

export const generatePayroll = async (req: Request, res: Response) => {
  try {
    const { employeeId, month, year, allowances, deductions, tax } = req.body;

    const employee = await prisma.employee.findUnique({
      where: { id: employeeId },
    });

    if (!employee) {
      return sendError(res, 'Employee not found', 404);
    }

    if (employee.companyId !== req.user!.companyId) {
      return sendError(res, 'Unauthorized access', 403);
    }

    if (!employee.salary) {
      return sendError(res, 'Employee salary not configured', 400);
    }

    const existingPayroll = await prisma.payroll.findUnique({
      where: {
        employeeId_month_year: {
          employeeId,
          month: parseInt(month),
          year: parseInt(year),
        },
      },
    });

    if (existingPayroll) {
      return sendError(res, 'Payroll for this period already exists', 400);
    }

    const basicSalary = employee.salary;
    const totalAllowances = parseFloat(allowances) || 0;
    const totalDeductions = parseFloat(deductions) || 0;
    const totalTax = parseFloat(tax) || 0;
    const netSalary = basicSalary + totalAllowances - totalDeductions - totalTax;

    const payroll = await prisma.payroll.create({
      data: {
        employeeId,
        month: parseInt(month),
        year: parseInt(year),
        basicSalary,
        allowances: totalAllowances,
        deductions: totalDeductions,
        tax: totalTax,
        netSalary,
        status: 'DRAFT',
      },
      include: {
        employee: {
          include: {
            department: true,
          },
        },
      },
    });

    sendSuccess(res, payroll, 'Payroll generated successfully', 201);
  } catch (error) {
    console.error('Generate payroll error:', error);
    sendError(res, 'Failed to generate payroll', 500);
  }
};

export const processPayroll = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { paymentMethod, transactionId } = req.body;

    const payroll = await prisma.payroll.findUnique({
      where: { id },
    });

    if (!payroll) {
      return sendError(res, 'Payroll not found', 404);
    }

    const updatedPayroll = await prisma.payroll.update({
      where: { id },
      data: {
        status: 'PAID',
        paidDate: new Date(),
        paymentMethod,
        transactionId,
      },
      include: {
        employee: {
          include: {
            department: true,
          },
        },
      },
    });

    sendSuccess(res, updatedPayroll, 'Payroll processed successfully');
  } catch (error) {
    console.error('Process payroll error:', error);
    sendError(res, 'Failed to process payroll', 500);
  }
};
