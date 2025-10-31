import React from 'react';

interface ChartProps {
  data: number[];
}

const Chart: React.FC<ChartProps> = ({ data }) => {
  if (data.length < 2) {
    return (
      <div className="text-center py-8 text-slate-500 dark:text-slate-400">
        Log at least two data points to see your progress chart.
      </div>
    );
  }

  const width = 500;
  const height = 150;
  const padding = 20;

  const maxX = data.length - 1;
  const stepX = (width - padding * 2) / (data.length > 1 ? maxX : 1);
  const stepY = (height - padding * 2) / 100;

  const points = data.map((point, i) => {
    const x = padding + i * stepX;
    const y = height - padding - point * stepY;
    return `${x},${y}`;
  }).join(' ');
  
  const lastPoint = data[data.length - 1];
  const lastX = padding + maxX * stepX;
  const lastY = height - padding - lastPoint * stepY;

  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto" preserveAspectRatio="xMidYMid meet">
        <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#14b8a6" stopOpacity={0}/>
            </linearGradient>
        </defs>

        {/* Y-axis labels */}
        <text x="5" y={padding - 5} fontSize="10" className="fill-slate-400">100</text>
        <text x="5" y={height/2} fontSize="10" className="fill-slate-400">50</text>
        <text x="5" y={height - padding + 10} fontSize="10" className="fill-slate-400">0</text>
        
        {/* Grid lines */}
        <line x1={padding} y1={padding} x2={width - padding} y2={padding} className="stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />
        <line x1={padding} y1={height/2} x2={width - padding} y2={height/2} className="stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" strokeDasharray="2,2"/>
        <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} className="stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />

        {/* Gradient Area */}
        <polygon
            fill="url(#chartGradient)"
            points={`${padding},${height - padding} ${points} ${lastX},${height-padding}`}
        />

        {/* Line */}
        <polyline
          fill="none"
          stroke="#0d9488"
          strokeWidth="2"
          points={points}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Data points */}
        {data.map((point, i) => (
          <circle
            key={i}
            cx={padding + i * stepX}
            cy={height - padding - point * stepY}
            r="3"
            fill="#0d9488"
            className="transition-transform duration-300 hover:scale-150"
          >
            <title>Score: {point.toFixed(1)}</title>
          </circle>
        ))}

        {/* Last point highlight */}
        <circle
            cx={lastX}
            cy={lastY}
            r="5"
            className="fill-white dark:fill-slate-800"
            stroke="#0d9488"
            strokeWidth="2"
        />
      </svg>
    </div>
  );
};

export default Chart;