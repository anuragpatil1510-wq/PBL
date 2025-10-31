
import React, { useState, useEffect } from 'react';
import type { SessionState, ChatMessage, Flashcard, Theme } from '../types';
import { getChatbotResponse, getFlashcards } from '../services/geminiService';
import Loader from './Loader';

interface StudySessionProps {
    sessionState: SessionState;
    onEndSession: () => void;
    onExplainConcept: (concept: string) => void;
    theme: Theme;
}

type SessionTool = 'assistant' | 'flashcards';

const StudySession: React.FC<StudySessionProps> = ({ sessionState, onEndSession, onExplainConcept, theme }) => {
    const { setup, resources } = sessionState;
    const [activeTool, setActiveTool] = useState<SessionTool>('assistant');
    
    const [timeLeft, setTimeLeft] = useState(setup.duration * 60);
    useEffect(() => {
        if (timeLeft <= 0) {
            onEndSession();
            return;
        }
        const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
        return () => clearInterval(timer);
    }, [timeLeft, onEndSession]);

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
    const [chatInput, setChatInput] = useState('');
    const [isBotTyping, setIsBotTyping] = useState(false);
    
    const handleSendMessage = async () => {
        if (!chatInput.trim()) return;
        const newMsg: ChatMessage = { id: Date.now().toString(), text: chatInput, sender: 'user' };
        setChatMessages(prev => [...prev, newMsg]);
        setChatInput('');
        setIsBotTyping(true);

        const context = `Studying ${setup.subject} with the goal: "${setup.goal}"`;
        const botResponse = await getChatbotResponse([...chatMessages, newMsg], chatInput, context);
        
        const botMsg: ChatMessage = { id: (Date.now() + 1).toString(), text: botResponse, sender: 'bot' };
        setChatMessages(prev => [...prev, botMsg]);
        setIsBotTyping(false);
    };

    const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [flippedCard, setFlippedCard] = useState<number | null>(null);

    const handleGenerateFlashcards = async () => {
        setIsGenerating(true);
        const cards = await getFlashcards(setup.subject);
        setFlashcards(cards);
        setIsGenerating(false);
    };

    const parseAndRenderContent = (content: string) => {
        const regex = /\[explain:([^\]]+)\]/g;
        const parts = content.split(regex);
    
        return parts.map((part, index) => {
          if (index % 2 === 1) { // This is the concept to be explained
            return (
              <button 
                key={index} 
                onClick={() => onExplainConcept(part)}
                className="font-bold text-teal-600 dark:text-teal-400 bg-teal-500/10 px-1 py-0.5 rounded-md hover:bg-teal-500/20 transition-colors"
              >
                {part}
              </button>
            );
          }
          return part;
        });
    };
    
    return (
        <div className="fixed inset-0 bg-slate-100 dark:bg-slate-900 z-[100] flex flex-col p-4 sm:p-6 lg:p-8">
            <header className="flex-shrink-0 flex justify-between items-center mb-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Study Session: <span className="text-teal-600 dark:text-teal-400">{setup.subject}</span></h1>
                    <p className="text-slate-500 dark:text-slate-400">Goal: {setup.goal}</p>
                </div>
                <button onClick={onEndSession} className="px-4 py-2 font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700">End Session</button>
            </header>
            
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-hidden">
                <div className="lg:col-span-2 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/30 dark:border-slate-700/50 rounded-2xl shadow-lg p-6 overflow-y-auto">
                    <h2 className="text-xl font-bold mb-4">AI-Curated Resources</h2>
                    <div className="space-y-4">
                        {resources.map((res, index) => (
                            <div key={index} className="p-4 bg-white/40 dark:bg-slate-800/50 rounded-lg">
                                <h3 className="font-bold text-teal-700 dark:text-teal-300">{res.title}</h3>
                                {res.type === 'video' ? (
                                    <a href={`https://www.youtube.com/results?search_query=${encodeURIComponent(res.content)}`} target="_blank" rel="noopener noreferrer" className="text-sm text-sky-600 hover:underline">{res.content}</a>
                                ) : (
                                    <p className="text-sm text-slate-600 dark:text-slate-300">{parseAndRenderContent(res.content)}</p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/30 dark:border-slate-700/50 rounded-2xl shadow-lg flex flex-col overflow-hidden">
                    <div className="p-4 border-b border-slate-200/80 dark:border-slate-700/50">
                        <div className="text-center">
                            <p className="text-sm text-slate-500">Time Remaining</p>
                            <p className="text-4xl font-bold">{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}</p>
                        </div>
                    </div>
                    
                    <div className="flex-shrink-0 border-b border-slate-200/80 dark:border-slate-700/50 flex">
                        <button onClick={() => setActiveTool('assistant')} className={`flex-1 p-3 font-semibold text-sm ${activeTool === 'assistant' ? 'text-teal-600 border-b-2 border-teal-600' : 'text-slate-500'}`}>AI Assistant</button>
                        <button onClick={() => setActiveTool('flashcards')} className={`flex-1 p-3 font-semibold text-sm ${activeTool === 'flashcards' ? 'text-teal-600 border-b-2 border-teal-600' : 'text-slate-500'}`}>Flashcards</button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4">
                        {activeTool === 'assistant' && (
                            <div className="flex flex-col h-full">
                                <div className="flex-1 space-y-2 overflow-y-auto pr-2">
                                     {chatMessages.map(msg => (
                                         <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                            <p className={`max-w-xs px-3 py-1.5 rounded-lg text-sm ${msg.sender === 'user' ? 'bg-teal-600 text-white' : 'bg-slate-200 dark:bg-slate-700'}`}>{msg.text}</p>
                                         </div>
                                     ))}
                                     {isBotTyping && <div className="text-sm text-slate-400 italic">AI is typing...</div>}
                                </div>
                                <div className="mt-2 flex space-x-2">
                                    <input type="text" value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleSendMessage()} placeholder="Ask a question..." className="flex-1 bg-slate-100 dark:bg-slate-700/50 border-transparent rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"/>
                                    <button onClick={handleSendMessage} className="bg-teal-600 text-white p-2 rounded-lg"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg></button>
                                </div>
                            </div>
                        )}
                        {activeTool === 'flashcards' && (
                            <div className="text-center">
                                <button onClick={handleGenerateFlashcards} disabled={isGenerating} className="w-full bg-cyan-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-cyan-700 transition-colors mb-4 flex items-center justify-center space-x-2">
                                    {isGenerating ? <Loader/> : <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" /><path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" /></svg>}
                                    <span>Generate Flashcards</span>
                                </button>
                                <div className="space-y-2">
                                     {flashcards.map((card, index) => (
                                        <div key={index} className="perspective-1000 h-24" onClick={() => setFlippedCard(flippedCard === index ? null : index)}>
                                            <div className={`relative w-full h-full text-center transition-transform duration-500 transform-style-preserve-3d ${flippedCard === index ? 'rotate-y-180' : ''}`}>
                                                <div className="absolute w-full h-full backface-hidden bg-slate-200 dark:bg-slate-700 rounded-lg p-2 flex items-center justify-center"><p className="text-sm font-semibold">{card.question}</p></div>
                                                <div className="absolute w-full h-full backface-hidden bg-teal-200 dark:bg-teal-800 rounded-lg p-2 flex items-center justify-center rotate-y-180"><p className="text-sm">{card.answer}</p></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudySession;