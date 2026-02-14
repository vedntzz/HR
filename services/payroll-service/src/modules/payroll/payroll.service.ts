import * as payrollRepo from './payroll.repository';
import { CreatePayrollDto, UpdatePayrollDto, PayrollPagination, PayrollRecord } from './payroll.types';
import { NotFoundError } from '../../utils/errors';

export const getEmployeePayroll = async (
  employeeId: string,
  companyId: string
): Promise<PayrollRecord[]> => {
  return payrollRepo.findByEmployee(employeeId, companyId);
};

export const listAll = async (
  companyId: string,
  pagination: PayrollPagination
): Promise<{ data: PayrollRecord[]; total: number }> => {
  return payrollRepo.findAll(companyId, pagination);
};

export const create = async (
  data: CreatePayrollDto,
  companyId: string
): Promise<PayrollRecord> => {
  return payrollRepo.create({ ...data, companyId });
};

export const update = async (
  id: string,
  companyId: string,
  data: UpdatePayrollDto
): Promise<PayrollRecord> => {
  const updated = await payrollRepo.update(id, companyId, data);
  if (!updated) {
    throw new NotFoundError('Payroll record');
  }
  return updated;
};
