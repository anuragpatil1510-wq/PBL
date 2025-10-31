import React from 'react';
import type { Subject } from '../types';

interface SubjectBreakdownProps {
  subjects: Subject[];
}

const SubjectBreakdown: React.FC<SubjectBreakdownProps> = ({ subjects }) => {
    
  const getBarColor = (score: number) => {
    if (score >= 90) return 'bg-green-500';
    if (score >= 80) return 'bg-sky-500';
    if (score >= 70) return 'bg-yellow-400';
    if (score >= 60) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <div>
      <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4">Subject-wise Breakdown</h3>
      <div className="space-y-4">
        {subjects.map((subject) => (
          <div key={subject.subject}>
            <div className="flex justify-between items-center mb-1 text-sm">
              <p className="font-semibold text-slate-700 dark:text-slate-300">{subject.subject}</p>
              <p className="font-bold text-slate-600 dark:text-slate-200">{subject.score.toFixed(0)}%</p>
            </div>
            <div className="w-full bg-slate-200/50 dark:bg-slate-700/50 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${getBarColor(subject.score)}`}
                style={{ width: `${subject.score}%`, transition: 'width 0.5s ease-out' }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubjectBreakdown;