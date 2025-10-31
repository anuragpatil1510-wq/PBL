
import React, { useState } from 'react';
import type { StudentData, Parameter, UserProfile } from '../types';
import ParameterSlider from './ParameterSlider';
import Loader from './Loader';
// FIX: Import the PARAMETERS constant from the constants file to resolve the "Cannot find name 'PARAMETERS'" error.
import { PARAMETERS } from '../constants';

interface ControlPanelProps {
  studentData: StudentData;
  onSliderChange: (field: keyof StudentData, value: number) => void;
  onPredict: () => void;
  onLogData: () => void;
  onStartSession: () => void;
  isLoading: boolean;
  predictionMade: boolean;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  studentData,
  onSliderChange,
  onPredict,
  onLogData,
  onStartSession,
  isLoading,
  predictionMade,
}) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-white/30 dark:border-slate-700/50 rounded-2xl shadow-lg transition-all duration-300">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 flex justify-between items-center"
      >
        <div className="flex items-center space-x-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-teal-600 dark:text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 16v-2m0-10v2m0 6v2M6 12H4m16 0h-2m-10 0h2m6 0h2M9 18l-2-2m10-10l-2-2M9 6l2-2m-2 14l2-2m10-2l-2 2m-2-10l-2 2" /></svg>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Control Panel</h2>
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-6 w-6 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      <div
        className={`grid transition-all duration-500 ease-in-out ${
          isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <div className="p-4 pt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-200/80 dark:border-slate-700/50 pt-4">
              {PARAMETERS.map((param) => (
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
            <div className="mt-4 pt-4 border-t border-slate-200/80 dark:border-slate-700/50 space-y-3">
              <button 
                  onClick={onStartSession}
                  className="w-full bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:from-cyan-600 hover:to-teal-600 transition-all duration-300 flex items-center justify-center space-x-2"
              >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z" /><path fillRule="evenodd" d="M.458 10C3.732 4.943 9.522 3 10 3s6.268 1.943 9.542 7c-3.274 5.057-9.064 7-9.542 7S3.732 15.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" /></svg>
                  <span>Start Study Session</span>
              </button>
              <div className="flex space-x-2">
                <button
                    onClick={onPredict}
                    disabled={isLoading}
                    className="flex-1 bg-teal-600 text-white font-bold py-3 px-4 rounded-lg shadow-lg shadow-teal-500/30 hover:bg-teal-700 transition-all duration-300 flex items-center justify-center space-x-2"
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;
