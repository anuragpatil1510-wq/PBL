import React, { useState } from 'react';
import type { UserProfile, Course } from '../types';
import { AVATARS } from '../constants';

interface ProfileProps {
  profile: UserProfile;
  setProfileData: (profile: UserProfile) => void;
}

const Profile: React.FC<ProfileProps> = ({ profile, setProfileData }) => {
  const [newCourse, setNewCourse] = useState('');

  const handleCourseAdd = () => {
    if (newCourse.trim() && !profile.courses.find(c => c.name === newCourse.trim())) {
      const course: Course = { id: Date.now().toString(), name: newCourse.trim() };
      setProfileData({ ...profile, courses: [...profile.courses, course] });
      setNewCourse('');
    }
  };

  const handleCourseRemove = (id: string) => {
    setProfileData({ ...profile, courses: profile.courses.filter(c => c.id !== id) });
  };
  
  const Avatar = AVATARS[profile.avatarId % AVATARS.length];

  return (
    <div className="space-y-8">
        <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative group">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-teal-200 to-cyan-200 dark:from-teal-900 dark:to-cyan-900 text-teal-600 dark:text-teal-300 flex items-center justify-center ring-4 ring-white/50 dark:ring-slate-800/50 transition-transform group-hover:scale-105">
                    <Avatar className="w-full h-full p-2" />
                </div>
            </div>
            <div className="flex-1 text-center sm:text-left w-full">
                <input 
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfileData({...profile, name: e.target.value})}
                    className="text-2xl font-bold text-slate-800 dark:text-slate-100 bg-white/50 dark:bg-slate-800/50 rounded-md px-3 py-2 border border-slate-500/30 focus:outline-none focus:ring-2 focus:ring-teal-500 w-full"
                    placeholder="Your Name"
                />
                <input 
                    type="text"
                    value={profile.major}
                    onChange={(e) => setProfileData({...profile, major: e.target.value})}
                    className="text-lg text-slate-500 dark:text-slate-400 bg-white/50 dark:bg-slate-800/50 rounded-md px-3 py-2 border border-slate-500/30 focus:outline-none focus:ring-2 focus:ring-teal-500 mt-2 w-full"
                    placeholder="Your Major"
                />
            </div>
        </div>
        
        <div className="border-t border-slate-300/50 dark:border-slate-700/50 pt-6">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4">Choose Your Avatar</h3>
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-4">
                {AVATARS.map((AvatarComponent, index) => (
                    <button key={index} onClick={() => setProfileData({...profile, avatarId: index})} className={`p-2 rounded-full transition-all duration-200 aspect-square ${profile.avatarId === index ? 'bg-teal-500 ring-4 ring-teal-300' : 'bg-slate-100 dark:bg-slate-700 hover:bg-teal-100 dark:hover:bg-teal-900'}`}>
                       <AvatarComponent className={`w-full h-full ${profile.avatarId === index ? 'text-white' : 'text-slate-500'}`} />
                    </button>
                ))}
            </div>
        </div>

        <div className="border-t border-slate-300/50 dark:border-slate-700/50 pt-6">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4">Manage Your Courses</h3>
            <div className="flex space-x-2 mb-4">
                <input 
                    type="text"
                    value={newCourse}
                    onChange={(e) => setNewCourse(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleCourseAdd()}
                    placeholder="e.g., MATH-101 Calculus"
                    className="flex-1 bg-white/50 dark:bg-slate-800/50 rounded-md px-3 py-2 border border-slate-500/30 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <button onClick={handleCourseAdd} className="bg-teal-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-teal-700 transition-colors">Add</button>
            </div>
            <div className="space-y-2">
                {profile.courses.map(course => (
                    <div key={course.id} className="flex justify-between items-center p-2 bg-white/20 dark:bg-slate-900/30 rounded-lg">
                        <span className="text-sm font-medium">{course.name}</span>
                        <button onClick={() => handleCourseRemove(course.id)} className="text-red-500 hover:text-red-700 dark:hover:text-red-400">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                        </button>
                    </div>
                ))}
            </div>
        </div>
    </div>
  );
};

export default Profile;