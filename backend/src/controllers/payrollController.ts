import { Request, Response } from 'express';
import '../types/express';
import { findUserById } from '../data/mockData';
import { sendSuccess, sendError } from '../utils/response';

export const getMyPayslips = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = findUserById(req.user!.userId);
    if (!user) {
      sendError(res, 'User not found', 404);
      return;
    }

    // Mock payslip data
    const payslips = [
      {
        id: 'pay-1',
        month: 11,
        year: 2024,
        basicSalary: 75000,
        allowances: 5000,
        deductions: 2000,
        tax: 8000,
        netSalary: 70000,
        status: 'PAID',
        paidDate: '2024-11-30',
      },
    ];

    sendSuccess(res, payslips, 'Payslips retrieved successfully');
  } catch (error) {
    sendError(res, 'Failed to get payslips', 500);
  }
};

export const getPayslipById = async (_req: Request, res: Response): Promise<void> => {
  try {
    sendSuccess(res, {}, 'Payslip retrieved successfully');
  } catch (error) {
    sendError(res, 'Failed to get payslip', 500);
  }
};

export const getAllPayrolls = async (_req: Request, res: Response): Promise<void> => {
  try {
    sendSuccess(res, [], 'Payrolls retrieved successfully');
  } catch (error) {
    sendError(res, 'Failed to get payrolls', 500);
  }
};

export const generatePayroll = async (_req: Request, res: Response): Promise<void> => {
  try {
    sendError(res, 'Payroll generation disabled in demo mode', 400);
  } catch (error) {
    sendError(res, 'Failed to generate payroll', 500);
  }
};

export const processPayroll = async (_req: Request, res: Response): Promise<void> => {
  try {
    sendError(res, 'Payroll processing disabled in demo mode', 400);
  } catch (error) {
    sendError(res, 'Failed to process payroll', 500);
  }
};
