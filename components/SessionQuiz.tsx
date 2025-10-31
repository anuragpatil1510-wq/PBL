
import React, { useState } from 'react';
import type { QuizQuestion } from '../types';

interface SessionQuizProps {
    quiz: QuizQuestion[];
    onComplete: (bonusPoints: number) => void;
}

const SessionQuiz: React.FC<SessionQuizProps> = ({ quiz, onComplete }) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [score, setScore] = useState(0);
    
    const currentQuestion = quiz[currentQuestionIndex];
    const isFinished = currentQuestionIndex >= quiz.length;

    const handleAnswerSelect = (option: string) => {
        if (selectedAnswer) return; // Prevent changing answer

        setSelectedAnswer(option);
        const correct = option === currentQuestion.correctAnswer;
        setIsCorrect(correct);
        if (correct) {
            setScore(prev => prev + 1);
        }
    };
    
    const handleNextQuestion = () => {
        setSelectedAnswer(null);
        setIsCorrect(null);
        setCurrentQuestionIndex(prev => prev + 1);
    };

    const handleFinish = () => {
        const bonusPoints = score * 5; // 5 points per correct answer
        onComplete(bonusPoints);
    };

    const getButtonClass = (option: string) => {
        if (!selectedAnswer) {
            return "bg-white/40 dark:bg-slate-800/50 hover:bg-white/80 dark:hover:bg-slate-700/50";
        }
        if (option === currentQuestion.correctAnswer) {
            return "bg-green-500/30 border-green-500 text-green-800 dark:text-green-300";
        }
        if (option === selectedAnswer && !isCorrect) {
            return "bg-red-500/30 border-red-500 text-red-800 dark:text-red-300";
        }
        return "bg-white/40 dark:bg-slate-800/50 opacity-50";
    };

    return (
        <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-white/30 dark:border-slate-700/50 rounded-2xl shadow-lg p-6 sm:p-8 w-full max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">Knowledge Check</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-6">Let's see what you've learned!</p>
            
            {isFinished ? (
                <div className="text-center">
                    <h3 className="text-xl font-bold">Quiz Complete!</h3>
                    <p className="text-3xl font-bold my-4">{score} / {quiz.length}</p>
                    <p>You've earned {score * 5} bonus Study Points!</p>
                    <button onClick={handleFinish} className="mt-6 w-full bg-teal-600 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:bg-teal-700 transition-colors">
                        Finish Session
                    </button>
                </div>
            ) : (
                <div>
                    <p className="text-sm text-slate-500">Question {currentQuestionIndex + 1} of {quiz.length}</p>
                    <h3 className="font-semibold text-lg my-2">{currentQuestion.question}</h3>
                    <div className="space-y-3 mt-4">
                        {currentQuestion.options.map((option, index) => (
                            <button
                                key={index}
                                onClick={() => handleAnswerSelect(option)}
                                disabled={!!selectedAnswer}
                                className={`w-full text-left p-3 rounded-lg border transition-all ${getButtonClass(option)}`}
                            >
                                {option}
                            </button>
                        ))}
                    </div>

                    {selectedAnswer && (
                        <div className="mt-6 text-center">
                            <p className={`font-bold ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                                {isCorrect ? "Correct!" : "Not quite."}
                            </p>
                            <button onClick={handleNextQuestion} className="mt-2 w-full bg-teal-600 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:bg-teal-700 transition-colors">
                                Next Question
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SessionQuiz;