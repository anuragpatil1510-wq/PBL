import React from 'react';

interface RadialProgressProps {
  score: number;
  goal?: number;
}

const RadialProgress: React.FC<RadialProgressProps> = ({ score, goal }) => {
  const radius = 52;
  const stroke = 12;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getStrokeColor = () => {
    if (score >= 90) return 'url(#gradientGreen)';
    if (score >= 80) return 'url(#gradientSky)';
    if (score >= 70) return 'url(#gradientYellow)';
    if (score >= 60) return 'url(#gradientOrange)';
    return 'url(#gradientRed)';
  };

  const goalAngle = goal ? (goal / 100) * 360 : 0;
  const goalX = radius + normalizedRadius * Math.cos((goalAngle - 90) * (Math.PI / 180));
  const goalY = radius + normalizedRadius * Math.sin((goalAngle - 90) * (Math.PI / 180));

  return (
    <svg height={radius * 2} width={radius * 2} className="transform -rotate-90">
       <defs>
        <linearGradient id="gradientGreen" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#4ade80" />
          <stop offset="100%" stopColor="#16a34a" />
        </linearGradient>
        <linearGradient id="gradientSky" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#0ea5e9" />
        </linearGradient>
        <linearGradient id="gradientYellow" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fde047" />
          <stop offset="100%" stopColor="#facc15" />
        </linearGradient>
        <linearGradient id="gradientOrange" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fb923c" />
          <stop offset="100%" stopColor="#f97316" />
        </linearGradient>
        <linearGradient id="gradientRed" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#f87171" />
          <stop offset="100%" stopColor="#ef4444" />
        </linearGradient>
      </defs>
      <circle
        stroke="currentColor"
        className="text-slate-200/50 dark:text-slate-700/50"
        fill="transparent"
        strokeWidth={stroke}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
      />
      <circle
        stroke={getStrokeColor()}
        fill="transparent"
        strokeWidth={stroke}
        strokeDasharray={circumference + ' ' + circumference}
        style={{ strokeDashoffset, transition: 'stroke-dashoffset 0.5s ease-out' }}
        strokeLinecap="round"
        r={normalizedRadius}
        cx={radius}
        cy={radius}
      />
       {goal && (
          <g transform={`translate(${goalX}, ${goalY}) rotate(${goalAngle})`}>
            <path d="M -5 -6 L 5 -6 L 0 0 z" fill="currentColor" className="text-slate-600 dark:text-white" />
          </g>
      )}
    </svg>
  );
};

export default RadialProgress;