import React from 'react';
import type { StudentData, Parameter, Achievement, Badge } from './types';

export const INITIAL_STUDENT_DATA: StudentData = {
  attendance: 85,
  assignmentScore: 80,
  quizScore: 75,
  midtermScore: 78,
  participationScore: 70,
  studyHours: 4,
  extracurricularHours: 2,
  previousGPA: 3.2,
  classAttentiveness: 80,
  homeworkCompletion: 85,
};

export const PARAMETERS: Parameter[] = [
    { id: 'attendance', label: 'Attendance (%)', min: 0, max: 100, step: 1 },
    { id: 'assignmentScore', label: 'Assignment Score (%)', min: 0, max: 100, step: 1 },
    { id: 'quizScore', label: 'Quiz Score (%)', min: 0, max: 100, step: 1 },
    { id: 'midtermScore', label: 'Midterm Score (%)', min: 0, max: 100, step: 1 },
    { id: 'participationScore', label: 'Class Participation (%)', min: 0, max: 100, step: 1 },
    { id: 'studyHours', label: 'Daily Study Hours', min: 0, max: 10, step: 0.5 },
    { id: 'extracurricularHours', label: 'Weekly Extracurricular Hours', min: 0, max: 20, step: 0.5 },
    { id: 'previousGPA', label: 'Previous GPA (0.0-4.0)', min: 0, max: 4, step: 0.1 },
    { id: 'classAttentiveness', label: 'Class Attentiveness (%)', min: 0, max: 100, step: 1 },
    { id: 'homeworkCompletion', label: 'Homework Completion (%)', min: 0, max: 100, step: 1 },
];

export const POINTS_SYSTEM = {
    runPrediction: 10,
    logData: 5,
    unlockAchievement: 25,
    completeStudySession: 50,
    // FIX: Added missing properties for Pomodoro and flashcard points.
    completePomodoro: 20,
    generateFlashcards: 10,
};

// FIX: Replaced JSX with React.createElement to be compatible with .ts files. This resolves parsing errors that occur when using JSX syntax in a non-tsx file.
export const AVATARS = [
    // Avatar 1
    (props: React.SVGProps<SVGSVGElement>) => React.createElement('svg', {...props, viewBox:"0 0 24 24", fill:"currentColor"}, React.createElement('path', {d:"M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"})),
    // Avatar 2
    (props: React.SVGProps<SVGSVGElement>) => React.createElement('svg', {...props, viewBox:"0 0 24 24", fill:"currentColor"}, React.createElement('path', {d:"M12 5.9c1.16 0 2.1.94 2.1 2.1s-.94 2.1-2.1 2.1S9.9 9.16 9.9 8s.94-2.1 2.1-2.1m0 9c2.97 0 6.1 1.46 6.1 2.1v1.1H5.9V17c0-.64 3.13-2.1 6.1-2.1M12 4C9.79 4 8 5.79 8 8s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 9c-2.67 0-8 1.34-8 4v3h16v-3c0-2.66-5.33-4-8-4z"})),
    // Avatar 3
    (props: React.SVGProps<SVGSVGElement>) => React.createElement('svg', {...props, viewBox:"0 0 24 24", fill:"currentColor"}, React.createElement('path', {d:"M12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12M12,14C16,14 20,16 20,20V22H4V20C4,16 8,14 12,14Z"})),
    // Avatar 4
    (props: React.SVGProps<SVGSVGElement>) => React.createElement('svg', {...props, viewBox:"0 0 24 24", fill:"currentColor"}, React.createElement('path', {d:"M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 4c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm0 14c-2.03 0-4.43-.82-6.14-2.88C7.55 15.8 9.68 15 12 15s4.45.8 6.14 2.12C16.43 19.18 14.03 20 12 20z"})),
];

