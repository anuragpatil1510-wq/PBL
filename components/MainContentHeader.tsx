import React from 'react';

interface MainContentHeaderProps {
  onMenuClick: () => void;
  isEditingLayout: boolean;
  setIsEditingLayout: (isEditing: boolean) => void;
}

const MainContentHeader: React.FC<MainContentHeaderProps> = ({ onMenuClick, isEditingLayout, setIsEditingLayout }) => {
    
    return (
        <header className="flex items-center justify-between mb-6">
            <div className="flex items-center">
                 <button onClick={onMenuClick} className="lg:hidden mr-4 text-slate-500 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                </button>
                <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                    Performance Dashboard
                </h1>
            </div>
            <div className="flex items-center">
                <button 
                    onClick={() => setIsEditingLayout(!isEditingLayout)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                        isEditingLayout 
                        ? 'bg-teal-600 text-white' 
                        : 'bg-white/40 dark:bg-slate-800/60 hover:bg-white/80 dark:hover:bg-slate-700/80'
                    }`}
                >
                    {isEditingLayout ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg>
                    )}
                    <span>{isEditingLayout ? 'Done' : 'Edit Layout'}</span>
                </button>
            </div>
        </header>
    );
};

export default MainContentHeader;