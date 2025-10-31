import React, { useState, useEffect } from 'react';
import { getAIGoalSuggestion } from '../services/geminiService';
import type { StudentData, HistoricalEntry } from '../types';
import Loader from './Loader';

interface GoalSetterProps {
    goal: number;
    onGoalChange: (score: number) => void;
    studentData: StudentData;
    historicalData: HistoricalEntry[];
}

const GoalSetter: React.FC<GoalSetterProps> = ({ goal, onGoalChange, studentData, historicalData }) => {
    const [localGoal, setLocalGoal] = useState(goal.toString());
    const [isSuggesting, setIsSuggesting] = useState(false);
    const [suggestion, setSuggestion] = useState<string | null>(null);

    useEffect(() => {
        setLocalGoal(goal.toString());
    }, [goal]);

    const handleBlur = () => {
        const numGoal = parseFloat(localGoal);
        if (!isNaN(numGoal) && numGoal >= 0 && numGoal <= 100) {
            onGoalChange(numGoal);
        } else {
            setLocalGoal(goal.toString()); // revert if invalid
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLocalGoal(e.target.value);
    };
    
    const handleAISuggestion = async () => {
        setIsSuggesting(true);
        setSuggestion(null);
        try {
            const { suggestedGoal, reason } = await getAIGoalSuggestion(studentData, historicalData);
            onGoalChange(suggestedGoal);
            setLocalGoal(suggestedGoal.toString());
            setSuggestion(reason);
        } catch(error) {
            console.error(error);
            setSuggestion("Could not get a suggestion at this time.");
        } finally {
            setIsSuggesting(false);
        }
    };

    return (
        <div className="p-4 bg-white/20 dark:bg-slate-900/30 backdrop-blur-sm border border-white/20 dark:border-slate-700/30 rounded-lg space-y-3">
            <div className="flex justify-between items-center">
                <label htmlFor="goal-score" className="block text-sm font-bold text-slate-800 dark:text-slate-100">
                    Set Your Target Score
                </label>
                <button 
                    onClick={handleAISuggestion}
                    disabled={isSuggesting}
                    className="flex items-center space-x-1.5 px-2 py-1 text-xs font-semibold text-teal-700 dark:text-teal-300 bg-teal-500/10 dark:bg-teal-500/20 rounded-md hover:bg-teal-500/20 dark:hover:bg-teal-500/30 disabled:opacity-50"
                    title="Ask AI for a realistic goal suggestion"
                >
                   {isSuggesting ? (
                       <Loader />
                   ) : (
                       <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                           <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                       </svg>
                   )}
                   <span>Suggest a Goal</span>
                </button>
            </div>
            <div className="relative">
                <input
                    id="goal-score"
                    type="number"
                    min="0"
                    max="100"
                    value={localGoal}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="w-full pl-4 pr-12 py-2 bg-white/50 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                />
                <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-500 dark:text-slate-400 font-bold">%</span>
            </div>
            {suggestion && (
                <p className="text-xs text-slate-500 dark:text-slate-400 italic">
                   <strong>AI says:</strong> {suggestion}
                </p>
            )}
        </div>
    );
};

export default GoalSetter;