export const ACHIEVEMENTS_LIST: Achievement[] = [
    {
        id: 'firstPrediction',
        name: 'First Steps',
        description: 'Run your first performance prediction.',
        icon: React.createElement('svg', {xmlns:"http://www.w3.org/2000/svg", className:"h-full w-full", viewBox:"0 0 20 20", fill:"currentColor"}, React.createElement('path', {d:"M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"}))
    },
    {
        id: 'highAchiever',
        name: 'High Achiever',
        description: 'Achieve a predicted score of 90% or higher.',
        icon: React.createElement('svg', {xmlns:"http://www.w3.org/2000/svg", className:"h-full w-full", viewBox:"0 0 20 20", fill:"currentColor"}, React.createElement('path', {fillRule:"evenodd", d:"M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z", clipRule:"evenodd"}))
    },
    {
        id: 'perfectScore',
        name: 'Stellar Student',
        description: 'Achieve a predicted score of 95% or higher.',
        icon: React.createElement('svg', {xmlns:"http://www.w3.org/2000/svg", className:"h-full w-full", viewBox:"0 0 20 20", fill:"currentColor"}, React.createElement('path', {d:"M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"}))
    },
    {
        id: 'historian',
        name: 'Historian',
        description: 'Log 5 entries in your historical trends.',
        icon: React.createElement('svg', {xmlns:"http://www.w3.org/2000/svg", className:"h-full w-full", viewBox:"0 0 20 20", fill:"currentColor"}, React.createElement('path', {fillRule:"evenodd", d:"M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z", clipRule:"evenodd"}))
    },
    {
        id: 'sessionMaster',
        name: 'Session Master',
        description: 'Complete your first guided study session.',
        icon: React.createElement('svg', {xmlns:"http://www.w3.org/2000/svg", className:"h-full w-full", viewBox:"0 0 20 20", fill:"currentColor"}, React.createElement('path', {d:"M10 12a2 2 0 100-4 2 2 0 000 4z"}), React.createElement('path', {fillRule:"evenodd", d:"M.458 10C3.732 4.943 9.522 3 10 3s6.268 1.943 9.542 7c-3.274 5.057-9.064 7-9.542 7S3.732 15.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z", clipRule:"evenodd"}))
    }
];

export const BADGES_LIST: Badge[] = [
    {
        id: 'novice',
        name: 'Novice Scholar',
        description: 'Earn 100 Study Points',
        pointsRequired: 100,
        icon: React.createElement('svg', {xmlns:"http://www.w3.org/2000/svg", className:"h-full w-full", viewBox:"0 0 20 20", fill:"currentColor"}, React.createElement('path', {d:"M10.394 2.08a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"})),
    },
    {
        id: 'adept',
        name: 'Adept Learner',
        description: 'Earn 250 Study Points',
        pointsRequired: 250,
        icon: React.createElement('svg', {xmlns:"http://www.w3.org/2000/svg", className:"h-full w-full", viewBox:"0 0 20 20", fill:"currentColor"}, React.createElement('path', {d:"M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z"})),
    },
    {
        id: 'expert',
        name: 'Expert Analyst',
        description: 'Earn 500 Study Points',
        pointsRequired: 500,
        icon: React.createElement('svg', {xmlns:"http://www.w3.org/2000/svg", className:"h-full w-full", viewBox:"0 0 20 20", fill:"currentColor"}, React.createElement('path', {d:"M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z"})),
    },
    {
        id: 'virtuoso',
        name: 'Academic Virtuoso',
        description: 'Earn 1000 Study Points',
        pointsRequired: 1000,
        icon: React.createElement('svg', {xmlns:"http://www.w3.org/2000/svg", className:"h-full w-full", viewBox:"0 0 20 20", fill:"currentColor"}, React.createElement('path', {d:"M18 8a6 6 0 01-7.743 5.743L10 14l-1 2-1-2-1.257-1.257A6 6 0 1118 8zm-6 4a4 4 0 100-8 4 4 0 000 8z"})),
    }
];
