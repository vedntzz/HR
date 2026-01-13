import { Request, Response } from 'express';
import { mockDatabase, findUserById, generateId } from '../data/mockData';
import { sendSuccess, sendError } from '../utils/response';

export const checkIn = async (req: Request, res: Response) => {
  try {
    const user = findUserById(req.user!.userId);
    if (!user) {
      return sendError(res, 'User not found', 404);
    }

    const today = new Date().toISOString().split('T')[0];
    const existing = mockDatabase.attendance.find(
      (a) => a.employeeId === user.employeeId && a.date === today
    );

    if (existing && existing.checkIn) {
      return sendError(res, 'Already checked in for today', 400);
    }

    const attendance = {
      id: generateId(),
      employeeId: user.employeeId,
      date: today,
      checkIn: new Date().toISOString(),
      status: 'PRESENT' as const,
    };

    mockDatabase.attendance.push(attendance);

    sendSuccess(res, attendance, 'Checked in successfully');
  } catch (error) {
    sendError(res, 'Failed to check in', 500);
  }
};

export const checkOut = async (req: Request, res: Response) => {
  try {
    const user = findUserById(req.user!.userId);
    if (!user) {
      return sendError(res, 'User not found', 404);
    }

    const today = new Date().toISOString().split('T')[0];
    const attendance = mockDatabase.attendance.find(
      (a) => a.employeeId === user.employeeId && a.date === today
    );

    if (!attendance || !attendance.checkIn) {
      return sendError(res, 'No check-in record found for today', 400);
    }

    if (attendance.checkOut) {
      return sendError(res, 'Already checked out for today', 400);
    }

    attendance.checkOut = new Date().toISOString();
    const workHours =
      (new Date(attendance.checkOut).getTime() - new Date(attendance.checkIn).getTime()) /
      (1000 * 60 * 60);
    attendance.workHours = Math.round(workHours * 100) / 100;

    sendSuccess(res, attendance, 'Checked out successfully');
  } catch (error) {
    sendError(res, 'Failed to check out', 500);
  }
};

export const getMyAttendance = async (req: Request, res: Response) => {
  try {
    const user = findUserById(req.user!.userId);
    if (!user) {
      return sendError(res, 'User not found', 404);
    }

    const attendance = mockDatabase.attendance
      .filter((a) => a.employeeId === user.employeeId)
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 30);

    sendSuccess(res, attendance, 'Attendance records retrieved successfully');
  } catch (error) {
    sendError(res, 'Failed to get attendance records', 500);
  }
};

export const getAllAttendance = async (req: Request, res: Response) => {
  try {
    sendSuccess(res, mockDatabase.attendance, 'Attendance records retrieved successfully');
  } catch (error) {
    sendError(res, 'Failed to get attendance records', 500);
  }
};

export const getTodayStats = async (req: Request, res: Response) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const totalEmployees = mockDatabase.employees.filter((e) => e.isActive).length;
    const presentCount = mockDatabase.attendance.filter((a) => a.date === today && a.status === 'PRESENT').length;
    const percentage = totalEmployees > 0 ? (presentCount / totalEmployees) * 100 : 0;

    sendSuccess(
      res,
      {
        total: totalEmployees,
        present: presentCount,
        absent: totalEmployees - presentCount,
        percentage: Math.round(percentage * 100) / 100,
      },
      "Today's attendance stats retrieved successfully"
    );
  } catch (error) {
    sendError(res, 'Failed to get attendance stats', 500);
  }
};
