import React, { useState, useCallback } from 'react';
import type { StudentData, PredictionResult, UserProfile } from '../types';
import { PARAMETERS } from '../constants';
import { getPerformancePrediction } from '../services/geminiService';
import ParameterSlider from './ParameterSlider';
import Loader from './Loader';

interface ScenarioExplorerProps {
    studentData: StudentData;
    prediction: PredictionResult;
    userProfile: UserProfile;
}

const ScenarioExplorer: React.FC<ScenarioExplorerProps> = ({ studentData, prediction, userProfile }) => {
    const [scenarioData, setScenarioData] = useState<StudentData>(studentData);
    const [scenarioResult, setScenarioResult] = useState<PredictionResult | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleSliderChange = useCallback((field: keyof StudentData, value: number) => {
        setScenarioData(prevData => ({ ...prevData, [field]: value }));
    }, []);

    const handleRunScenario = async () => {
        setIsLoading(true);
        setError(null);
        setScenarioResult(null);
        try {
            const result = await getPerformancePrediction(scenarioData, userProfile);
            setScenarioResult(result);
        } catch (err) {
            setError('Failed to get scenario prediction. Please try again.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };
    
    const ResultCard: React.FC<{title: string; score: number; level: string, delta?: number}> = ({title, score, level, delta}) => {
        
        const getDeltaColor = () => {
            if (!delta || delta === 0) return 'text-slate-500 dark:text-slate-400';
            return delta > 0 ? 'text-green-500' : 'text-red-500';
        };

        const deltaSign = delta && delta > 0 ? '+' : '';

        return (
            <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-white/30 dark:border-slate-700/50 p-6 rounded-xl shadow-lg flex-1">
                <h4 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">{title}</h4>
                <p className="text-5xl font-bold text-slate-900 dark:text-white">{score.toFixed(1)}%</p>
                <p className="font-semibold text-slate-600 dark:text-slate-300">{level}</p>
                {delta !== undefined && (
                     <p className={`mt-2 text-xl font-bold ${getDeltaColor()}`}>
                        {deltaSign}{delta.toFixed(1)}%
                    </p>
                )}
            </div>
        )
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-white/30 dark:border-slate-700/50 rounded-2xl shadow-lg p-6 space-y-4">
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">Scenario Parameters</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">Adjust the sliders below to create a "what-if" scenario. Then, run the AI analysis to see the potential impact on your performance.</p>
                {PARAMETERS.map((param) => (
                    <ParameterSlider
                        key={param.id}
                        label={param.label}
                        value={scenarioData[param.id]}
                        min={param.min}
                        max={param.max}
                        step={param.step}
                        onChange={(val) => handleSliderChange(param.id, val)}
                    />
                ))}
                 <button
                    onClick={handleRunScenario}
                    disabled={isLoading}
                    className="w-full bg-cyan-600 text-white font-bold py-3 px-4 rounded-lg shadow-lg shadow-cyan-500/30 hover:bg-cyan-700 transition-all duration-300 flex items-center justify-center space-x-2"
                >
                    {isLoading ? <Loader /> :  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>}
                    <span>{isLoading ? 'Analyzing Scenario...' : 'Run Scenario Analysis'}</span>
                </button>
            </div>
            <div className="space-y-6">
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">Comparison</h3>
                <div className="flex flex-col sm:flex-row gap-6">
                   <ResultCard title="Current Prediction" score={prediction.predictedScore} level={prediction.performanceLevel} />
                   {scenarioResult && !isLoading && (
                        <ResultCard 
                            title="Scenario Prediction" 
                            score={scenarioResult.predictedScore} 
                            level={scenarioResult.performanceLevel}
                            delta={scenarioResult.predictedScore - prediction.predictedScore}
                        />
                   )}
                </div>
                 {isLoading && (
                    <div className="text-center p-6 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-white/30 dark:border-slate-700/50 rounded-xl shadow-lg">
                        <Loader isLarge />
                        <p className="mt-2 font-semibold text-cyan-600 dark:text-cyan-400">AI is calculating the scenario outcome...</p>
                    </div>
                 )}
                 {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-lg" role="alert">
                        <p className="font-bold">Scenario Error</p>
                        <p>{error}</p>
                    </div>
                )}
                 {scenarioResult && !isLoading && (
                    <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-white/30 dark:border-slate-700/50 p-6 rounded-xl shadow-lg">
                        <h4 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">Key Takeaways from Scenario</h4>
                         <ul className="space-y-2 list-disc list-inside">
                            {scenarioResult.recommendations.map((rec, index) => (
                                <li key={index} className="text-sm text-slate-700 dark:text-slate-300">{rec.replace(/(\p{Emoji})/u, '').trim()}</li>
                            ))}
                        </ul>
                    </div>
                 )}
            </div>
        </div>
    );
};

export default ScenarioExplorer;