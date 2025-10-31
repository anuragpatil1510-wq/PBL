
import React, { useState } from 'react';
import type { StudySessionSetup } from '../types';

interface StudySessionSetupProps {
    isOpen: boolean;
    onClose: () => void;
    onStart: (setup: StudySessionSetup) => void;
}

const StudySessionSetup: React.FC<StudySessionSetupProps> = ({ isOpen, onClose, onStart }) => {
    const [subject, setSubject] = useState('');
    const [duration, setDuration] = useState(45); // Default to 45 minutes
    const [goal, setGoal] = useState('');

    const handleStart = () => {
        if (subject.trim() && goal.trim()) {
            onStart({ subject, duration, goal });
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4" onClick={onClose}>
            <div 
                className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/30 dark:border-slate-700/50 rounded-2xl shadow-2xl w-full max-w-md"
                onClick={e => e.stopPropagation()}
            >
                <header className="p-4 border-b border-slate-200/80 dark:border-slate-700/50">
                    <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Set Up Your Study Session</h2>
                </header>
                <div className="p-6 space-y-4">
                    <div>
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Subject</label>
                        <input 
                            type="text" 
                            value={subject} 
                            onChange={e => setSubject(e.target.value)} 
                            placeholder="e.g., Calculus II" 
                            className="mt-1 w-full p-2 bg-white/50 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-2 focus:ring-teal-500" 
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Duration (minutes)</label>
                        <div className="mt-1 flex space-x-2">
                            {[25, 45, 60, 90].map(d => (
                                <button key={d} onClick={() => setDuration(d)} className={`flex-1 py-2 rounded-md font-semibold ${duration === d ? 'bg-teal-600 text-white' : 'bg-white/40 dark:bg-slate-800/50'}`}>{d}</button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">What's your main goal for this session?</label>
                        <input type="text" value={goal} onChange={e => setGoal(e.target.value)} placeholder="e.g., Understand derivatives" className="mt-1 w-full p-2 bg-white/50 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-2 focus:ring-teal-500" />
                    </div>
                </div>
                <footer className="p-4 border-t border-slate-200/80 dark:border-slate-700/50 flex justify-end space-x-2">
                    <button onClick={onClose} className="px-4 py-2 font-semibold text-slate-700 dark:text-slate-200 bg-white/40 dark:bg-slate-700/50 rounded-lg hover:bg-white/80 dark:hover:bg-slate-600/50">Cancel</button>
                    <button onClick={handleStart} disabled={!subject.trim() || !goal.trim()} className="px-4 py-2 font-semibold text-white bg-teal-600 rounded-lg hover:bg-teal-700 disabled:bg-teal-400">Start Session</button>
                </footer>
            </div>
        </div>
    );
};

export default StudySessionSetup;