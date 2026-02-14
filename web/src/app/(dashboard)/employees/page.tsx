'use client';
import { useState } from 'react';
import { Card, Button, Badge, Input, Avatar, Modal } from '@/components/ui';

interface EmployeeItem {
  id: string;
  name: string;
  email: string;
  department: string;
  position: string;
  role: string;
  status: 'active' | 'inactive';
  hireDate: string;
  phone: string;
}

const MOCK_EMPLOYEES: EmployeeItem[] = [
  { id: '1', name: 'Sarah Connor', email: 'sarah@company.com', department: 'Engineering', position: 'Senior Engineer', role: 'employee', status: 'active', hireDate: '2023-03-15', phone: '+1 555-0101' },
  { id: '2', name: 'John Reese', email: 'john@company.com', department: 'Engineering', position: 'Tech Lead', role: 'manager', status: 'active', hireDate: '2022-08-01', phone: '+1 555-0102' },
  { id: '3', name: 'Maria Garcia', email: 'maria@company.com', department: 'Design', position: 'UX Designer', role: 'employee', status: 'active', hireDate: '2024-01-10', phone: '+1 555-0103' },
  { id: '4', name: 'James Wilson', email: 'james@company.com', department: 'Marketing', position: 'Marketing Manager', role: 'manager', status: 'active', hireDate: '2023-06-20', phone: '+1 555-0104' },
  { id: '5', name: 'Lisa Chen', email: 'lisa@company.com', department: 'HR', position: 'HR Specialist', role: 'hr', status: 'active', hireDate: '2023-09-01', phone: '+1 555-0105' },
  { id: '6', name: 'Alex Thompson', email: 'alex@company.com', department: 'Engineering', position: 'Junior Developer', role: 'employee', status: 'inactive', hireDate: '2024-06-15', phone: '+1 555-0106' },
  { id: '7', name: 'Priya Patel', email: 'priya@company.com', department: 'Finance', position: 'Financial Analyst', role: 'employee', status: 'active', hireDate: '2023-11-05', phone: '+1 555-0107' },
  { id: '8', name: 'Michael Brown', email: 'michael@company.com', department: 'Engineering', position: 'DevOps Engineer', role: 'employee', status: 'active', hireDate: '2024-02-20', phone: '+1 555-0108' },
];

const ROLE_BADGE: Record<string, 'info' | 'warning' | 'success' | 'neutral'> = {
  admin: 'danger' as 'info', hr: 'warning', manager: 'info', employee: 'neutral',
};

export default function EmployeesPage() {
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('all');
  const [selected, setSelected] = useState<EmployeeItem | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  const departments = [...new Set(MOCK_EMPLOYEES.map((e) => e.department))];

  const filtered = MOCK_EMPLOYEES.filter((emp) => {
    const matchSearch = emp.name.toLowerCase().includes(search.toLowerCase()) ||
      emp.email.toLowerCase().includes(search.toLowerCase());
    const matchDept = deptFilter === 'all' || emp.department === deptFilter;
    return matchSearch && matchDept;
  });

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex-1 w-full sm:w-auto">
          <Input
            placeholder="Search employees..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="input-field w-full sm:w-48"
          value={deptFilter}
          onChange={(e) => setDeptFilter(e.target.value)}
        >
          <option value="all">All Departments</option>
          {departments.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('table')}
            className={`p-2 rounded-lg ${viewMode === 'table' ? 'bg-gray-200 text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
            </svg>
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-gray-200 text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Table View */}
      {viewMode === 'table' && (
        <Card noPadding>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Employee</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Department</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Position</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((emp) => (
                  <tr
                    key={emp.id}
                    onClick={() => setSelected(emp)}
                    className="cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar name={emp.name} size="sm" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{emp.name}</p>
                          <p className="text-xs text-gray-500">{emp.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{emp.department}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{emp.position}</td>
                    <td className="px-6 py-4">
                      <Badge variant={ROLE_BADGE[emp.role] || 'neutral'}>
                        {emp.role.charAt(0).toUpperCase() + emp.role.slice(1)}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={emp.status === 'active' ? 'success' : 'neutral'}>
                        {emp.status.charAt(0).toUpperCase() + emp.status.slice(1)}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((emp) => (
            <button
              key={emp.id}
              onClick={() => setSelected(emp)}
              className="card p-5 text-left hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col items-center text-center">
                <Avatar name={emp.name} size="lg" />
                <h3 className="mt-3 text-sm font-semibold text-gray-900">{emp.name}</h3>
                <p className="text-xs text-gray-500">{emp.position}</p>
                <p className="text-xs text-gray-400 mt-0.5">{emp.department}</p>
                <div className="mt-3">
                  <Badge variant={emp.status === 'active' ? 'success' : 'neutral'}>
                    {emp.status}
                  </Badge>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Employee Detail */}
      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title="Employee Details" size="md">
        {selected && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar name={selected.name} size="lg" />
              <div>
                <h3 className="text-lg font-bold">{selected.name}</h3>
                <p className="text-sm text-gray-500">{selected.position}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <InfoField label="Email" value={selected.email} />
              <InfoField label="Phone" value={selected.phone} />
              <InfoField label="Department" value={selected.department} />
              <InfoField label="Role" value={selected.role} />
              <InfoField label="Hire Date" value={selected.hireDate} />
              <InfoField label="Status" value={selected.status} />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

function InfoField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-xs text-gray-500">{label}</span>
      <p className="text-sm font-medium text-gray-900 capitalize">{value}</p>
    </div>
  );
}
