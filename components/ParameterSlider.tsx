import React from 'react';

interface ParameterSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
}

const ParameterSlider: React.FC<ParameterSliderProps> = ({ label, value, min, max, step, onChange }) => {
  const percentage = ((value - min) / (max - min)) * 100;
  
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</label>
        <span className="px-2 py-0.5 text-xs font-bold text-teal-700 dark:text-teal-300 bg-teal-500/10 dark:bg-teal-500/20 rounded-md">
          {value.toFixed(label.includes('GPA') ? 1 : 0)}
        </span>
      </div>
      <div className="relative h-2">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="w-full h-2 bg-transparent appearance-none cursor-pointer absolute top-0 left-0 z-10 accent-teal-600"
          style={{ '--thumb-size': '16px' } as React.CSSProperties}
        />
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-200 dark:bg-slate-700 rounded-full -translate-y-1/2">
            <div 
                className="absolute top-0 left-0 h-full bg-teal-500 rounded-full"
                style={{ width: `${percentage}%` }}
            ></div>
        </div>
      </div>
    </div>
  );
};

export default ParameterSlider;