import React from 'react';
import type { HistoricalEntry } from '../types';
import Chart from './Chart';
import Loader from './Loader';

interface HistoricalTrendsProps {
  data: HistoricalEntry[];
  analysis: string | null;
  onAnalyze: () => void;
  isAnalyzing: boolean;
}

const HistoricalTrends: React.FC<HistoricalTrendsProps> = ({ data, analysis, onAnalyze, isAnalyzing }) => {
  return (
    <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-white/30 dark:border-slate-700/50 rounded-2xl shadow-lg p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">Historical Trends</h3>
        {data.length >= 2 && (
          <button
            onClick={onAnalyze}
            disabled={isAnalyzing}
            className="bg-teal-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-teal-700 transition-all duration-300 disabled:bg-teal-400 flex items-center space-x-2 text-sm"
          >
            {isAnalyzing ? (
              <>
                <Loader />
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                <span>Analyze Trends with AI</span>
              </>
            )}
          </button>
        )}
      </div>
      
      {analysis && (
        <div className="bg-teal-500/10 border-l-4 border-teal-400 p-4 rounded-r-lg">
            <p className="font-semibold text-teal-800 dark:text-teal-300 mb-1 text-sm">AI Trend Analysis</p>
            <p className="text-slate-700 dark:text-slate-300 italic text-sm">{analysis}</p>
        </div>
      )}

      {data.length > 0 && <Chart data={data.map(d => d.prediction.predictedScore)} />}

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
            <thead className="text-xs text-slate-700 dark:text-slate-300 uppercase bg-white/20 dark:bg-slate-900/30">
                <tr>
                    <th scope="col" className="px-6 py-3 rounded-l-lg">Date</th>
                    <th scope="col" className="px-6 py-3">Predicted Score</th>
                    <th scope="col" className="px-6 py-3 rounded-r-lg">Performance Level</th>
                </tr>
            </thead>
            <tbody>
                {data.slice(-5).reverse().map((entry) => (
                    <tr key={entry.date} className="border-b border-white/20 dark:border-slate-700/50 last:border-b-0">
                        <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-100 whitespace-nowrap">
                            {new Date(entry.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                            {entry.prediction.predictedScore.toFixed(1)}%
                        </td>
                        <td className="px-6 py-4">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                entry.prediction.performanceLevel === 'Excellent' ? 'bg-green-500/10 text-green-700 dark:text-green-300' :
                                entry.prediction.performanceLevel === 'Very Good' ? 'bg-sky-500/10 text-sky-700 dark:text-sky-300' :
                                entry.prediction.performanceLevel === 'Good' ? 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-300' :
                                entry.prediction.performanceLevel === 'Average' ? 'bg-orange-500/10 text-orange-700 dark:text-orange-300' :
                                'bg-red-500/10 text-red-700 dark:text-red-300'
                            }`}>
                                {entry.prediction.performanceLevel}
                            </span>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
        {data.length > 5 && <p className="text-xs text-center text-slate-400 mt-2">Showing last 5 entries.</p>}
      </div>
    </div>
  );
};

export default HistoricalTrends;