import React, { useState } from 'react';
import type { UserProfile } from '../types';
import Profile from './Profile';
import Achievements from './Achievements';
import Badges from './Badges';

interface SettingsProps {
  profile: UserProfile;
  onSave: (newProfile: UserProfile) => void;
}

type SettingsView = 'profile' | 'preferences' | 'achievements' | 'badges';

const Settings: React.FC<SettingsProps> = ({ profile, onSave }) => {
  const [view, setView] = useState<SettingsView>('profile');
  const [formData, setFormData] = useState<UserProfile>(profile);
  const [isDirty, setIsDirty] = useState(false);

  const handleFormChange = (newProfileData: UserProfile) => {
    setFormData(newProfileData);
    setIsDirty(true);
  };

  const handleSave = () => {
    onSave(formData);
    setIsDirty(false);
  };
  
  const learningStyles = [
    { id: 'visual', name: 'Visual', description: 'Learn best through images, diagrams, and videos.' },
    { id: 'auditory', name: 'Auditory', description: 'Learn best through listening, like lectures or podcasts.' },
    { id: 'kinesthetic', name: 'Kinesthetic', description: 'Learn best by doing, through hands-on activities.' },
    { id: 'reading-writing', name: 'Reading/Writing', description: 'Learn best by reading text and taking notes.' },
  ];

  const renderContent = () => {
    switch (view) {
      case 'profile':
        return <Profile profile={formData} setProfileData={handleFormChange} />;
      case 'preferences':
        return (
          <div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4">Learning Style</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">Select your preferred learning style so the AI can tailor resource suggestions for you.</p>
            <div className="space-y-3">
              {learningStyles.map(style => (
                <button
                  key={style.id}
                  onClick={() => handleFormChange({ ...formData, learningStyle: style.id })}
                  className={`w-full text-left p-4 border rounded-lg transition-all ${
                    formData.learningStyle === style.id 
                    ? 'border-teal-500 bg-teal-500/10 ring-2 ring-teal-300' 
                    : 'border-slate-300 dark:border-slate-700 bg-white/20 dark:bg-slate-900/30 hover:bg-teal-500/5'
                  }`}
                >
                  <p className="font-bold">{style.name}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{style.description}</p>
                </button>
              ))}
            </div>
          </div>
        );
      case 'achievements':
        return <Achievements unlockedIds={profile.unlockedAchievements} />;
      case 'badges':
        return <Badges userPoints={profile.points} />;
    }
  };

  return (
    <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-white/30 dark:border-slate-700/50 rounded-2xl shadow-lg p-6 sm:p-8 space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Settings</h2>
          <p className="text-slate-500 dark:text-slate-400">Manage your profile, preferences, and achievements.</p>
        </div>
        {isDirty && (
           <button onClick={handleSave} className="bg-green-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-green-600 transition-colors flex items-center space-x-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
              <span>Save Changes</span>
           </button>
        )}
      </div>
      
      <div className="flex border-b border-slate-300/50 dark:border-slate-700/50 space-x-4">
        {(['profile', 'preferences', 'achievements', 'badges'] as SettingsView[]).map(v => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={`capitalize pb-2 border-b-2 font-semibold transition-colors ${
              view === v 
              ? 'border-teal-500 text-teal-600 dark:text-teal-400' 
              : 'border-transparent text-slate-500 hover:text-teal-600 dark:hover:text-teal-400'
            }`}
          >
            {v}
          </button>
        ))}
      </div>
      
      <div>{renderContent()}</div>
    </div>
  );
};

export default Settings;