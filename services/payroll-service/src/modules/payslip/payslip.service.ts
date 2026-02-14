import * as payslipRepo from './payslip.repository';
import { PayslipRecord, GeneratePayslipDto } from './payslip.types';
import { NotFoundError } from '../../utils/errors';

export const getMyPayslips = async (
  employeeId: string,
  companyId: string
): Promise<PayslipRecord[]> => {
  return payslipRepo.findByEmployee(employeeId, companyId);
};

export const getDetail = async (
  id: string,
  companyId: string
): Promise<PayslipRecord> => {
  const payslip = await payslipRepo.findById(id, companyId);
  if (!payslip) {
    throw new NotFoundError('Payslip');
  }
  return payslip;
};

export const generate = async (
  data: GeneratePayslipDto,
  companyId: string
): Promise<PayslipRecord> => {
  return payslipRepo.create(data, companyId);
};

export const listAll = async (
  companyId: string,
  filters?: { employeeId?: string; status?: string }
): Promise<PayslipRecord[]> => {
  return payslipRepo.findAll(companyId, filters);
};
