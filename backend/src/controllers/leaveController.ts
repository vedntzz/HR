import { Request, Response } from 'express';
import prisma from '../config/database';
import { sendSuccess, sendError } from '../utils/response';

export const createLeaveRequest = async (req: Request, res: Response) => {
  try {
    const { leaveType, startDate, endDate, reason } = req.body;

    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
    });

    if (!user || !user.employeeId) {
      return sendError(res, 'Employee not found', 404);
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    if (days <= 0) {
      return sendError(res, 'Invalid date range', 400);
    }

    const leaveRequest = await prisma.leaveRequest.create({
      data: {
        employeeId: user.employeeId,
        leaveType,
        startDate: start,
        endDate: end,
        days,
        reason,
      },
      include: {
        employee: {
          include: {
            department: true,
          },
        },
      },
    });

    sendSuccess(res, leaveRequest, 'Leave request created successfully', 201);
  } catch (error) {
    console.error('Create leave request error:', error);
    sendError(res, 'Failed to create leave request', 500);
  }
};

export const getMyLeaveRequests = async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
    });

    if (!user || !user.employeeId) {
      return sendError(res, 'Employee not found', 404);
    }

    const leaveRequests = await prisma.leaveRequest.findMany({
      where: { employeeId: user.employeeId },
      orderBy: { createdAt: 'desc' },
      include: {
        employee: {
          select: {
            firstName: true,
            lastName: true,
            employeeCode: true,
          },
        },
      },
    });

    sendSuccess(res, leaveRequests, 'Leave requests retrieved successfully');
  } catch (error) {
    console.error('Get leave requests error:', error);
    sendError(res, 'Failed to get leave requests', 500);
  }
};

export const getLeaveBalance = async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
    });

    if (!user || !user.employeeId) {
      return sendError(res, 'Employee not found', 404);
    }

    const policies = await prisma.leavePolicy.findMany({
      where: { companyId: user.companyId, isActive: true },
    });

    const currentYear = new Date().getFullYear();

    const leaveBalance = await Promise.all(
      policies.map(async (policy) => {
        const usedLeaves = await prisma.leaveRequest.aggregate({
          where: {
            employeeId: user.employeeId!,
            leaveType: policy.leaveType,
            status: { in: ['APPROVED', 'PENDING'] },
            startDate: {
              gte: new Date(`${currentYear}-01-01`),
              lte: new Date(`${currentYear}-12-31`),
            },
          },
          _sum: {
            days: true,
          },
        });

        const used = usedLeaves._sum.days || 0;
        const available = Math.max(policy.daysAllowed - used, 0);

        return {
          leaveType: policy.leaveType,
          name: policy.name,
          total: policy.daysAllowed,
          used,
          available,
        };
      })
    );

    sendSuccess(res, leaveBalance, 'Leave balance retrieved successfully');
  } catch (error) {
    console.error('Get leave balance error:', error);
    sendError(res, 'Failed to get leave balance', 500);
  }
};

export const getAllLeaveRequests = async (req: Request, res: Response) => {
  try {
    const { status, department } = req.query;

    const where: any = {
      employee: {
        companyId: req.user!.companyId,
      },
    };

    if (status) {
      where.status = status;
    }

    if (department) {
      where.employee.departmentId = department;
    }

    const leaveRequests = await prisma.leaveRequest.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        employee: {
          include: {
            department: true,
          },
        },
      },
    });

    sendSuccess(res, leaveRequests, 'Leave requests retrieved successfully');
  } catch (error) {
    console.error('Get all leave requests error:', error);
    sendError(res, 'Failed to get leave requests', 500);
  }
};

export const updateLeaveStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, comments } = req.body;

    const leaveRequest = await prisma.leaveRequest.findUnique({
      where: { id },
    });

    if (!leaveRequest) {
      return sendError(res, 'Leave request not found', 404);
    }

    const updatedLeaveRequest = await prisma.leaveRequest.update({
      where: { id },
      data: {
        status,
        comments,
        reviewedBy: req.user!.userId,
        reviewedAt: new Date(),
      },
      include: {
        employee: {
          include: {
            department: true,
          },
        },
      },
    });

    sendSuccess(res, updatedLeaveRequest, 'Leave request updated successfully');
  } catch (error) {
    console.error('Update leave status error:', error);
    sendError(res, 'Failed to update leave request', 500);
  }
};

export const deleteLeaveRequest = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const leaveRequest = await prisma.leaveRequest.findUnique({
      where: { id },
    });

    if (!leaveRequest) {
      return sendError(res, 'Leave request not found', 404);
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
    });

    if (leaveRequest.employeeId !== user?.employeeId && req.user!.role !== 'ADMIN') {
      return sendError(res, 'Unauthorized to delete this request', 403);
    }

    if (leaveRequest.status !== 'PENDING') {
      return sendError(res, 'Cannot delete non-pending leave request', 400);
    }

    await prisma.leaveRequest.delete({
      where: { id },
    });

    sendSuccess(res, null, 'Leave request deleted successfully');
  } catch (error) {
    console.error('Delete leave request error:', error);
    sendError(res, 'Failed to delete leave request', 500);
  }
};
