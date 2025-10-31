import React, { useState } from 'react';
import PomodoroTimer from './PomodoroTimer';
import FlashcardGenerator from './FlashcardGenerator';
import { POINTS_SYSTEM } from '../constants';
import { StudyTask } from '../types';

interface StudyToolsProps {
    unlockAchievement: (id: string) => void;
    addPoints: (points: number, message: string) => void;
    onEnterFocus: () => void;
    studyPlan: StudyTask[] | null;
}

type ToolView = 'pomodoro' | 'flashcards';

const StudyTools: React.FC<StudyToolsProps> = ({ unlockAchievement, addPoints, onEnterFocus }) => {
    const [view, setView] = useState<ToolView>('pomodoro');

    const NavButton: React.FC<{tool: ToolView, label: string}> = ({tool, label}) => (
        <button
            onClick={() => setView(tool)}
            className={`px-4 py-2 font-semibold rounded-lg transition-colors text-sm ${
                view === tool 
                ? 'bg-teal-600 text-white shadow-md' 
                : 'bg-white/20 dark:bg-slate-900/30 text-slate-700 dark:text-slate-200 hover:bg-white/40 dark:hover:bg-slate-900/50'
            }`}
        >
            {label}
        </button>
    );

    return (
        <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-white/30 dark:border-slate-700/50 rounded-2xl shadow-lg p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Study Tools</h2>
                <div className="flex space-x-2 p-1 bg-slate-200/50 dark:bg-slate-800/50 rounded-lg">
                    <NavButton tool="pomodoro" label="Pomodoro Timer" />
                    <NavButton tool="flashcards" label="AI Flashcards" />
                </div>
            </div>
            
            <button 
                onClick={onEnterFocus}
                className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-slate-800 text-white font-bold rounded-lg shadow-lg hover:bg-slate-900 transition-all duration-300"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fillRule="evenodd" d="M.458 10C3.732 4.943 9.522 3 10 3s6.268 1.943 9.542 7c-3.274 5.057-9.064 7-9.542 7S3.732 15.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                </svg>
                <span>Enter Focus Mode</span>
            </button>

            <div>
                {view === 'pomodoro' && <PomodoroTimer onSessionComplete={() => {
                    unlockAchievement('focused');
                    addPoints(POINTS_SYSTEM.completePomodoro, 'Completed a Pomodoro session');
                }} />}
                {view === 'flashcards' && <FlashcardGenerator onFlashcardsGenerated={() => {
                    unlockAchievement('quickLearner');
                    addPoints(POINTS_SYSTEM.generateFlashcards, 'Generated flashcards');
                }} />}
            </div>
        </div>
    );
};

export default StudyTools;
