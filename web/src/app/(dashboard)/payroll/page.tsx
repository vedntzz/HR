'use client';
import { useState } from 'react';
import { Card, Badge, Modal } from '@/components/ui';

const SALARY = {
  basic: 5000,
  housing: 1500,
  transport: 500,
  insurance: -300,
  tax: -850,
  retirement: -250,
};

const PAYSLIPS = [
  { id: '1', period: 'January 2025', amount: 5600, status: 'paid', date: 'Jan 31, 2025' },
  { id: '2', period: 'December 2024', amount: 5600, status: 'paid', date: 'Dec 31, 2024' },
  { id: '3', period: 'November 2024', amount: 5600, status: 'paid', date: 'Nov 30, 2024' },
  { id: '4', period: 'October 2024', amount: 5400, status: 'paid', date: 'Oct 31, 2024' },
];

export default function PayrollPage() {
  const [selectedPayslip, setSelectedPayslip] = useState<typeof PAYSLIPS[0] | null>(null);
  const net = SALARY.basic + SALARY.housing + SALARY.transport + SALARY.insurance + SALARY.tax + SALARY.retirement;

  return (
    <div className="space-y-6">
      {/* Salary Overview */}
      <Card title="Current Salary Breakdown">
        <div className="space-y-3">
          <SalaryRow label="Basic Salary" amount={SALARY.basic} type="earning" />
          <SalaryRow label="Housing Allowance" amount={SALARY.housing} type="earning" />
          <SalaryRow label="Transport Allowance" amount={SALARY.transport} type="earning" />
          <div className="border-t border-gray-100 my-2" />
          <SalaryRow label="Health Insurance" amount={SALARY.insurance} type="deduction" />
          <SalaryRow label="Income Tax" amount={SALARY.tax} type="deduction" />
          <SalaryRow label="Retirement Fund" amount={SALARY.retirement} type="deduction" />
          <div className="border-t-2 border-gray-200 my-2" />
          <div className="flex items-center justify-between py-1">
            <span className="text-base font-bold text-gray-900">Net Pay</span>
            <span className="text-xl font-bold text-gray-900">${net.toLocaleString()}</span>
          </div>
        </div>
      </Card>

      {/* Payslips */}
      <Card title="Payslip History">
        <div className="space-y-3">
          {PAYSLIPS.map((slip) => (
            <button
              key={slip.id}
              onClick={() => setSelectedPayslip(slip)}
              className="w-full flex items-center justify-between p-4 rounded-lg border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-all text-left"
            >
              <div>
                <p className="text-sm font-semibold text-gray-900">{slip.period}</p>
                <p className="text-xs text-gray-500">{slip.date}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-lg font-bold text-gray-900">${slip.amount.toLocaleString()}</span>
                <Badge variant="success">Paid</Badge>
              </div>
            </button>
          ))}
        </div>
      </Card>

      {/* Payslip Detail Modal */}
      <Modal isOpen={!!selectedPayslip} onClose={() => setSelectedPayslip(null)} title="Payslip Details" size="md">
        {selectedPayslip && (
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-500">Pay Period</span>
                <span className="text-sm font-medium">{selectedPayslip.period}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Payment Date</span>
                <span className="text-sm font-medium">{selectedPayslip.date}</span>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Earnings</h4>
              <SalaryRow label="Basic Salary" amount={SALARY.basic} type="earning" />
              <SalaryRow label="Housing Allowance" amount={SALARY.housing} type="earning" />
              <SalaryRow label="Transport Allowance" amount={SALARY.transport} type="earning" />
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Deductions</h4>
              <SalaryRow label="Health Insurance" amount={SALARY.insurance} type="deduction" />
              <SalaryRow label="Income Tax" amount={SALARY.tax} type="deduction" />
              <SalaryRow label="Retirement Fund" amount={SALARY.retirement} type="deduction" />
            </div>
            <div className="border-t-2 pt-3 flex justify-between">
              <span className="text-lg font-bold">Net Pay</span>
              <span className="text-lg font-bold text-emerald-600">${selectedPayslip.amount.toLocaleString()}</span>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

function SalaryRow({ label, amount, type }: { label: string; amount: number; type: 'earning' | 'deduction' }) {
  const isNeg = amount < 0;
  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-sm text-gray-600">{label}</span>
      <span className={`text-sm font-medium ${isNeg || type === 'deduction' ? 'text-red-600' : 'text-emerald-600'}`}>
        {isNeg ? '-' : '+'}${Math.abs(amount).toLocaleString()}
      </span>
    </div>
  );
}
