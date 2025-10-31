import React, { useState } from 'react';
import { getFlashcards } from '../services/geminiService';
import type { Flashcard } from '../types';
import Loader from './Loader';

const FlashcardGenerator: React.FC<{ onFlashcardsGenerated: () => void }> = ({ onFlashcardsGenerated }) => {
    const [topic, setTopic] = useState('');
    const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [flippedCard, setFlippedCard] = useState<number | null>(null);

    const handleGenerate = async () => {
        if (!topic.trim()) return;
        setIsLoading(true);
        setError(null);
        setFlashcards([]);
        try {
            const cards = await getFlashcards(topic);
            setFlashcards(cards);
            onFlashcardsGenerated();
        } catch (err) {
            setError('Could not generate flashcards. Please try another topic.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-6 bg-white/20 dark:bg-slate-900/30 backdrop-blur-sm border border-white/20 dark:border-slate-700/30 rounded-xl space-y-4">
            <h3 className="text-xl font-bold text-teal-700 dark:text-teal-300">AI Flashcard Generator</h3>
            <div className="flex space-x-2">
                <input 
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Enter a topic (e.g., Photosynthesis)"
                    className="flex-1 bg-white/50 dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <button
                    onClick={handleGenerate}
                    disabled={isLoading}
                    className="px-6 py-2 font-bold rounded-lg text-white bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400 flex items-center justify-center shadow-md"
                >
                    {isLoading ? <Loader /> : 'Generate'}
                </button>
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}

            {flashcards.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {flashcards.map((card, index) => (
                        <div key={index} className="perspective-1000 h-48" onClick={() => setFlippedCard(flippedCard === index ? null : index)}>
                            <div className={`relative w-full h-full text-center transition-transform duration-500 transform-style-preserve-3d ${flippedCard === index ? 'rotate-y-180' : ''}`}>
                                {/* Front */}
                                <div className="absolute w-full h-full backface-hidden bg-white/50 dark:bg-slate-700/50 rounded-lg shadow-md p-4 flex flex-col justify-center items-center border border-slate-200/50 dark:border-slate-600/50">
                                    <p className="text-xs text-slate-500 dark:text-slate-400">Question</p>
                                    <p className="font-semibold text-slate-800 dark:text-slate-200">{card.question}</p>
                                </div>
                                {/* Back */}
                                <div className="absolute w-full h-full backface-hidden bg-teal-100/50 dark:bg-teal-900/50 rounded-lg shadow-md p-4 flex flex-col justify-center items-center rotate-y-180 border border-teal-200/50 dark:border-teal-700/50">
                                    <p className="text-xs text-teal-500 dark:text-teal-400">Answer</p>
                                    <p className="font-semibold text-teal-800 dark:text-teal-200">{card.answer}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FlashcardGenerator;