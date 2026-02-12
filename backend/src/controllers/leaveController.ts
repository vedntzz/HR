import { Request, Response } from 'express';
import { mockDatabase, findUserById, findEmployeeById, generateId, findDepartmentById } from '../data/mockData';
import { sendSuccess, sendError } from '../utils/response';

export const createLeaveRequest = async (req: Request, res: Response): Promise<void> => {
  try {
    const { leaveType, startDate, endDate, reason } = req.body;

    const user = findUserById(req.user!.userId);
    if (!user) {
      sendError(res, 'User not found', 404);
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    const newLeave = {
      id: generateId(),
      employeeId: user.employeeId,
      leaveType,
      startDate,
      endDate,
      days,
      reason,
      status: 'PENDING' as const,
      createdAt: new Date().toISOString(),
    };

    mockDatabase.leaveRequests.push(newLeave);

    const employee = findEmployeeById(user.employeeId);
    const department = employee ? findDepartmentById(employee.departmentId) : null;

    sendSuccess(
      res,
      { ...newLeave, employee: employee ? { ...employee, department } : null },
      'Leave request created successfully',
      201
    );
  } catch (error) {
    console.error('Create leave request error:', error);
    sendError(res, 'Failed to create leave request', 500);
  }
};

export const getMyLeaveRequests = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = findUserById(req.user!.userId);
    if (!user) {
      sendError(res, 'User not found', 404);
      return;
    }

    const leaves = mockDatabase.leaveRequests
      .filter((l) => l.employeeId === user.employeeId)
      .map((leave) => {
        const employee = findEmployeeById(leave.employeeId);
        return {
          ...leave,
          employee: employee
            ? {
                firstName: employee.firstName,
                lastName: employee.lastName,
                employeeCode: employee.employeeCode,
              }
            : null,
        };
      });

    sendSuccess(res, leaves, 'Leave requests retrieved successfully');
  } catch (error) {
    sendError(res, 'Failed to get leave requests', 500);
  }
};

export const getLeaveBalance = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = findUserById(req.user!.userId);
    if (!user) {
      sendError(res, 'User not found', 404);
      return;
    }

    const leaveBalance = mockDatabase.leavePolicies.map((policy) => {
      const usedLeaves = mockDatabase.leaveRequests
        .filter(
          (l) =>
            l.employeeId === user.employeeId &&
            l.leaveType === policy.leaveType &&
            (l.status === 'APPROVED' || l.status === 'PENDING')
        )
        .reduce((sum, l) => sum + l.days, 0);

      return {
        leaveType: policy.leaveType,
        name: policy.name,
        total: policy.total,
        used: usedLeaves,
        available: Math.max(policy.total - usedLeaves, 0),
      };
    });

    sendSuccess(res, leaveBalance, 'Leave balance retrieved successfully');
  } catch (error) {
    sendError(res, 'Failed to get leave balance', 500);
  }
};

export const getAllLeaveRequests = async (_req: Request, res: Response): Promise<void> => {
  try {
    const leaves = mockDatabase.leaveRequests.map((leave) => {
      const employee = findEmployeeById(leave.employeeId);
      const department = employee ? findDepartmentById(employee.departmentId) : null;
      return {
        ...leave,
        employee: employee ? { ...employee, department } : null,
      };
    });

    sendSuccess(res, leaves, 'Leave requests retrieved successfully');
  } catch (error) {
    sendError(res, 'Failed to get leave requests', 500);
  }
};

export const updateLeaveStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const leave = mockDatabase.leaveRequests.find((l) => l.id === id);
    if (!leave) {
      sendError(res, 'Leave request not found', 404);
      return;
    }

    leave.status = status;

    const employee = findEmployeeById(leave.employeeId);
    const department = employee ? findDepartmentById(employee.departmentId) : null;

    sendSuccess(
      res,
      { ...leave, employee: employee ? { ...employee, department } : null },
      'Leave request updated successfully'
    );
  } catch (error) {
    sendError(res, 'Failed to update leave request', 500);
  }
};

export const deleteLeaveRequest = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const index = mockDatabase.leaveRequests.findIndex((l) => l.id === id);
    if (index === -1) {
      sendError(res, 'Leave request not found', 404);
      return;
    }

    mockDatabase.leaveRequests.splice(index, 1);

    sendSuccess(res, null, 'Leave request deleted successfully');
  } catch (error) {
    sendError(res, 'Failed to delete leave request', 500);
  }
};
