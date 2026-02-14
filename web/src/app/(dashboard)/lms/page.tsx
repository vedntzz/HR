'use client';
import { useState } from 'react';
import { Card, Badge, Button, Modal, StatCard } from '@/components/ui';
import clsx from 'clsx';

interface CourseItem {
  id: string;
  title: string;
  description: string;
  duration: string;
  mandatory: boolean;
  progress: number;
  status: 'not_started' | 'in_progress' | 'completed';
  color: string;
}

const COURSES: CourseItem[] = [
  { id: '1', title: 'Data Privacy Fundamentals', description: 'Learn about GDPR, CCPA, and data handling best practices for modern organizations.', duration: '45 min', mandatory: true, progress: 100, status: 'completed', color: 'bg-blue-500' },
  { id: '2', title: 'Workplace Safety Training', description: 'Essential workplace safety protocols, emergency procedures, and reporting guidelines.', duration: '30 min', mandatory: true, progress: 60, status: 'in_progress', color: 'bg-emerald-500' },
  { id: '3', title: 'Leadership Essentials', description: 'Core leadership skills including communication, delegation, and team management.', duration: '1h 20min', mandatory: false, progress: 0, status: 'not_started', color: 'bg-purple-500' },
  { id: '4', title: 'Diversity & Inclusion', description: 'Building an inclusive workplace culture and understanding unconscious bias.', duration: '50 min', mandatory: true, progress: 30, status: 'in_progress', color: 'bg-amber-500' },
  { id: '5', title: 'Time Management Mastery', description: 'Proven techniques for managing your time, priorities, and productivity.', duration: '35 min', mandatory: false, progress: 0, status: 'not_started', color: 'bg-pink-500' },
  { id: '6', title: 'Cybersecurity Awareness', description: 'Protect against phishing, malware, and social engineering attacks.', duration: '40 min', mandatory: true, progress: 0, status: 'not_started', color: 'bg-red-500' },
];

const STATUS_BADGE: Record<string, 'success' | 'warning' | 'neutral'> = {
  completed: 'success', in_progress: 'warning', not_started: 'neutral',
};
const STATUS_LABEL: Record<string, string> = {
  completed: 'Completed', in_progress: 'In Progress', not_started: 'Not Started',
};

export default function LMSPage() {
  const [selected, setSelected] = useState<CourseItem | null>(null);
  const completed = COURSES.filter((c) => c.status === 'completed').length;
  const inProgress = COURSES.filter((c) => c.status === 'in_progress').length;
  const notStarted = COURSES.filter((c) => c.status === 'not_started').length;

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Completed" value={completed} change={`${Math.round((completed / COURSES.length) * 100)}%`} trend="up" />
        <StatCard label="In Progress" value={inProgress} />
        <StatCard label="Not Started" value={notStarted} />
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {COURSES.map((course) => (
          <button
            key={course.id}
            onClick={() => setSelected(course)}
            className="card text-left hover:shadow-md transition-shadow"
          >
            <div className={`h-2 ${course.color} rounded-t-xl`} />
            <div className="p-5">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-sm font-semibold text-gray-900 leading-tight">{course.title}</h3>
                {course.mandatory && (
                  <span className="flex-shrink-0 ml-2 text-[10px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded">
                    Required
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 line-clamp-2 mb-4">{course.description}</p>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-400">{course.duration}</span>
                <Badge variant={STATUS_BADGE[course.status]}>{STATUS_LABEL[course.status]}</Badge>
              </div>
              {/* Progress bar */}
              <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={clsx('h-full rounded-full transition-all', course.color)}
                  style={{ width: `${course.progress}%` }}
                />
              </div>
              <p className="text-[11px] text-gray-400 mt-1">{course.progress}% complete</p>
            </div>
          </button>
        ))}
      </div>

      {/* Course Detail */}
      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title={selected?.title} size="md">
        {selected && (
          <div className="space-y-6">
            <p className="text-sm text-gray-600 leading-relaxed">{selected.description}</p>
            <div className="grid grid-cols-2 gap-4 bg-gray-50 rounded-lg p-4">
              <div><span className="text-xs text-gray-500">Duration</span><p className="text-sm font-medium">{selected.duration}</p></div>
              <div><span className="text-xs text-gray-500">Status</span><p className="text-sm font-medium capitalize">{STATUS_LABEL[selected.status]}</p></div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Progress</span>
                <span className="text-sm font-bold text-gray-900">{selected.progress}%</span>
              </div>
              <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                <div className={clsx('h-full rounded-full', selected.color)} style={{ width: `${selected.progress}%` }} />
              </div>
            </div>
            {selected.status !== 'completed' && (
              <Button className="w-full" onClick={() => setSelected(null)}>
                {selected.status === 'not_started' ? 'Start Course' : 'Continue Course'}
              </Button>
            )}
            {selected.status === 'completed' && (
              <div className="text-center py-4">
                <span className="text-3xl">&#127942;</span>
                <p className="text-sm font-semibold text-emerald-600 mt-2">Course Completed!</p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
