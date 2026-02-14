'use client';
import { useState } from 'react';
import { Button } from '@/components/ui';
import clsx from 'clsx';

const STRENGTH_TAGS = [
  'Problem Solver', 'Team Player', 'Fast Learner', 'Domain Expert',
  'Clear Communicator', 'Leadership', 'Creative Thinker', 'Detail Oriented',
  'Self Motivated', 'Adaptable',
];

const RECOMMENDATIONS = [
  { value: 'strong_yes', label: 'Strong Yes', color: 'bg-emerald-500 hover:bg-emerald-600', ring: 'ring-emerald-300' },
  { value: 'yes', label: 'Yes', color: 'bg-emerald-400 hover:bg-emerald-500', ring: 'ring-emerald-200' },
  { value: 'neutral', label: 'Neutral', color: 'bg-gray-400 hover:bg-gray-500', ring: 'ring-gray-200' },
  { value: 'no', label: 'No', color: 'bg-red-400 hover:bg-red-500', ring: 'ring-red-200' },
  { value: 'strong_no', label: 'Strong No', color: 'bg-red-500 hover:bg-red-600', ring: 'ring-red-300' },
];

interface Props {
  onSubmit: () => void;
}

export function InterviewFeedbackForm({ onSubmit }: Props) {
  const [rating, setRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [technical, setTechnical] = useState(0);
  const [communication, setCommunication] = useState(0);
  const [cultureFit, setCultureFit] = useState(0);
  const [strengths, setStrengths] = useState<string[]>([]);
  const [recommendation, setRecommendation] = useState('');
  const [summary, setSummary] = useState('');

  function toggleStrength(tag: string) {
    setStrengths((prev) =>
      prev.includes(tag) ? prev.filter((s) => s !== tag) : [...prev, tag]
    );
  }

  return (
    <div className="space-y-8">
      {/* Overall Rating */}
      <div>
        <label className="text-sm font-semibold text-gray-700 mb-3 block">Overall Rating</label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onMouseEnter={() => setHoveredStar(star)}
              onMouseLeave={() => setHoveredStar(0)}
              onClick={() => setRating(star)}
              className="transition-transform hover:scale-110"
            >
              <svg
                className={clsx('w-10 h-10', star <= (hoveredStar || rating) ? 'text-amber-400' : 'text-gray-200')}
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </button>
          ))}
          {rating > 0 && <span className="text-sm text-gray-500 self-center ml-2">{rating}/5</span>}
        </div>
      </div>

      {/* Dimension Scores */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <ScoreDimension label="Technical Skills" value={technical} onChange={setTechnical} />
        <ScoreDimension label="Communication" value={communication} onChange={setCommunication} />
        <ScoreDimension label="Culture Fit" value={cultureFit} onChange={setCultureFit} />
      </div>

      {/* Strengths Tags */}
      <div>
        <label className="text-sm font-semibold text-gray-700 mb-3 block">Strengths</label>
        <div className="flex flex-wrap gap-2">
          {STRENGTH_TAGS.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => toggleStrength(tag)}
              className={clsx(
                'px-3 py-1.5 rounded-full text-sm font-medium transition-all border',
                strengths.includes(tag)
                  ? 'bg-blue-50 text-blue-700 border-blue-300 ring-2 ring-blue-100'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              )}
            >
              {strengths.includes(tag) && <span className="mr-1">\u2713</span>}
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Recommendation */}
      <div>
        <label className="text-sm font-semibold text-gray-700 mb-3 block">Recommendation</label>
        <div className="flex flex-wrap gap-2">
          {RECOMMENDATIONS.map((rec) => (
            <button
              key={rec.value}
              type="button"
              onClick={() => setRecommendation(rec.value)}
              className={clsx(
                'px-4 py-2.5 rounded-lg text-sm font-semibold text-white transition-all',
                rec.color,
                recommendation === rec.value && `ring-4 ${rec.ring} scale-105`
              )}
            >
              {rec.label}
            </button>
          ))}
        </div>
      </div>

      {/* Decision Summary */}
      <div>
        <label className="text-sm font-semibold text-gray-700 mb-2 block">Decision Summary</label>
        <textarea
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          rows={3}
          className="input-field resize-none"
          placeholder="Summarize your assessment and key observations..."
        />
      </div>

      {/* Submit */}
      <div className="flex gap-3 pt-2">
        <Button onClick={onSubmit} disabled={!rating || !recommendation}>
          Submit Feedback
        </Button>
        <Button variant="secondary" onClick={onSubmit}>Cancel</Button>
      </div>
    </div>
  );
}

function ScoreDimension({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-600 mb-2 block">{label}</label>
      <div className="flex gap-1.5">
        {[1, 2, 3, 4, 5].map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => onChange(v)}
            className={clsx(
              'w-10 h-10 rounded-lg text-sm font-semibold transition-all',
              v <= value
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
            )}
          >
            {v}
          </button>
        ))}
      </div>
    </div>
  );
}
