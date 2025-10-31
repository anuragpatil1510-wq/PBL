import React from 'react';
import type { StudentData } from '../types';
import { PARAMETERS } from '../constants';

interface RadarChartProps {
  data: StudentData;
}

const RadarChart: React.FC<RadarChartProps> = ({ data }) => {
  const size = 200;
  const center = size / 2;
  const numAxes = PARAMETERS.length;
  const angleSlice = (Math.PI * 2) / numAxes;

  const points = PARAMETERS.map((param, i) => {
    const rawValue = data[param.id];
    const normalizedValue = (rawValue - param.min) / (param.max - param.min);
    const radius = normalizedValue * (center - 20);
    const x = center + radius * Math.cos(angleSlice * i - Math.PI / 2);
    const y = center + radius * Math.sin(angleSlice * i - Math.PI / 2);
    return `${x},${y}`;
  });

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full">
      <defs>
        <linearGradient id="radarGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#14b8a6" stopOpacity={0.4} />
          <stop offset="100%" stopColor="#5eead4" stopOpacity={0.2} />
        </linearGradient>
      </defs>

      {/* Grid Levels */}
      {[0.25, 0.5, 0.75, 1].map((level, i) => (
        <polygon
          key={i}
          points={Array.from({ length: numAxes }, (_, j) => {
            const radius = level * (center - 20);
            const x = center + radius * Math.cos(angleSlice * j - Math.PI / 2);
            const y = center + radius * Math.sin(angleSlice * j - Math.PI / 2);
            return `${x},${y}`;
          }).join(' ')}
          className="fill-none stroke-slate-200 dark:stroke-slate-700"
          strokeWidth="1"
        />
      ))}

      {/* Axes */}
      {PARAMETERS.map((param, i) => {
        const x = center + (center - 10) * Math.cos(angleSlice * i - Math.PI / 2);
        const y = center + (center - 10) * Math.sin(angleSlice * i - Math.PI / 2);
        const labelX = center + (center - 0) * Math.cos(angleSlice * i - Math.PI / 2);
        const labelY = center + (center - 0) * Math.sin(angleSlice * i - Math.PI / 2);
        
        // FIX: Explicitly define the type for `textAnchor` to match the expected SVG attribute values ("start", "middle", "end"), resolving the TypeScript type error.
        let textAnchor: "start" | "middle" | "end" = "middle";
        if(labelX < center - 5) textAnchor = "end";
        if(labelX > center + 5) textAnchor = "start";

        return (
          <g key={param.id}>
            <line
              x1={center}
              y1={center}
              x2={x}
              y2={y}
              className="stroke-slate-200 dark:stroke-slate-700"
              strokeWidth="1"
            />
            <text
              x={labelX}
              y={labelY}
              textAnchor={textAnchor}
              dominantBaseline="middle"
              className="text-[6px] font-semibold fill-slate-500 dark:fill-slate-400"
            >
                {param.label.split(' ')[0]}
            </text>
          </g>
        );
      })}

      {/* Data Shape */}
      <polygon
        points={points.join(' ')}
        fill="url(#radarGradient)"
        stroke="#0d9488"
        strokeWidth="2"
      />
       {points.map((p, i) => {
           const coords = p.split(',');
           return (
            <circle key={i} cx={coords[0]} cy={coords[1]} r="2" className="fill-teal-600 dark:fill-teal-400" />
           )
       })}
    </svg>
  );
};

export default RadarChart;