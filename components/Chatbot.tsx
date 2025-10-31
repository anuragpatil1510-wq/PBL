
import React, { useState, useRef, useEffect } from 'react';
import type { ChatMessage } from '../types';

interface ChatbotProps {
  isOpen: boolean;
  onClose: () => void;
  onSendMessage: (text: string) => void;
  messages: ChatMessage[];
}

const Chatbot: React.FC<ChatbotProps> = ({ isOpen, onClose, onSendMessage, messages }) => {
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = () => {
    if (input.trim()) {
      onSendMessage(input.trim());
      setInput('');
      setIsTyping(true);
    }
  };
  
  useEffect(() => {
      if (messages.length > 0 && messages[messages.length - 1].sender === 'bot') {
          setIsTyping(false);
      }
  }, [messages])

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex justify-center items-center p-4" onClick={onClose}>
        <div 
            className="w-full max-w-lg h-[80vh] max-h-[700px] bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/30 dark:border-slate-700/50 rounded-2xl shadow-2xl flex flex-col"
            onClick={e => e.stopPropagation()}
        >
            <header className="p-4 border-b border-slate-200/80 dark:border-slate-700/50 flex justify-between items-center flex-shrink-0">
                <h3 className="font-bold text-lg text-teal-700 dark:text-teal-300">AI Assistant</h3>
                <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            </header>
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
                {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs px-4 py-2 rounded-2xl ${msg.sender === 'user' ? 'bg-teal-600 text-white' : 'bg-white/50 dark:bg-slate-700/50 text-slate-800 dark:text-slate-200'}`}>
                    <p className="text-sm">{msg.text}</p>
                    </div>
                </div>
                ))}
                {isTyping && (
                    <div className="flex justify-start">
                        <div className="max-w-xs px-4 py-2 rounded-2xl bg-white/50 dark:bg-slate-700/50 text-slate-800 dark:text-slate-200 flex items-center space-x-1">
                            <span className="h-2 w-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                            <span className="h-2 w-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                            <span className="h-2 w-2 bg-slate-400 rounded-full animate-bounce"></span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
            <div className="p-4 border-t border-slate-200/80 dark:border-slate-700/50 flex items-center flex-shrink-0">
                <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask a question..."
                className="flex-1 bg-slate-100/50 dark:bg-slate-700/50 border-transparent rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <button onClick={handleSend} className="ml-2 bg-teal-600 text-white p-2 rounded-lg hover:bg-teal-700 disabled:bg-teal-400" disabled={!input.trim()}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg>
                </button>
            </div>
        </div>
    </div>
  );
};

export default Chatbot;
