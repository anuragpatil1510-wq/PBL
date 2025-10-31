import React from 'react';
import PomodoroTimer from './PomodoroTimer';
import type { StudyTask } from '../types';
import { POINTS_SYSTEM } from '../constants';

interface FocusModeProps {
    onExit: () => void;
    studyPlan: StudyTask[] | null;
    unlockAchievement: (id: string) => void;
    addPoints: (points: number, message: string) => void;
}

const FocusMode: React.FC<FocusModeProps> = ({ onExit, studyPlan, unlockAchievement, addPoints }) => {

    const getCurrentTask = (): StudyTask | null => {
        if (!studyPlan || studyPlan.length === 0) return null;
        
        const now = new Date();
        const dayOfWeek = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(now);
        const currentTime = now.getHours() * 60 + now.getMinutes();

        const currentTask = studyPlan.find(task => {
            if (task.day !== dayOfWeek) return false;
            
            const [startTime, endTime] = task.time.split(' - ');
            
            const parseTime = (timeStr: string) => {
                const [time, period] = timeStr.split(' ');
                let [hours, minutes] = time.split(':').map(Number);
                if (period === 'PM' && hours !== 12) hours += 12;
                if (period === 'AM' && hours === 12) hours = 0;
                return hours * 60 + minutes;
            };

            const startMinutes = parseTime(startTime);
            const endMinutes = parseTime(endTime);
            
            return currentTime >= startMinutes && currentTime < endMinutes;
        });

        return currentTask || studyPlan.find(task => task.priority === 'High') || studyPlan[0];
    };
    
    const currentTask = getCurrentTask();

    return (
        <div className="fixed inset-0 bg-slate-900 z-[100] flex flex-col justify-center items-center text-white p-4">
            <button onClick={onExit} className="absolute top-4 right-4 text-slate-400 hover:text-white flex items-center space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span>Exit Focus Mode</span>
            </button>
            
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold">Focus Mode</h1>
                <p className="text-slate-400">Minimize distractions. Maximize productivity.</p>
            </div>
            
            <div className="w-full max-w-md bg-slate-800/50 rounded-2xl p-8">
                {currentTask && (
                    <div className="mb-8 text-center border-b border-slate-700 pb-6">
                        <p className="text-sm text-teal-400 font-semibold">CURRENT TASK</p>
                        <p className="text-xl font-bold">{currentTask.subject}: {currentTask.task}</p>
                    </div>
                )}
                 <PomodoroTimer onSessionComplete={() => {
                    unlockAchievement('focused');
                    addPoints(POINTS_SYSTEM.completePomodoro, 'Completed a Pomodoro session');
                }} />
            </div>
            
        </div>
    );
};

export default FocusMode;
