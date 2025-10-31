import React from 'react';
import { BADGES_LIST } from '../constants';

interface BadgesProps {
  userPoints: number;
}

const Badges: React.FC<BadgesProps> = ({ userPoints }) => {
  return (
    <div>
      <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">Badges</h3>
      <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">Unlock new badges by earning Study Points (SP) for using the app.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {BADGES_LIST.map(badge => {
          const isUnlocked = userPoints >= badge.pointsRequired;
          const progress = Math.min((userPoints / badge.pointsRequired) * 100, 100);

          return (
            <div
              key={badge.id}
              className={`p-4 rounded-lg flex items-center space-x-4 transition-all duration-300 relative overflow-hidden ${isUnlocked ? 'bg-teal-500/10 backdrop-blur-sm border border-teal-500/20' : 'bg-white/20 dark:bg-slate-900/30 backdrop-blur-sm border border-white/20 dark:border-slate-700/30'}`}
            >
              <div className={`w-16 h-16 p-3 rounded-lg flex-shrink-0 relative ${isUnlocked ? 'bg-teal-500 text-white shadow-lg' : 'bg-slate-200 dark:bg-slate-700 text-slate-400'}`}>
                {badge.icon}
                {isUnlocked && <div className="absolute -top-1 -right-1 w-5 h-5 bg-amber-400 text-white rounded-full flex items-center justify-center text-xs shadow-md">✓</div>}
              </div>
              <div className="flex-1">
                <p className={`font-bold ${isUnlocked ? 'text-teal-800 dark:text-teal-300' : 'text-slate-700 dark:text-slate-300'}`}>
                  {badge.name}
                </p>
                <p className={`text-sm ${isUnlocked ? 'text-slate-600 dark:text-slate-400' : 'text-slate-500'}`}>
                  {badge.description}
                </p>
                {!isUnlocked && (
                   <div className="w-full bg-slate-200/50 dark:bg-slate-700/50 rounded-full h-1.5 mt-2">
                        <div className="bg-teal-600 h-1.5 rounded-full" style={{ width: `${progress}%` }}></div>
                   </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Badges;