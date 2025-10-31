import React, { useState, useEffect } from 'react';

const PomodoroTimer: React.FC<{ onSessionComplete: () => void }> = ({ onSessionComplete }) => {
    const [minutes, setMinutes] = useState(25);
    const [seconds, setSeconds] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [isBreak, setIsBreak] = useState(false);
    const [sessionCount, setSessionCount] = useState(0);

    useEffect(() => {
        // FIX: Changed NodeJS.Timeout to ReturnType<typeof setInterval> for browser compatibility.
        let interval: ReturnType<typeof setInterval> | null = null;
        if (isActive) {
            interval = setInterval(() => {
                if (seconds > 0) {
                    setSeconds(seconds - 1);
                }
                if (seconds === 0) {
                    if (minutes === 0) {
                        if (isBreak) { // Break is over
                            setIsBreak(false);
                            setMinutes(25);
                        } else { // Work session is over
                            setIsBreak(true);
                            setMinutes(5);
                            setSessionCount(prev => prev + 1);
                            onSessionComplete();
                        }
                    } else {
                        setMinutes(minutes - 1);
                        setSeconds(59);
                    }
                }
            }, 1000);
        } else if (!isActive && seconds !== 0) {
            clearInterval(interval!);
        }
        return () => clearInterval(interval!);
    }, [isActive, seconds, minutes, isBreak, onSessionComplete]);

    const toggle = () => setIsActive(!isActive);

    const reset = () => {
        setIsActive(false);
        setIsBreak(false);
        setMinutes(25);
        setSeconds(0);
    };

    const radius = 90;
    const circumference = 2 * Math.PI * radius;
    const totalSeconds = (isBreak ? 5 : 25) * 60;
    const remainingSeconds = minutes * 60 + seconds;
    const offset = circumference - (remainingSeconds / totalSeconds) * circumference;

    return (
        <div className="p-6 bg-white/20 dark:bg-slate-900/30 backdrop-blur-sm border border-white/20 dark:border-slate-700/30 rounded-xl text-center">
            <h3 className="text-xl font-bold text-teal-700 dark:text-teal-300 mb-4">{isBreak ? "Break Time!" : "Focus Time"}</h3>
            <div className="relative w-52 h-52 mx-auto">
                <svg className="w-full h-full transform -rotate-90">
                    <circle className="text-slate-200/50 dark:text-slate-700/50" strokeWidth="12" stroke="currentColor" fill="transparent" r={radius} cx="104" cy="104" />
                    <circle 
                        className={isBreak ? "text-green-500" : "text-teal-600"}
                        strokeWidth="12"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="transparent"
                        r={radius}
                        cx="104"
                        cy="104"
                        style={{ transition: 'stroke-dashoffset 0.5s linear' }}
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-5xl font-bold text-slate-800 dark:text-slate-100">
                        {minutes < 10 ? `0${minutes}` : minutes}:{seconds < 10 ? `0${seconds}` : seconds}
                    </p>
                </div>
            </div>
            <div className="flex justify-center space-x-4 mt-6">
                <button onClick={toggle} className={`px-8 py-3 font-bold rounded-lg text-white shadow-md ${isActive ? 'bg-amber-500 hover:bg-amber-600' : 'bg-teal-600 hover:bg-teal-700'}`}>
                    {isActive ? 'Pause' : 'Start'}
                </button>
                <button onClick={reset} className="px-8 py-3 font-bold rounded-lg bg-slate-200/50 dark:bg-slate-700/50 text-slate-800 dark:text-slate-200 hover:bg-slate-300/50 dark:hover:bg-slate-600/50">
                    Reset
                </button>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-4">Completed sessions: {sessionCount}</p>
        </div>
    );
};

export default PomodoroTimer;