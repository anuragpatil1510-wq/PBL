
import React from 'react';
import type { UserProfile, Theme } from '../types';
import UserMenu from './UserMenu';

interface HeaderProps {
    userProfile: UserProfile;
    theme: Theme;
    setTheme: (theme: Theme) => void;
    onSettingsClick: () => void;
    isEditingLayout: boolean;
    setIsEditingLayout: (isEditing: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ userProfile, theme, setTheme, onSettingsClick, isEditingLayout, setIsEditingLayout }) => {
    return (
        <header className="sticky top-0 z-20 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border-b border-white/30 dark:border-slate-700/50 p-4 flex justify-between items-center">
            <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-br from-teal-500 to-cyan-600 p-2 rounded-lg shadow-md">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                </div>
                <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                  Learnlytics
                </h1>
            </div>
            <div className="flex items-center space-x-4">
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
                 <UserMenu 
                    user={userProfile} 
                    theme={theme} 
                    setTheme={setTheme} 
                    onSettingsClick={onSettingsClick}
                />
            </div>
        </header>
    );
};

export default Header;
