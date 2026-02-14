'use client';
import { useState } from 'react';
import { Card, Badge, Button, Modal, Input } from '@/components/ui';
import { InterviewFeedbackForm } from '@/features/recruitment/InterviewFeedback';

type Stage = 'applied' | 'screening' | 'interview' | 'offer' | 'hired' | 'rejected';

interface Candidate {
  id: string;
  name: string;
  position: string;
  stage: Stage;
  email: string;
  appliedDate: string;
  rating?: number;
}

const STAGES: { key: Stage; label: string; color: string }[] = [
  { key: 'applied', label: 'Applied', color: 'bg-blue-500' },
  { key: 'screening', label: 'Screening', color: 'bg-amber-500' },
  { key: 'interview', label: 'Interview', color: 'bg-purple-500' },
  { key: 'offer', label: 'Offer', color: 'bg-emerald-500' },
  { key: 'hired', label: 'Hired', color: 'bg-emerald-600' },
];

const MOCK_CANDIDATES: Candidate[] = [
  { id: '1', name: 'Alice Chen', position: 'Frontend Engineer', stage: 'interview', email: 'alice@email.com', appliedDate: '2025-01-28', rating: 4 },
  { id: '2', name: 'Bob Martinez', position: 'Backend Engineer', stage: 'applied', email: 'bob@email.com', appliedDate: '2025-02-05' },
  { id: '3', name: 'Carol Johnson', position: 'Product Designer', stage: 'screening', email: 'carol@email.com', appliedDate: '2025-02-01' },
  { id: '4', name: 'David Kim', position: 'DevOps Engineer', stage: 'offer', email: 'david@email.com', appliedDate: '2025-01-15', rating: 5 },
  { id: '5', name: 'Eva Petrova', position: 'Frontend Engineer', stage: 'applied', email: 'eva@email.com', appliedDate: '2025-02-08' },
  { id: '6', name: 'Frank Wu', position: 'Data Analyst', stage: 'interview', email: 'frank@email.com', appliedDate: '2025-01-20', rating: 3 },
  { id: '7', name: 'Grace Lee', position: 'Backend Engineer', stage: 'hired', email: 'grace@email.com', appliedDate: '2024-12-10', rating: 5 },
];

const STAGE_BADGE: Record<Stage, 'info' | 'warning' | 'neutral' | 'success' | 'danger'> = {
  applied: 'info', screening: 'warning', interview: 'neutral', offer: 'success', hired: 'success', rejected: 'danger',
};

export default function RecruitmentPage() {
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  return (
    <div className="space-y-6">
      {/* Pipeline stats */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2">
        {STAGES.map((stage) => {
          const count = MOCK_CANDIDATES.filter((c) => c.stage === stage.key).length;
          return (
            <div key={stage.key} className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-gray-200 whitespace-nowrap">
              <div className={`w-2.5 h-2.5 rounded-full ${stage.color}`} />
              <span className="text-sm font-medium text-gray-700">{stage.label}</span>
              <span className="text-sm font-bold text-gray-900">{count}</span>
            </div>
          );
        })}
        <div className="flex-1" />
        <Button onClick={() => setShowAddModal(true)}>Add Candidate</Button>
      </div>

      {/* Kanban Pipeline */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {STAGES.map((stage) => (
          <div key={stage.key} className="space-y-3">
            <div className="flex items-center gap-2 px-1">
              <div className={`w-2 h-2 rounded-full ${stage.color}`} />
              <h3 className="text-sm font-semibold text-gray-700">{stage.label}</h3>
              <span className="text-xs text-gray-400">
                {MOCK_CANDIDATES.filter((c) => c.stage === stage.key).length}
              </span>
            </div>
            <div className="space-y-2 min-h-[200px]">
              {MOCK_CANDIDATES.filter((c) => c.stage === stage.key).map((candidate) => (
                <button
                  key={candidate.id}
                  onClick={() => setSelectedCandidate(candidate)}
                  className="w-full text-left card p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-semibold text-blue-700">
                      {candidate.name.split(' ').map((n) => n[0]).join('')}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{candidate.name}</p>
                      <p className="text-xs text-gray-500 truncate">{candidate.position}</p>
                    </div>
                  </div>
                  {candidate.rating && (
                    <div className="flex gap-0.5 mt-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span key={star} className={`text-xs ${star <= candidate.rating! ? 'text-amber-400' : 'text-gray-200'}`}>
                          \u2605
                        </span>
                      ))}
                    </div>
                  )}
                  <p className="text-xs text-gray-400 mt-2">{candidate.appliedDate}</p>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Candidate Detail Modal */}
      <Modal isOpen={!!selectedCandidate} onClose={() => setSelectedCandidate(null)} title="Candidate Details" size="lg">
        {selectedCandidate && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-lg font-bold text-blue-700">
                {selectedCandidate.name.split(' ').map((n) => n[0]).join('')}
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">{selectedCandidate.name}</h3>
                <p className="text-sm text-gray-500">{selectedCandidate.position}</p>
              </div>
              <div className="ml-auto">
                <Badge variant={STAGE_BADGE[selectedCandidate.stage]}>
                  {selectedCandidate.stage.charAt(0).toUpperCase() + selectedCandidate.stage.slice(1)}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 bg-gray-50 rounded-lg p-4">
              <div><span className="text-xs text-gray-500">Email</span><p className="text-sm font-medium">{selectedCandidate.email}</p></div>
              <div><span className="text-xs text-gray-500">Applied</span><p className="text-sm font-medium">{selectedCandidate.appliedDate}</p></div>
            </div>

            {/* Timeline */}
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Pipeline Timeline</h4>
              <div className="flex items-center gap-1">
                {STAGES.map((stage, i) => {
                  const stageIdx = STAGES.findIndex((s) => s.key === selectedCandidate.stage);
                  const isPast = i <= stageIdx;
                  return (
                    <div key={stage.key} className="flex-1 flex items-center">
                      <div className={`w-full h-2 rounded-full ${isPast ? stage.color : 'bg-gray-200'}`} />
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-between mt-1">
                {STAGES.map((s) => (
                  <span key={s.key} className="text-[10px] text-gray-400">{s.label}</span>
                ))}
              </div>
            </div>

            <Button onClick={() => { setSelectedCandidate(null); setShowFeedbackModal(true); }}>
              Add Interview Feedback
            </Button>
          </div>
        )}
      </Modal>

      {/* Add Candidate Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add Candidate" size="md">
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setShowAddModal(false); }}>
          <div className="grid grid-cols-2 gap-4">
            <Input label="First Name" placeholder="First name" required />
            <Input label="Last Name" placeholder="Last name" required />
          </div>
          <Input label="Email" type="email" placeholder="candidate@email.com" required />
          <Input label="Phone" type="tel" placeholder="+1 (555) 000-0000" />
          <Input label="Position Applied" placeholder="e.g. Frontend Engineer" required />
          <Input label="Source" placeholder="e.g. LinkedIn, Referral" />
          <div className="flex gap-3 pt-2">
            <Button type="submit">Add Candidate</Button>
            <Button variant="secondary" onClick={() => setShowAddModal(false)}>Cancel</Button>
          </div>
        </form>
      </Modal>

      {/* Interview Feedback Modal */}
      <Modal isOpen={showFeedbackModal} onClose={() => setShowFeedbackModal(false)} title="Interview Feedback" size="lg">
        <InterviewFeedbackForm onSubmit={() => setShowFeedbackModal(false)} />
      </Modal>
    </div>
  );
}
