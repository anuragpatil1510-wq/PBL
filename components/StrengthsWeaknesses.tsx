import React from 'react';

interface StrengthsWeaknessesProps {
  strengths: string[];
  weaknesses: string[];
}

const InfoPill: React.FC<{ text: string; type: 'strength' | 'weakness' }> = ({ text, type }) => {
    const isStrength = type === 'strength';
    const bgColor = isStrength ? 'bg-green-500/10' : 'bg-red-500/10';
    const textColor = isStrength ? 'text-green-800 dark:text-green-300' : 'text-red-800 dark:text-red-300';
    const iconColor = isStrength ? 'text-green-500' : 'text-red-500';

    const icon = isStrength ? (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
    ) : (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
    );
    
    return (
        <div className={`flex items-center p-3 rounded-lg ${bgColor}`}>
            <div className={iconColor}>{icon}</div>
            <p className={`ml-3 text-sm font-medium ${textColor}`}>{text}</p>
        </div>
    );
};


const StrengthsWeaknesses: React.FC<StrengthsWeaknessesProps> = ({ strengths, weaknesses }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
            <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-3">Key Strengths</h3>
            <div className="space-y-2">
                {strengths.map((s, i) => <InfoPill key={`s-${i}`} text={s} type="strength" />)}
            </div>
        </div>
        <div>
            <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-3">Areas for Improvement</h3>
            <div className="space-y-2">
                {weaknesses.map((w, i) => <InfoPill key={`w-${i}`} text={w} type="weakness" />)}
            </div>
        </div>
    </div>
  );
};

export default StrengthsWeaknesses;