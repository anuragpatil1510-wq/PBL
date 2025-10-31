
import React, { useState, useEffect, useRef } from 'react';
import { explainConcept } from '../services/geminiService';
import Loader from './Loader';
import type { Theme } from '../types';

declare global {
    interface Window {
        mermaid: any;
    }
}
type ExplainType = 'simple' | 'analogy' | 'visualize';

interface ConceptExplainerProps {
    isOpen: boolean;
    onClose: () => void;
    concept: string;
    theme: Theme;
}

const ConceptExplainer: React.FC<ConceptExplainerProps> = ({ isOpen, onClose, concept, theme }) => {
    const [explanation, setExplanation] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [currentType, setCurrentType] = useState<ExplainType | null>(null);
    const mermaidRef = useRef<HTMLDivElement>(null);

    const handleExplain = async (type: ExplainType) => {
        setIsLoading(true);
        setExplanation('');
        setCurrentType(type);
        try {
            const result = await explainConcept(concept, type);
            setExplanation(result);
        } catch (error) {
            setExplanation('Sorry, I couldn\'t generate an explanation at this time.');
        } finally {
            setIsLoading(false);
        }
    };
    
    useEffect(() => {
        if(currentType === 'visualize' && explanation && mermaidRef.current) {
            try {
                // Ensure mermaid code is clean
                const cleanCode = explanation.replace(/```mermaid|```/g, '').trim();
                window.mermaid.initialize({ startOnLoad: false, theme: theme === 'dark' ? 'dark' : 'default', securityLevel: 'loose' });
                window.mermaid.render('mermaid-graph', cleanCode, (svgCode: string) => {
                    if (mermaidRef.current) {
                      mermaidRef.current.innerHTML = svgCode;
                    }
                });
            } catch(e) {
                console.error("Mermaid rendering error:", e);
                if (mermaidRef.current) {
                    mermaidRef.current.innerText = "Could not render diagram.";
                }
            }
        }
    }, [explanation, currentType, theme]);

    useEffect(() => {
      // Reset state when modal opens for a new concept
      if (isOpen) {
        setExplanation('');
        setCurrentType(null);
      }
    }, [isOpen, concept]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4" onClick={onClose}>
            <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/30 dark:border-slate-700/50 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <header className="p-4 border-b border-slate-200/80 dark:border-slate-700/50 flex-shrink-0">
                    <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Concept Explainer: <span className="text-teal-600 dark:text-teal-400">{concept}</span></h2>
                </header>
                <div className="p-4 flex-shrink-0 flex items-center justify-center space-x-2 bg-white/20 dark:bg-slate-800/30">
                    {(['simple', 'analogy', 'visualize'] as ExplainType[]).map(type => (
                        <button key={type} onClick={() => handleExplain(type)} className={`capitalize px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${currentType === type ? 'bg-teal-600 text-white' : 'bg-white/50 dark:bg-slate-700/50'}`}>
                            {type}
                        </button>
                    ))}
                </div>
                <div className="p-6 flex-1 overflow-y-auto">
                    {isLoading ? (
                        <div className="flex justify-center items-center h-full">
                            <Loader isLarge />
                        </div>
                    ) : (
                        currentType === 'visualize' ? (
                            <div ref={mermaidRef} className="flex justify-center items-center w-full min-h-[200px]" id="mermaid-container"></div>
                        ) : (
                            <p className="whitespace-pre-wrap text-slate-700 dark:text-slate-300">{explanation}</p>
                        )
                    )}
                </div>
                 <footer className="p-4 border-t border-slate-200/80 dark:border-slate-700/50 flex justify-end">
                    <button onClick={onClose} className="px-4 py-2 font-semibold text-slate-700 dark:text-slate-200 bg-white/40 dark:bg-slate-700/50 rounded-lg hover:bg-white/80 dark:hover:bg-slate-600/50">Close</button>
                </footer>
            </div>
        </div>
    );
};

export default ConceptExplainer;