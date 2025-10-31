import React from 'react';

interface RecommendationsProps {
  recommendations: string[];
}

const Recommendations: React.FC<RecommendationsProps> = ({ recommendations }) => {
  return (
    <div>
      <div className="flex items-center mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-teal-500 dark:text-teal-400" viewBox="0 0 20 20" fill="currentColor">
           <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.707-10.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 001.414 1.414L10 9.414l1.293 1.293a1 1 0 001.414-1.414l-2-2z" clipRule="evenodd" />
        </svg>
        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 ml-2">Personalized Recommendations</h3>
      </div>
      <ul className="space-y-3 mt-4">
        {recommendations.map((rec, index) => (
          <li key={index} className="flex items-start p-3 bg-white/20 dark:bg-slate-900/30 backdrop-blur-sm border border-white/20 dark:border-slate-700/30 rounded-lg">
            <span className="text-lg mr-3 mt-0.5">{rec.match(/(\p{Emoji})/u)?.[0]}</span>
            <p className="text-slate-700 dark:text-slate-300 text-sm flex-1">{rec.replace(/(\p{Emoji})/u, '').trim()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Recommendations;