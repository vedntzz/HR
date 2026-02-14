'use client';
import { useState } from 'react';
import { Card, Badge, Button, Modal } from '@/components/ui';

interface PolicyItem {
  id: string;
  title: string;
  category: string;
  version: string;
  content: string;
  acknowledged: boolean;
  acknowledgedAt?: string;
}

const CATEGORIES: Record<string, 'info' | 'warning' | 'success' | 'neutral' | 'danger'> = {
  HR: 'info', IT: 'neutral', Finance: 'warning', Compliance: 'danger', General: 'success',
};

const MOCK_POLICIES: PolicyItem[] = [
  { id: '1', title: 'Remote Work Policy', category: 'HR', version: 'v2.1', content: 'This policy outlines the guidelines for remote work arrangements. Employees may work remotely up to 3 days per week with manager approval. All remote workers must maintain a dedicated workspace, be available during core hours (10 AM - 4 PM), and attend mandatory in-office days. Equipment provided by the company must be used securely and returned upon termination.', acknowledged: true, acknowledgedAt: '2025-01-15' },
  { id: '2', title: 'Data Protection & Privacy', category: 'IT', version: 'v3.0', content: 'All employees must handle company and customer data in accordance with GDPR and CCPA regulations. Sensitive data must be encrypted at rest and in transit. Access to customer data requires explicit authorization. Data breaches must be reported within 24 hours to the security team. Annual data protection training is mandatory.', acknowledged: false },
  { id: '3', title: 'Code of Conduct', category: 'Compliance', version: 'v1.5', content: 'This code establishes the standards of behavior expected from all employees. We are committed to maintaining a respectful, inclusive, and harassment-free workplace. All employees must act with integrity, avoid conflicts of interest, and comply with all applicable laws and regulations.', acknowledged: true, acknowledgedAt: '2024-12-01' },
  { id: '4', title: 'Expense Reimbursement', category: 'Finance', version: 'v2.0', content: 'Employees may submit expense claims for business-related costs. All expenses must be pre-approved by a manager for amounts over $100. Receipts are required for all claims. Reimbursement is processed within 15 business days of submission. Travel expenses follow the company travel tier guidelines.', acknowledged: false },
  { id: '5', title: 'Leave & Time Off', category: 'HR', version: 'v2.3', content: 'Full-time employees receive 20 days of paid time off annually, plus public holidays. Leave requests must be submitted at least 2 weeks in advance for planned absences. Sick leave requires documentation for absences exceeding 3 consecutive days. Unused PTO may be carried over up to 5 days.', acknowledged: true, acknowledgedAt: '2025-01-20' },
];

export default function PoliciesPage() {
  const [selected, setSelected] = useState<PolicyItem | null>(null);
  const [policies, setPolicies] = useState(MOCK_POLICIES);
  const pending = policies.filter((p) => !p.acknowledged).length;

  function handleAcknowledge(id: string) {
    setPolicies((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, acknowledged: true, acknowledgedAt: new Date().toISOString().split('T')[0] } : p
      )
    );
    setSelected(null);
  }

  const grouped = policies.reduce<Record<string, PolicyItem[]>>((acc, p) => {
    acc[p.category] = acc[p.category] || [];
    acc[p.category].push(p);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {pending > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-3">
          <span className="text-amber-600 text-xl">&#9888;</span>
          <div>
            <p className="text-sm font-semibold text-amber-800">{pending} policies require your acknowledgement</p>
            <p className="text-xs text-amber-600">Please review and acknowledge all pending policies</p>
          </div>
        </div>
      )}

      {Object.entries(grouped).map(([category, items]) => (
        <div key={category}>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">{category}</h3>
          <div className="space-y-2">
            {items.map((policy) => (
              <button
                key={policy.id}
                onClick={() => setSelected(policy)}
                className="w-full card p-4 flex items-center justify-between hover:shadow-md transition-shadow text-left"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${policy.acknowledged ? 'bg-emerald-50' : 'bg-amber-50'}`}>
                    {policy.acknowledged ? (
                      <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{policy.title}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Badge variant={CATEGORIES[policy.category]}>{policy.category}</Badge>
                      <span className="text-xs text-gray-400">{policy.version}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  {policy.acknowledged ? (
                    <p className="text-xs text-emerald-600">Acknowledged {policy.acknowledgedAt}</p>
                  ) : (
                    <Badge variant="warning">Pending</Badge>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      ))}

      {/* Policy Detail Modal */}
      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title={selected?.title} size="md">
        {selected && (
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <Badge variant={CATEGORIES[selected.category]}>{selected.category}</Badge>
              <span className="text-xs text-gray-400">{selected.version}</span>
            </div>
            <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed">
              <p>{selected.content}</p>
            </div>
            {!selected.acknowledged ? (
              <div className="border-t pt-4">
                <Button className="w-full" onClick={() => handleAcknowledge(selected.id)}>
                  I have read and acknowledge this policy
                </Button>
              </div>
            ) : (
              <div className="bg-emerald-50 rounded-lg p-3 flex items-center gap-2">
                <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm text-emerald-700">Acknowledged on {selected.acknowledgedAt}</span>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
