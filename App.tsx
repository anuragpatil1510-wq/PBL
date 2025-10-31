
import React, { useState, useCallback, useEffect } from 'react';
import type { StudentData, PredictionResult, HistoricalEntry, Theme, UserProfile, DashboardComponentId, SessionState, StudySessionSetup, ChatMessage } from './types';
import { DASHBOARD_COMPONENT_IDS } from './types';
import { getPerformancePrediction, getPerformanceReport, getLiveStudyResources, generateSessionQuiz, getChatbotResponse } from './services/geminiService';
import PredictionDashboard from './components/PredictionDashboard';
import Loader from './components/Loader';
import { INITIAL_STUDENT_DATA, ACHIEVEMENTS_LIST, POINTS_SYSTEM } from './constants';
import Toast from './components/Toast';
import PerformanceReportModal from './components/PerformanceReportModal';
import SettingsModal from './components/SettingsModal';
import StudySessionSetupComponent from './components/StudySessionSetup';
import StudySession from './components/StudySession';
import SessionQuiz from './components/SessionQuiz';
import ConceptExplainer from './components/ConceptExplainer';
import Header from './components/Header';
import Chatbot from './components/Chatbot';

const App: React.FC = () => {
  const [studentData, setStudentData] = useState<StudentData>(INITIAL_STUDENT_DATA);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [historicalData, setHistoricalData] = useState<HistoricalEntry[]>([]);
  const [theme, setTheme] = useState<Theme>('light');
  
  const [userProfile, setUserProfile] = useState<UserProfile>({ name: 'Student', major: 'Undeclared', avatarId: 0, unlockedAchievements: [], courses: [], learningStyle: 'visual', points: 0, personalBest: 0 });
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportContent, setReportContent] = useState<string | null>(null);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const [dashboardLayout, setDashboardLayout] = useState<DashboardComponentId[]>(DASHBOARD_COMPONENT_IDS);
  const [isEditingLayout, setIsEditingLayout] = useState(false);
  const [goal, setGoal] = useState<number>(90);
  
  const [isSessionSetupOpen, setIsSessionSetupOpen] = useState(false);
  const [isSessionRunning, setIsSessionRunning] = useState(false);
  const [sessionState, setSessionState] = useState<SessionState | null>(null);
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);

  const [isExplainerOpen, setIsExplainerOpen] = useState(false);
  const [explainerConcept, setExplainerConcept] = useState<string | null>(null);
  
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);


  const addPoints = useCallback((points: number, message: string) => {
    setUserProfile(prev => {
      const newProfile = { ...prev, points: prev.points + points };
      localStorage.setItem('userProfile', JSON.stringify(newProfile));
      return newProfile;
    });
    setToastMessage(`+${points} SP: ${message}`);
    setTimeout(() => setToastMessage(null), 4000);
  }, []);
  
  const unlockAchievement = useCallback((achievementId: string) => {
    setUserProfile(prev => {
      if (prev.unlockedAchievements.includes(achievementId)) return prev;

      const achievement = ACHIEVEMENTS_LIST.find(a => a.id === achievementId);
      if (achievement) {
        const newProfile = { ...prev, unlockedAchievements: [...prev.unlockedAchievements, achievementId] };
        localStorage.setItem('userProfile', JSON.stringify(newProfile));
        addPoints(POINTS_SYSTEM.unlockAchievement, `Unlocked "${achievement.name}"`);
        return newProfile;
      }
      return prev;
    });
  }, [addPoints]);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    if (savedTheme) setTheme(savedTheme);
    else {
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        setTheme(prefersDark ? 'dark' : 'light');
    }

    try {
      const savedHistory = localStorage.getItem('studentPerformanceHistory');
      if (savedHistory) setHistoricalData(JSON.parse(savedHistory));

      const savedProfile = localStorage.getItem('userProfile');
      if (savedProfile) {
        const loadedProfile = JSON.parse(savedProfile);
        setUserProfile(prev => ({...prev, ...loadedProfile}));
      }

      const savedLayout = localStorage.getItem('dashboardLayout');
      if (savedLayout) {
        const parsedLayout = JSON.parse(savedLayout);
        if(Array.isArray(parsedLayout) && parsedLayout.every(id => DASHBOARD_COMPONENT_IDS.includes(id))) {
            setDashboardLayout(parsedLayout);
        }
      }
    } catch (e) { console.error("Failed to load from localStorage", e); }
  }, []);

  useEffect(() => {
    document.body.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);
  
  const handleSliderChange = useCallback((field: keyof StudentData, value: number) => {
    setStudentData(prevData => ({ ...prevData, [field]: value }));
  }, []);

  const handlePredict = async () => {
    setIsLoading(true);
    setError(null);
    setPrediction(null);
    try {
      const result = await getPerformancePrediction(studentData, userProfile);
      setPrediction(result);
      addPoints(POINTS_SYSTEM.runPrediction, "Ran a prediction");
      unlockAchievement('firstPrediction');
      if (result.predictedScore > userProfile.personalBest) {
          setUserProfile(prev => {
              const newProfile = { ...prev, personalBest: result.predictedScore };
              localStorage.setItem('userProfile', JSON.stringify(newProfile));
              return newProfile;
          });
      }
      if (result.predictedScore >= 90) unlockAchievement('highAchiever');
      if (result.predictedScore >= 95) unlockAchievement('perfectScore');
    } catch (err) {
      setError('Failed to get prediction. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleGenerateReport = async () => {
    if (!prediction) return;
    setIsGeneratingReport(true);
    try {
      const report = await getPerformanceReport(prediction);
      setReportContent(report);
      setIsReportModalOpen(true);
    } catch (err) {
      console.error("Failed to generate report", err);
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const handleLogData = () => {
    if (!prediction) return;
    const newEntry: HistoricalEntry = { date: new Date().toISOString(), data: studentData, prediction };
    const updatedHistory = [...historicalData, newEntry];
    setHistoricalData(updatedHistory);
    localStorage.setItem('studentPerformanceHistory', JSON.stringify(updatedHistory));
    addPoints(POINTS_SYSTEM.logData, "Logged performance data");
    if (updatedHistory.length >= 5) unlockAchievement('historian');
  };
  
  const handleProfileSave = (newProfile: UserProfile) => {
      setUserProfile(newProfile);
      localStorage.setItem('userProfile', JSON.stringify(newProfile));
      setIsSettingsOpen(false);
  };
  
  const handleSetDashboardLayout = (newLayout: DashboardComponentId[]) => {
      setDashboardLayout(newLayout);
      localStorage.setItem('dashboardLayout', JSON.stringify(newLayout));
  };

  const handleStartSession = async (setup: StudySessionSetup) => {
    setIsSessionSetupOpen(false);
    setIsLoading(true);
    try {
        const resources = await getLiveStudyResources(setup, userProfile, prediction);
        setSessionState({
            setup,
            resources,
            startTime: Date.now(),
        });
        setIsSessionRunning(true);
    } catch (error) {
        setError("Could not prepare the study session. Please try again.");
    } finally {
        setIsLoading(false);
    }
  };

  const handleEndSession = async () => {
      if (!sessionState) return;
      setIsSessionRunning(false);
      setIsGeneratingQuiz(true);
      try {
        const quizQuestions = await generateSessionQuiz(sessionState.setup);
        setSessionState(prev => prev ? { ...prev, quiz: quizQuestions } : null);
      } catch (error) {
        console.error("Failed to generate quiz", error);
        handleQuizComplete(0);
      } finally {
        setIsGeneratingQuiz(false);
      }
  };
  
  const handleQuizComplete = (bonusPoints: number) => {
    if(bonusPoints > 0) {
      addPoints(bonusPoints, "Bonus for quiz performance!");
    }
    setSessionState(null);
    addPoints(POINTS_SYSTEM.completeStudySession, "Completed a study session!");
    unlockAchievement('sessionMaster');
  };
  
  const handleOpenExplainer = (concept: string) => {
    setExplainerConcept(concept);
    setIsExplainerOpen(true);
  };
  
  const handleSendMessage = async (message: string) => {
    const newUserMessage: ChatMessage = { id: Date.now().toString(), text: message, sender: 'user' };
    setChatMessages(prev => [...prev, newUserMessage]);
    
    const botResponse = await getChatbotResponse([...chatMessages, newUserMessage], message);
    
    const newBotMessage: ChatMessage = { id: (Date.now() + 1).toString(), text: botResponse, sender: 'bot' };
    setChatMessages(prev => [...prev, newBotMessage]);
  };

  const renderContent = () => {
    if (isLoading || isGeneratingQuiz) {
       return (
          <div className="flex justify-center items-center h-[calc(100vh-200px)]">
            <div className="text-center">
              <Loader isLarge={true} />
              <p className="mt-4 text-teal-600 dark:text-teal-400 font-semibold text-lg">
                {isGeneratingQuiz ? 'AI is preparing your knowledge check...' : 'Analyzing performance...'}
              </p>
            </div>
          </div>
       );
    }
    
    if (sessionState?.quiz) {
        return <SessionQuiz 
            quiz={sessionState.quiz}
            onComplete={handleQuizComplete}
        />
    }

    if (error) {
       return (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-lg" role="alert">
            <p className="font-bold">An Error Occurred</p>
            <p>{error}</p>
          </div>
       );
    }

    return <PredictionDashboard 
        prediction={prediction} 
        studentData={studentData} 
        onSliderChange={handleSliderChange}
        onPredict={handlePredict}
        onLogData={handleLogData}
        onStartSession={() => setIsSessionSetupOpen(true)}
        goal={goal}
        onGenerateReport={handleGenerateReport} 
        isGeneratingReport={isGeneratingReport} 
        personalBest={userProfile.personalBest}
        layout={dashboardLayout}
        setLayout={handleSetDashboardLayout}
        isEditingLayout={isEditingLayout}
    />;
  };
  
  if (isSessionRunning && sessionState) {
    return <StudySession 
        sessionState={sessionState}
        onEndSession={handleEndSession}
        onExplainConcept={handleOpenExplainer}
        theme={theme}
    />
  }

  return (
    <div className="min-h-screen text-slate-800 dark:text-slate-200 selection:bg-teal-500/20">
      <Header
        userProfile={userProfile}
        theme={theme}
        setTheme={setTheme}
        onSettingsClick={() => setIsSettingsOpen(true)}
        isEditingLayout={isEditingLayout}
        setIsEditingLayout={setIsEditingLayout}
      />
      <main>
         <div className="p-4 sm:p-6 lg:p-8">
            {renderContent()}
         </div>
      </main>

      <button onClick={() => setIsChatOpen(true)} className="fixed bottom-6 right-6 bg-teal-600 text-white p-4 rounded-full shadow-lg hover:bg-teal-700 transition-transform hover:scale-110">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.083-3.083A7.002 7.002 0 012 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM4.75 12.375a.75.75 0 000-1.5H4a.75.75 0 000 1.5h.75zM7.25 12.375a.75.75 0 000-1.5H6.5a.75.75 0 000 1.5h.75zM9.75 12.375a.75.75 0 000-1.5H9a.75.75 0 000 1.5h.75z" clipRule="evenodd" /></svg>
      </button>

      <Chatbot 
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        messages={chatMessages}
        onSendMessage={handleSendMessage}
      />

      <Toast message={toastMessage} />
      {reportContent && (
        <PerformanceReportModal 
            isOpen={isReportModalOpen}
            onClose={() => setIsReportModalOpen(false)}
            report={reportContent}
            studentName={userProfile.name}
        />
      )}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        profile={userProfile}
        onSave={handleProfileSave}
      />
      <StudySessionSetupComponent
        isOpen={isSessionSetupOpen}
        onClose={() => setIsSessionSetupOpen(false)}
        onStart={handleStartSession}
      />
      {explainerConcept && (
        <ConceptExplainer 
            isOpen={isExplainerOpen}
            onClose={() => setIsExplainerOpen(false)}
            concept={explainerConcept}
            theme={theme}
        />
      )}
    </div>
  );
};

export default App;
