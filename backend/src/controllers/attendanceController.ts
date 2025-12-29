import { Request, Response } from 'express';
import prisma from '../config/database';
import { sendSuccess, sendError } from '../utils/response';

export const checkIn = async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
    });

    if (!user || !user.employeeId) {
      return sendError(res, 'Employee not found', 404);
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existingAttendance = await prisma.attendance.findUnique({
      where: {
        employeeId_date: {
          employeeId: user.employeeId,
          date: today,
        },
      },
    });

    if (existingAttendance && existingAttendance.checkIn) {
      return sendError(res, 'Already checked in for today', 400);
    }

    const attendance = await prisma.attendance.upsert({
      where: {
        employeeId_date: {
          employeeId: user.employeeId,
          date: today,
        },
      },
      update: {
        checkIn: new Date(),
        status: 'PRESENT',
      },
      create: {
        employeeId: user.employeeId,
        date: today,
        checkIn: new Date(),
        status: 'PRESENT',
      },
    });

    sendSuccess(res, attendance, 'Checked in successfully');
  } catch (error) {
    console.error('Check-in error:', error);
    sendError(res, 'Failed to check in', 500);
  }
};

export const checkOut = async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
    });

    if (!user || !user.employeeId) {
      return sendError(res, 'Employee not found', 404);
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendance = await prisma.attendance.findUnique({
      where: {
        employeeId_date: {
          employeeId: user.employeeId,
          date: today,
        },
      },
    });

    if (!attendance || !attendance.checkIn) {
      return sendError(res, 'No check-in record found for today', 400);
    }

    if (attendance.checkOut) {
      return sendError(res, 'Already checked out for today', 400);
    }

    const checkOutTime = new Date();
    const workHours = (checkOutTime.getTime() - attendance.checkIn.getTime()) / (1000 * 60 * 60);

    const updatedAttendance = await prisma.attendance.update({
      where: {
        employeeId_date: {
          employeeId: user.employeeId,
          date: today,
        },
      },
      data: {
        checkOut: checkOutTime,
        workHours: Math.round(workHours * 100) / 100,
      },
    });

    sendSuccess(res, updatedAttendance, 'Checked out successfully');
  } catch (error) {
    console.error('Check-out error:', error);
    sendError(res, 'Failed to check out', 500);
  }
};

export const getMyAttendance = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;

    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
    });

    if (!user || !user.employeeId) {
      return sendError(res, 'Employee not found', 404);
    }

    const where: any = {
      employeeId: user.employeeId,
    };

    if (startDate && endDate) {
      where.date = {
        gte: new Date(startDate as string),
        lte: new Date(endDate as string),
      };
    }

    const attendance = await prisma.attendance.findMany({
      where,
      orderBy: { date: 'desc' },
      take: 30,
    });

    sendSuccess(res, attendance, 'Attendance records retrieved successfully');
  } catch (error) {
    console.error('Get attendance error:', error);
    sendError(res, 'Failed to get attendance records', 500);
  }
};

export const getAllAttendance = async (req: Request, res: Response) => {
  try {
    const { date, department } = req.query;

    const where: any = {
      employee: {
        companyId: req.user!.companyId,
      },
    };

    if (date) {
      const searchDate = new Date(date as string);
      searchDate.setHours(0, 0, 0, 0);
      where.date = searchDate;
    }

    if (department) {
      where.employee.departmentId = department;
    }

    const attendance = await prisma.attendance.findMany({
      where,
      orderBy: { date: 'desc' },
      include: {
        employee: {
          include: {
            department: true,
          },
        },
      },
      take: 100,
    });

    sendSuccess(res, attendance, 'Attendance records retrieved successfully');
  } catch (error) {
    console.error('Get all attendance error:', error);
    sendError(res, 'Failed to get attendance records', 500);
  }
};

export const getTodayStats = async (req: Request, res: Response) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const totalEmployees = await prisma.employee.count({
      where: {
        companyId: req.user!.companyId,
        isActive: true,
      },
    });

    const presentCount = await prisma.attendance.count({
      where: {
        date: today,
        status: 'PRESENT',
        employee: {
          companyId: req.user!.companyId,
        },
      },
    });

    const absentCount = totalEmployees - presentCount;
    const attendancePercentage = totalEmployees > 0 ? (presentCount / totalEmployees) * 100 : 0;

    sendSuccess(
      res,
      {
        total: totalEmployees,
        present: presentCount,
        absent: absentCount,
        percentage: Math.round(attendancePercentage * 100) / 100,
      },
      'Today\'s attendance stats retrieved successfully'
    );
  } catch (error) {
    console.error('Get today stats error:', error);
    sendError(res, 'Failed to get attendance stats', 500);
  }
};
