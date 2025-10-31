
import React, { useEffect, useState, useRef } from 'react';
import type { StudentData, PredictionResult, DashboardComponentId } from '../types';
import RadialProgress from './RadialProgress';
import StrengthsWeaknesses from './StrengthsWeaknesses';
import Recommendations from './Recommendations';
import SubjectBreakdown from './SubjectBreakdown';
import ResourceHub from './ResourceHub';
import Loader from './Loader';
import RadarChart from './RadarChart';
import ControlPanel from './ControlPanel';

interface PredictionDashboardProps {
  prediction: PredictionResult | null;
  studentData: StudentData;
  onSliderChange: (field: keyof StudentData, value: number) => void;
  onPredict: () => void;
  onLogData: () => void;
  onStartSession: () => void;
  goal: number;
  onGenerateReport: () => void;
  isGeneratingReport: boolean;
  personalBest: number;
  layout: DashboardComponentId[];
  setLayout: (newLayout: DashboardComponentId[]) => void;
  isEditingLayout: boolean;
}

const PredictionDashboard: React.FC<PredictionDashboardProps> = ({ 
    prediction, studentData, onSliderChange, onPredict, onLogData, onStartSession, goal, onGenerateReport, isGeneratingReport, personalBest, layout, setLayout, isEditingLayout 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, [prediction]);
  
  const handleDragSort = () => {
    if (dragItem.current === null || dragOverItem.current === null) return;
    
    const newLayout = [...layout];
    const draggedItemContent = newLayout.splice(dragItem.current, 1)[0];
    newLayout.splice(dragOverItem.current, 0, draggedItemContent);
    
    dragItem.current = null;
    dragOverItem.current = null;
    
    setLayout(newLayout);
  };
  
  const cardBaseClass = "bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-white/30 dark:border-slate-700/50 rounded-2xl shadow-lg transition-all duration-500 ease-out";
  const loadedClass = "opacity-100 translate-y-0";
  const notLoadedClass = "opacity-0 translate-y-4";
  const editModeClass = isEditingLayout ? "cursor-grab border-2 border-dashed border-teal-500" : "";
  
  if (!prediction) {
      return (
        <div className="space-y-6">
            <ControlPanel
                studentData={studentData}
                onSliderChange={onSliderChange}
                onPredict={onPredict}
                onLogData={onLogData}
                onStartSession={onStartSession}
                isLoading={false}
                predictionMade={false}
            />
            <div className="flex justify-center items-center h-[calc(100vh-400px)]">
                <div className="bg-white/20 dark:bg-slate-900/40 backdrop-blur-xl rounded-2xl shadow-lg p-12 text-center border border-white/30 dark:border-slate-700/50">
                    <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16 text-teal-400 dark:text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mt-4">Welcome to Learnlytics!</h3>
                    <p className="text-slate-600 dark:text-slate-400 mt-2 max-w-md">Adjust parameters in the Control Panel and click "Predict Performance" to begin.</p>
                </div>
            </div>
        </div>
      );
  }

  const getLevelColor = () => {
    const { predictedScore } = prediction;
    if (predictedScore >= 90) return 'text-green-400';
    if (predictedScore >= 80) return 'text-sky-400';
    if (predictedScore >= 70) return 'text-yellow-400';
    if (predictedScore >= 60) return 'text-orange-400';
    return 'text-red-400';
  };
  
  const KpiCard: React.FC<{icon: React.ReactElement, label: string, value: string | number}> = ({icon, label, value}) => (
    <div className="bg-white/20 dark:bg-slate-900/30 backdrop-blur-sm rounded-lg p-3 flex items-center space-x-3 border border-white/20 dark:border-slate-700/30">
        <div className="text-teal-500 dark:text-teal-400">{icon}</div>
        <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{label}</p>
            <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{value}</p>
        </div>
    </div>
  );

  const components: Record<DashboardComponentId, React.ReactNode> = {
    main: (
      <div className={`${cardBaseClass} xl:col-span-3 p-6 flex flex-col md:flex-row items-center justify-between gap-6`}>
        <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
            <KpiCard icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>} label="Attendance" value={`${studentData.attendance}%`} />
            <KpiCard icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} label="Study Hours/Day" value={studentData.studyHours.toFixed(1)} />
            <KpiCard icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>} label="Assignment Score" value={`${studentData.assignmentScore}%`} />
            <KpiCard icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 14l9-5-9-5-9 5 9 5z" /><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-5.998 12.078 12.078 0 01.665-6.479L12 14z" /></svg>} label="Personal Best" value={`${personalBest.toFixed(1)}%`} />
        </div>
        <div className="relative text-center">
            <RadialProgress score={prediction.predictedScore} goal={goal} />
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Predicted Score</p>
                <p className="text-4xl font-bold text-slate-800 dark:text-slate-100">{prediction.predictedScore.toFixed(1)}%</p>
                <span className={`text-sm font-bold ${getLevelColor()}`}>{prediction.performanceLevel}</span>
            </div>
        </div>
      </div>
    ),
    radar: (
      <div className={`${cardBaseClass} xl:col-span-1 p-6 flex flex-col`}>
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4">Academic Profile</h3>
        <div className="flex-grow flex items-center justify-center">
            <RadarChart data={studentData} />
        </div>
      </div>
    ),
    strengthsWeaknesses: (
      <div className={`${cardBaseClass} xl:col-span-2 p-6`}>
        <StrengthsWeaknesses strengths={prediction.strengths} weaknesses={prediction.weaknesses} />
      </div>
    ),
    recommendations: (
      <div className={`${cardBaseClass} xl:col-span-3 p-6`}>
        <Recommendations recommendations={prediction.recommendations} />
      </div>
    ),
    breakdownAndActions: (
       <div className={`${cardBaseClass} xl:col-span-3 p-6 grid grid-cols-1 md:grid-cols-2 gap-6`}>
        <div className="space-y-4">
            <SubjectBreakdown subjects={prediction.subjectBreakdown} />
        </div>
        <div className="space-y-4">
             <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Actions</h3>
             <button onClick={onGenerateReport} disabled={isGeneratingReport} className="w-full text-left p-4 flex items-center space-x-4 bg-white/20 dark:bg-slate-900/30 hover:bg-white/40 dark:hover:bg-slate-900/50 rounded-lg transition-colors">
                <div className="p-3 bg-teal-500/20 text-teal-600 dark:text-teal-300 rounded-lg">{isGeneratingReport ? <Loader /> : <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}</div>
                <div><p className="font-bold">Generate Performance Report</p><p className="text-sm text-slate-600 dark:text-slate-400">Get a detailed PDF summary.</p></div>
            </button>
        </div>
      </div>
    ),
    resources: (
       <div className={`${cardBaseClass} xl:col-span-3 p-6`}>
        <ResourceHub resources={prediction.suggestedResources} />
       </div>
    ),
  };

  const getGridSpan = (id: DashboardComponentId) => {
    switch(id) {
        case 'main':
        case 'recommendations':
        case 'breakdownAndActions':
        case 'resources':
            return 'xl:col-span-3';
        case 'radar':
            return 'xl:col-span-1';
        case 'strengthsWeaknesses':
            return 'xl:col-span-2';
        default:
            return 'xl:col-span-3';
    }
  };

  return (
    <div className="space-y-6">
        <ControlPanel
            studentData={studentData}
            onSliderChange={onSliderChange}
            onPredict={onPredict}
            onLogData={onLogData}
            onStartSession={onStartSession}
            isLoading={false}
            predictionMade={!!prediction}
        />
        <div className={`grid grid-cols-1 xl:grid-cols-3 gap-6 ${isLoaded ? '' : 'opacity-0'}`}>
            {layout.map((id, index) => (
                <div
                    key={id}
                    draggable={isEditingLayout}
                    onDragStart={() => (dragItem.current = index)}
                    onDragEnter={() => (dragOverItem.current = index)}
                    onDragEnd={handleDragSort}
                    onDragOver={(e) => e.preventDefault()}
                    className={`${getGridSpan(id)} ${isLoaded ? loadedClass : notLoadedClass} ${editModeClass}`}
                    style={{ transitionDelay: `${(index + 1) * 100}ms` }}
                >
                    {components[id]}
                </div>
            ))}
        </div>
    </div>
  );
};

export default PredictionDashboard;
