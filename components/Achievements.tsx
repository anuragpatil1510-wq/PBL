import React from 'react';
import { ACHIEVEMENTS_LIST } from '../constants';

interface AchievementsProps {
  unlockedIds: string[];
}

const Achievements: React.FC<AchievementsProps> = ({ unlockedIds }) => {
  return (
    <div>
      <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">Achievements</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {ACHIEVEMENTS_LIST.map(ach => {
          const isUnlocked = unlockedIds.includes(ach.id);
          return (
            <div
              key={ach.id}
              className={`p-4 rounded-lg flex items-center space-x-4 transition-all duration-300 ${isUnlocked ? 'bg-amber-400/10 backdrop-blur-sm border border-amber-400/20' : 'bg-white/20 dark:bg-slate-900/30 backdrop-blur-sm border border-white/20 dark:border-slate-700/30'}`}
            >
              <div className={`w-12 h-12 p-2 rounded-lg ${isUnlocked ? 'bg-amber-400 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-400'}`}>
                {ach.icon}
              </div>
              <div className="flex-1">
                <p className={`font-bold ${isUnlocked ? 'text-amber-800 dark:text-amber-300' : 'text-slate-700 dark:text-slate-300'}`}>
                  {ach.name}
                </p>
                <p className={`text-sm ${isUnlocked ? 'text-slate-600 dark:text-slate-400' : 'text-slate-500'}`}>
                  {ach.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Achievements;