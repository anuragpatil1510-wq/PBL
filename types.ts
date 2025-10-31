export interface StudentData {
  attendance: number;
  assignmentScore: number;
  quizScore: number;
  midtermScore: number;
  participationScore: number;
  studyHours: number;
  extracurricularHours: number;
  previousGPA: number;
  classAttentiveness: number;
  homeworkCompletion: number;
}

export interface Subject {
  subject: string;
  score: number;
}

export interface Resource {
  title: string;
  type: string;
  url: string;
}

export interface PredictionResult {
  predictedScore: number;
  performanceLevel: string;
  recommendations: string[];
  strengths: string[];
  weaknesses: string[];
  subjectBreakdown: Subject[];
  suggestedResources: Resource[];
}

export interface Parameter {
    id: keyof StudentData;
    label: string;
    min: number;
    max: number;
    step: number;
}

export interface HistoricalEntry {
  date: string;
  data: StudentData;
  prediction: PredictionResult;
}

export type Theme = 'light' | 'dark';

export interface Course {
  id: string;
  name: string;
}

export interface UserProfile {
  name: string;
  major: string;
  avatarId: number;
  unlockedAchievements: string[];
  courses: Course[];
  learningStyle: string;
  points: number;
  personalBest: number;
}

export interface Achievement {
    id: string;
    name: string;
    description: string;
    icon: React.ReactElement;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: React.ReactElement;
  pointsRequired: number;
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
}

export interface Flashcard {
  question: string;
  answer: string;
}

export interface StudySessionSetup {
  subject: string;
  duration: number; // in minutes
  goal: string;
}

export interface SessionResource {
  type: 'concept' | 'video' | 'question';
  title: string;
  content: string; // URL for video, text for concept/question
}

export interface QuizQuestion {
    question: string;
    options: string[];
    correctAnswer: string;
}

export interface SessionState {
  setup: StudySessionSetup;
  resources: SessionResource[];
  startTime: number;
  quiz?: QuizQuestion[];
  quizScore?: number;
}

export interface StudyTask {
  day: string;
  subject: string;
  task: string;
  time: string;
  priority: 'High' | 'Medium' | 'Low';
}

export interface PlannerInput {
  subjects: string[];
  examDates: string;
  weeklyHours: number;
  weaknesses: string[];
  learningStyle: string;
}

export type DashboardComponentId = 
  | 'main'
  | 'radar'
  | 'strengthsWeaknesses'
  | 'recommendations'
  | 'breakdownAndActions'
  | 'resources';

export const DASHBOARD_COMPONENT_IDS: DashboardComponentId[] = [
  'main',
  'radar',
  'strengthsWeaknesses',
  'recommendations',
  'breakdownAndActions',
  'resources'
];