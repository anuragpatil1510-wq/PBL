import React from 'react';
import type { StudentData, Parameter, UserProfile, Theme, HistoricalEntry } from '../types';
import ParameterSlider from './ParameterSlider';
import Loader from './Loader';
import UserMenu from './UserMenu';
import HistoricalTrends from './HistoricalTrends';

interface InputSidebarProps {
  studentData: StudentData;
  parameters: Parameter[];
  isLoading: boolean;
  predictionMade: boolean;
  onSliderChange: (field: keyof StudentData, value: number) => void;
  onPredict: () => void;
  onLogData: () => void;
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  onSettingsClick: () => void;
  onStartSession: () => void;
}

const InputSidebar: React.FC<InputSidebarProps> = ({
  studentData,
  parameters,
  isLoading,
  predictionMade,
  onSliderChange,
  onPredict,
  onLogData,
  isOpen,
  onClose,
  userProfile,
  theme,
  setTheme,
  onSettingsClick,
  onStartSession,
}) => {
  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/30 z-30 lg:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      <aside 
        className={`fixed top-0 left-0 h-full w-80 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border-r border-white/30 dark:border-slate-700/50 flex flex-col transition-transform duration-300 ease-in-out z-40 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <header className="p-4 border-b border-slate-200/80 dark:border-slate-700/50 flex justify-between items-center flex-shrink-0">
            <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-br from-teal-500 to-cyan-600 p-2 rounded-lg shadow-md">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                </div>
                <h1 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                  Learnlytics
                </h1>
            </div>
            <button onClick={onClose} className="lg:hidden text-slate-500 hover:text-slate-800 dark:hover:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
        </header>

        <div className="flex-1 overflow-y-auto p-4 space-y-4" data-tour-step="1">
            <h2 className="text-base font-bold text-slate-700 dark:text-slate-200">Input Parameters</h2>
            {parameters.map((param) => (
              <ParameterSlider
                key={param.id}
                label={param.label}
                value={studentData[param.id]}
                min={param.min}
                max={param.max}
                step={param.step}
                onChange={(val) => onSliderChange(param.id, val)}
              />
            ))}
        </div>

        <footer className="p-4 border-t border-slate-200/80 dark:border-slate-700/50 mt-auto flex-shrink-0 space-y-3">
            <button 
                onClick={onStartSession}
                className="w-full bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:from-cyan-600 hover:to-teal-600 transition-all duration-300 flex items-center justify-center space-x-2"
                data-tour-step="5"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z" /><path fillRule="evenodd" d="M.458 10C3.732 4.943 9.522 3 10 3s6.268 1.943 9.542 7c-3.274 5.057-9.064 7-9.542 7S3.732 15.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" /></svg>
                <span>Start Study Session</span>
            </button>
             <div className="flex items-center justify-between bg-white/20 dark:bg-slate-900/30 p-2 rounded-lg">
                <div className="text-sm font-bold">
                    <span className="text-amber-500">SP:</span> {userProfile.points}
                </div>
                <UserMenu 
                    user={userProfile} 
                    theme={theme} 
                    setTheme={setTheme} 
                    onSettingsClick={onSettingsClick}
                />
            </div>
            <div className="flex space-x-2">
                <button
                    onClick={onPredict}
                    disabled={isLoading}
                    className="flex-1 bg-teal-600 text-white font-bold py-3 px-4 rounded-lg shadow-lg shadow-teal-500/30 hover:bg-teal-700 transition-all duration-300 flex items-center justify-center space-x-2"
                    data-tour-step="2"
                >
                    {isLoading ? <Loader /> :  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M13 7a1 1 0 10-2 0v1a1 1 0 102 0V7zM6 7a1 1 0 11-2 0v1a1 1 0 112 0V7z" /><path fillRule="evenodd" d="M7 2a1 1 0 011 1v1h4V3a1 1 0 112 0v1h1a2 2 0 012 2v11a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2h1V3a1 1 0 011-1zM5 8h10v9H5V8z" clipRule="evenodd" /></svg>}
                    <span>{isLoading ? 'Analyzing...' : 'Predict Performance'}</span>
                </button>
                {predictionMade && (
                    <button onClick={onLogData} title="Log Current Data" className="p-3 bg-white/40 dark:bg-slate-800/60 rounded-lg hover:bg-white/80 dark:hover:bg-slate-700/80">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2H4zm1 4a1 1 0 100 2h8a1 1 0 100-2H5zm0 4a1 1 0 100 2h4a1 1 0 100-2H5z" clipRule="evenodd" /></svg>
                    </button>
                )}
            </div>
        </footer>
      </aside>
    </>
  );
};

export default InputSidebar;
