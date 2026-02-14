import { ReactNode } from 'react';
import clsx from 'clsx';

interface StatCardProps {
  label: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon?: ReactNode;
}

const trendColors = {
  up: 'text-emerald-600 bg-emerald-50',
  down: 'text-red-600 bg-red-50',
  neutral: 'text-gray-600 bg-gray-50',
};

const trendArrows = { up: '\u2191', down: '\u2193', neutral: '\u2192' };

export function StatCard({ label, value, change, trend, icon }: StatCardProps) {
  return (
    <div className="card p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{label}</p>
          <p className="mt-1 text-3xl font-bold text-gray-900">{value}</p>
        </div>
        {icon && (
          <div className="flex-shrink-0 p-2.5 bg-blue-50 rounded-lg text-blue-600">
            {icon}
          </div>
        )}
      </div>
      {change && trend && (
        <div className="mt-3 flex items-center gap-1.5">
          <span className={clsx('inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-medium', trendColors[trend])}>
            {trendArrows[trend]} {change}
          </span>
        </div>
      )}
    </div>
  );
}
