import React, { useState } from 'react';
import type { PredictionResult, PlannerInput, StudyTask, UserProfile } from '../types';
import { getStudyPlan } from '../services/geminiService';
import Loader from './Loader';

interface StudyPlannerProps {
    prediction: PredictionResult | null;
    userProfile: UserProfile;
    studyPlan: StudyTask[] | null;
    setStudyPlan: (plan: StudyTask[] | null) => void;
}

interface PlannerFormState {
    subjects: string;
    examDates: string;
    weeklyHours: number;
}

const StudyPlanner: React.FC<StudyPlannerProps> = ({ prediction, userProfile, studyPlan, setStudyPlan }) => {
    const [plannerInput, setPlannerInput] = useState<PlannerFormState>({
        subjects: userProfile.courses.map(c => c.name).join(', ') || prediction?.subjectBreakdown.map(s => s.subject).join(', ') || '',
        examDates: '',
        weeklyHours: 15,
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGeneratePlan = async () => {
        setIsLoading(true);
        setError(null);
        setStudyPlan(null);
        try {
            const fullInput: PlannerInput = {
                ...plannerInput,
                subjects: plannerInput.subjects.split(',').map(s => s.trim()).filter(s => s),
                weaknesses: prediction?.weaknesses || [],
                learningStyle: userProfile.learningStyle,
            };
            const plan = await getStudyPlan(fullInput);
            setStudyPlan(plan);
        } catch (err) {
            setError("Failed to generate a study plan. Please try again.");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setPlannerInput(prev => ({ ...prev, [name]: name === 'weeklyHours' ? parseInt(value, 10) : value }));
    };

    const priorityColors = {
        High: 'bg-red-500',
        Medium: 'bg-amber-500',
        Low: 'bg-sky-500',
    };

    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    return (
        <div className="space-y-4">
            <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-white/30 dark:border-slate-700/50 rounded-2xl shadow-lg p-6 space-y-4">
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">Study Plan Generator</h3>
                <div>
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Subjects (comma-separated)</label>
                    <textarea name="subjects" value={plannerInput.subjects} onChange={handleInputChange} rows={3} className="mt-1 w-full p-2 bg-white/50 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-2 focus:ring-teal-500" />
                </div>
                <div>
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Exam Dates / Key Deadlines</label>
                    <input type="text" name="examDates" value={plannerInput.examDates} onChange={handleInputChange} placeholder="e.g., Math Final on Dec 15th" className="mt-1 w-full p-2 bg-white/50 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-2 focus:ring-teal-500" />
                </div>
                <div>
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Target Weekly Study Hours</label>
                    <input type="number" name="weeklyHours" value={plannerInput.weeklyHours} onChange={handleInputChange} className="mt-1 w-full p-2 bg-white/50 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-2 focus:ring-teal-500" />
                </div>
                <button onClick={handleGeneratePlan} disabled={isLoading} className="w-full bg-teal-600 text-white font-bold py-3 px-4 rounded-lg shadow-lg shadow-teal-500/30 hover:bg-teal-700 transition-all duration-300 flex items-center justify-center space-x-2">
                    {isLoading ? <Loader /> : <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" /></svg>}
                    <span>{isLoading ? 'Generating Plan...' : 'Generate AI Study Plan'}</span>
                </button>
                 {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            </div>

            <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-white/30 dark:border-slate-700/50 rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">Your Weekly Study Agenda</h3>
                {isLoading ? (
                    <div className="flex justify-center items-center h-64"><Loader isLarge /></div>
                ) : studyPlan ? (
                    <div className="space-y-6">
                        {daysOfWeek.map(day => {
                            const tasksForDay = studyPlan.filter(task => task.day === day);
                            if (tasksForDay.length === 0) return null;
                            return (
                                <div key={day}>
                                    <h4 className="font-bold text-slate-700 dark:text-slate-200 border-b border-slate-300/50 dark:border-slate-600/50 pb-1 mb-2">{day}</h4>
                                    <div className="space-y-2">
                                        {tasksForDay.map((task, index) => (
                                            <div key={index} className="p-3 bg-white/20 dark:bg-slate-900/30 rounded-lg flex items-start space-x-3">
                                                <div className={`w-2 h-2 ${priorityColors[task.priority]} rounded-full mt-1.5 flex-shrink-0`}></div>
                                                <div className="flex-1">
                                                    <p className="font-semibold text-sm text-slate-800 dark:text-slate-200">{task.subject}: <span className="font-normal">{task.task}</span></p>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400">{task.time}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                ) : (
                    <div className="text-center py-16 text-slate-500 dark:text-slate-400">
                        <p>Your personalized study plan will appear here.</p>
                        <p className="text-sm">Fill in your details and let AI build your schedule!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudyPlanner;
