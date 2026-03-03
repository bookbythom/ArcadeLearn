import { useState, useEffect, lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from "react-router";
import { Header } from "@/app/components/layout/Header";
import { Footer } from "@/app/components/layout/Footer";
import { ModalWrapper } from "@/app/components/ui/ModalWrapper";
import { beginnerThemes } from "@/app/data/beginnerthemes";
import { intermediateThemes } from "@/app/data/intermediatethemes";
import { professionalThemes } from "@/app/data/professionalthemes";
import { calculateXPEarned, addXP, isFinalTestUnlocked, type UserProgress } from "@/app/utils/progressionUtils";
import { type UserProfile } from "@/app/utils/profileUtils";
import { authAPI, progressAPI, adminAPI } from "@/app/utils/api";
import { loadUserData as loadUserDataHelper } from "@/app/utils/loadUserData";
import { loadMistakesFromBackend } from "@/app/utils/mistakesUtils";

const loadHomePage = () => import("@/app/components/pages/HomePage");
const loadLearnPage = () => import("@/app/components/islandpages/LearnPage");
const loadProfilePopup = () => import("@/app/components/profile/ProfilePopup");
const loadMistakesPage = () => import("@/app/components/pages/MistakesPage");
const loadSignInPage = () => import("@/app/components/pages/SignInPage");
const loadRegisterPage = () => import("@/app/components/pages/RegisterPage");
const loadAdminPanel = () => import("@/app/components/admin/AdminPanel");

const HomePage = lazy(() => loadHomePage().then((module) => ({ default: module.HomePage })));
const LearnPage = lazy(() => loadLearnPage());
const ProfilePopup = lazy(() => loadProfilePopup());
const MistakesPage = lazy(() => loadMistakesPage());
const SignInPage = lazy(() => loadSignInPage());
const RegisterPage = lazy(() => loadRegisterPage());
const AdminPanel = lazy(() => loadAdminPanel());

function PageLoader() {
  return (
    <div className="w-full min-h-[320px] flex items-center justify-center">
      <svg className="animate-spin" width="56" height="56" viewBox="0 0 80 80" style={{ animation: 'spin 1s linear infinite' }}>
        <circle cx="40" cy="40" r="32" fill="none" stroke="#4cb025" strokeWidth="6" strokeLinecap="round" strokeDasharray="160" strokeDashoffset="40" />
      </svg>
    </div>
  );
}

// Definicie typov
type ModalState = "none" | "profile";
type IslandStatus = "locked" | "unlocked" | "completed-perfect" | "completed-mistakes";
interface IslandProgress { [key: string]: IslandStatus; }
interface IslandExerciseData { [key: string]: number; }

// Konfiguracia levelov - tu su ulozene vsetky temy pre kazdy level
const LEVEL_CONFIG = {
  beginner: { themes: beginnerThemes },
  intermediate: { themes: intermediateThemes },
  professional: { themes: professionalThemes }
};

// Hlavny komponent aplikacie
function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Nastav title stranky
  useEffect(() => { 
    document.title = "ArcadeLearn"; 
  }, []);
  
  // State premenne pre aplikaciu
  const [activeTab, setActiveTab] = useState<"home" | "mistakes" | "admin">("home");
  const [modalState, setModalState] = useState<ModalState>("none");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUserEmail, setCurrentUserEmail] = useState('');
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [accessToken, setAccessToken] = useState('');
  const [userId, setUserId] = useState('');
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [mistakesRefreshTrigger, setMistakesRefreshTrigger] = useState(0);
  const [showLearnPage, setShowLearnPage] = useState(false);
  const [currentLearnLevel, setCurrentLearnLevel] = useState<"beginner" | "intermediate" | "professional">("beginner");
  const [currentLearnTheme, setCurrentLearnTheme] = useState(1);
  const [userProgress, setUserProgress] = useState<UserProgress>({ 
    level: 0, 
    totalXP: 0, 
    sectionXP: { beginner: 0, intermediate: 0, professional: 0 } 
  });
  const [userProfile, setUserProfile] = useState<UserProfile>({ 
    name: 'Guest', 
    email: '', 
    password: '', 
    profilePicture: '' 
  });
  const [islandProgress, setIslandProgress] = useState<IslandProgress>({ "beginner-1": "unlocked" });
  const [islandExerciseData, setIslandExerciseData] = useState<IslandExerciseData>({});
  const [streakCount, setStreakCount] = useState(0);
  const [streakActiveToday, setStreakActiveToday] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [, setVisibleSection] = useState<'beginner' | 'intermediate' | 'professional'>('beginner');
  const [shouldAutoScroll, setShouldAutoScroll] = useState(false);

  // Effect pre sledovanie URL a nastavenie aktivneho tabu
  useEffect(() => {
    if (location.pathname === '/') {
      setActiveTab('home');
    } else if (location.pathname === '/mistakes') {
      setActiveTab('mistakes');
    } else if (location.pathname === '/admin') {
      setActiveTab('admin');
    }
  }, [location.pathname]);

  // Prefetch najpouzivanejsich lazy chunkov v idle case po prihlaseni
  useEffect(() => {
    if (!isLoggedIn || isLoadingAuth) return;

    const prefetch = () => {
      void loadHomePage();
      void loadLearnPage();
      void loadProfilePopup();
    };

    const win = window as any;
    let idleId: number | undefined;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    if (typeof win.requestIdleCallback === 'function') {
      idleId = win.requestIdleCallback(prefetch, { timeout: 1500 });
    } else {
      timeoutId = setTimeout(prefetch, 800);
    }

    return () => {
      if (idleId !== undefined && typeof win.cancelIdleCallback === 'function') {
        win.cancelIdleCallback(idleId);
      }
      if (timeoutId !== undefined) {
        clearTimeout(timeoutId);
      }
    };
  }, [isLoggedIn, isLoadingAuth]);

  const handleTabHoverPrefetch = (tab: "home" | "mistakes" | "admin") => {
    if (!isLoggedIn) return;
    if (tab === "home") {
      void loadHomePage();
    } else if (tab === "mistakes") {
      void loadMistakesPage();
    } else if (tab === "admin" && isAdmin) {
      void loadAdminPanel();
    }
  };

  const handleProfileHoverPrefetch = () => {
    if (!isLoggedIn) return;
    void loadProfilePopup();
  };

  const handleIslandHoverPrefetch = () => {
    if (!isLoggedIn) return;
    void loadLearnPage();
  };

  // Funkcia pre odhlasenie uzivatela
  const forceLogout = async (tokenToRevoke?: string) => {
    try {
      if (tokenToRevoke) {
        await authAPI.signOut(tokenToRevoke);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Vymazanie vsetkych state premennych
      setIsLoggedIn(false);
      setUserId('');
      setAccessToken('');
      setCurrentUserEmail('');
      setUserProfile({ name: 'Guest', email: '', password: '', profilePicture: '' });
      setUserProgress({ level: 0, totalXP: 0, sectionXP: { beginner: 0, intermediate: 0, professional: 0 } });
      setIslandProgress({ "beginner-1": "unlocked" });
      setIslandExerciseData({});
      setStreakCount(0);
      setStreakActiveToday(false);
      setIsAdmin(false);
      localStorage.clear();
      navigate('/signin');
    }
  };

  // API error handler - ak je 401 error tak odhlasime uzivatela
  const handleApiError = async (_error: any) => {
  };

  // Effect pre kontrolu session pri nacitani aplikacie
  useEffect(() => {
    const checkSession = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setIsLoadingAuth(false);
        navigate('/signin');
        return;
      }
      
      try {
        const sessionData = await authAPI.getSession(token);
        if (sessionData.session?.user) {
          setIsInitialLoad(true);
          setAccessToken(token);
          setUserId(sessionData.session.user.id);
          setCurrentUserEmail(sessionData.session.user.email);
          setIsLoggedIn(true);
          await loadUserData(token);
          setShouldAutoScroll(true);
          setIsLoadingAuth(false);
        } else {
          localStorage.removeItem('accessToken');
          setIsLoadingAuth(false);
          navigate('/signin');
        }
      } catch (error) {
        localStorage.removeItem('accessToken');
        setIsLoadingAuth(false);
        navigate('/signin');
      }
    };
    
    checkSession();
  }, []);

  // Funkcia pre nacitanie user dat z backendu
  const loadUserData = async (token: string, email?: string) => {
    const result = await loadUserDataHelper(token, email || currentUserEmail, {
      setUserProfile: setUserProfile,
      setUserProgress: setUserProgress,
      setIslandProgress: setIslandProgress,
      setIslandExerciseData: setIslandExerciseData,
      setStreakCount: setStreakCount,
      setStreakActiveToday: setStreakActiveToday,
      setIsInitialLoad: setIsInitialLoad,
      handleAPIError: handleApiError
    });
    
    if (result.had401) {
      await forceLogout(token);
      return result;
    }
    
    // Nacitaj mistakes z backendu
    try {
      await loadMistakesFromBackend(token, email || currentUserEmail);
    } catch (error) {}
    
    // Skontroluj ci je uzivatel admin
    try {
      const adminStatus = await adminAPI.checkAdmin(token);
      setIsAdmin(adminStatus);
      
      if (adminStatus) {
        // Ak je admin, odomkni vsetky ostrovy
        const allIslands: IslandProgress = {};
        ['beginner', 'intermediate', 'professional'].forEach(level => {
          allIslands[`${level}-0`] = "unlocked";
          for (let i = 1; i <= 12; i++) {
            allIslands[`${level}-${i}`] = "unlocked";
          }
        });
        setIslandProgress(allIslands);
      } else {
        // Ak nie je admin, oprav progress aby bol konzistentny
        const currentProgress = result.islandProgress || {};
        const correctedProgress: IslandProgress = { 
          "beginner-1": currentProgress["beginner-1"] || "unlocked" 
        };
        
        // Skopiruj len completed statusy
        Object.keys(currentProgress).forEach(key => {
          if (currentProgress[key] === "completed-mistakes" || currentProgress[key] === "completed-perfect") {
            correctedProgress[key] = currentProgress[key];
          }
        });
        
        // Pre kazdy level, odomkni dalsi ostrov ak je predchadzajuci completed
        ['beginner', 'intermediate', 'professional'].forEach(level => {
          for (let i = 1; i <= 12; i++) {
            const currentKey = `${level}-${i}`;
            if (correctedProgress[currentKey] === "completed-mistakes" || correctedProgress[currentKey] === "completed-perfect") {
              const nextKey = `${level}-${i + 1}`;
              if (!correctedProgress[nextKey]) {
                correctedProgress[nextKey] = "unlocked";
              }
            }
          }
          
          // Ak je ostrov 12 completed, skontroluj ci moze odomknut final test
          const island12Key = `${level}-12`;
          if (correctedProgress[island12Key] === "completed-mistakes" || correctedProgress[island12Key] === "completed-perfect") {
            const testKey = `${level}-0`;
            if (!correctedProgress[testKey]) {
              correctedProgress[testKey] = "unlocked";
            }
          }
        });
        
        setIslandProgress(correctedProgress);
      }
    } catch (error) {
      setIsAdmin(false);
    }
    
    return result;
  };

  // Funkcia pre ukladanie dat do backendu
  const saveToBackend = (data: any, saveFunction: (token: string, data: any) => Promise<any>) => {
    if (!accessToken || !isLoggedIn || isInitialLoad) return;
    const timeoutId = setTimeout(async () => {
      try {
        await saveFunction(accessToken, data);
      } catch (error: any) {
        if (error?.status === 401) {
          handleApiError(error);
        }
      }
    }, 500);
    return () => clearTimeout(timeoutId);
  };

  // Effects pre ukladanie dat do backendu
  useEffect(() => saveToBackend(userProgress, progressAPI.updateProgress), [userProgress, accessToken, isLoggedIn, isInitialLoad]);
  useEffect(() => saveToBackend(islandProgress, progressAPI.updateIslands), [islandProgress, accessToken, isLoggedIn, isInitialLoad]);
  useEffect(() => saveToBackend(islandExerciseData, progressAPI.updateExerciseData), [islandExerciseData, accessToken, isLoggedIn, isInitialLoad]);

  // Helper funkcia pre ziskanie nazvu temy
  const getThemeName = (level: "beginner" | "intermediate" | "professional", theme: number): string => {
    if (theme === 0) {
      const names = {
        beginner: "Beginner Final Test",
        intermediate: "Intermediate Final Test",
        professional: "Professional Final Test"
      };
      return names[level];
    }
    return LEVEL_CONFIG[level].themes?.[theme - 1]?.title || `Theme ${theme}`;
  };

  // Handler pre kliknutie na ostrov
  const handleIslandClick = (level: "beginner" | "intermediate" | "professional", theme: number, _isFinal: boolean) => {
    // Ak je admin, povolime vstup na vsetky ostrovy
    if (isAdmin) {
      setCurrentLearnLevel(level);
      setCurrentLearnTheme(theme);
      setShowLearnPage(true);
      return;
    }
    
    const key = `${level}-${theme}`;
    const status = islandProgress[key] || "locked";
    
    // Ak je ostrov locked, zobrazime alert s poziadavkami
    if (status === "locked") {
      if (theme === 0) {
        // Final test poziadavky
        const sectionXp = userProgress.sectionXP[level];
        const xpNeeded = Math.max(0, 300 - sectionXp);
        let completedCount = 0;
        for (let i = 1; i <= 12; i++) {
          const islandStatus = islandProgress[`${level}-${i}`];
          if (islandStatus === "completed-perfect" || islandStatus === "completed-mistakes") {
            completedCount++;
          }
        }
        const islandsNeeded = 12 - completedCount;
        if (islandsNeeded > 0) {
          alert(`To unlock the final test, you need:\n\n• 300 XP (Currently: ${sectionXp} XP)\n• Complete all 12 islands (Completed: ${completedCount}/12)\n\nYou still need to complete ${islandsNeeded} more island${islandsNeeded > 1 ? 's' : ''}.`);
        } else {
          alert(`You have completed all 12 islands but need ${xpNeeded} more XP to unlock the final test.\n\nCurrent XP: ${sectionXp}/300\n\nTip: Replay islands with perfect scores to earn more XP!`);
        }
      }
      return;
    }
    
    // Otvor learn page
    setCurrentLearnLevel(level);
    setCurrentLearnTheme(theme);
    setShowLearnPage(true);
  };

  // Handler pre dokoncenie learn page
  const handleLearnComplete = async (correctAnswers: number, totalExercises: number) => {
    if (!currentLearnLevel || currentLearnTheme === null || currentLearnTheme === undefined) return;
    
    const currentKey = `${currentLearnLevel}-${currentLearnTheme}`;
    const previousStatus = islandProgress[currentKey];
    const isFirstCompletion = !previousStatus || previousStatus === "unlocked";
    
    // Ak je to prvy completion, pridaj XP
    let newProgress = userProgress;
    if (isFirstCompletion) {
      const xpEarned = calculateXPEarned(totalExercises, correctAnswers);
      newProgress = addXP(userProgress, xpEarned, currentLearnLevel);
      setUserProgress(newProgress);
    }
    
    // Urci completion status
    const mistakeCount = totalExercises - correctAnswers;
    const completionStatus: IslandStatus = mistakeCount === 0 ? "completed-perfect" : "completed-mistakes";
    
    // Zisti ktory ostrov odomknut dalej
    let nextKey: string | null = null;
    if (currentLearnTheme === 0) {
      // Final test - odomkni prvy ostrov dalsej urovne
      if (currentLearnLevel === "beginner") {
        nextKey = "intermediate-1";
      } else if (currentLearnLevel === "intermediate") {
        nextKey = "professional-1";
      }
    } else if (currentLearnTheme < 12) {
      // Normalny ostrov - odomkni dalsi ostrov
      nextKey = `${currentLearnLevel}-${currentLearnTheme + 1}`;
    } else {
      // Ostrov 12 - skontroluj ci mozeme odomknut final test
      const updatedSectionXp = newProgress.sectionXP[currentLearnLevel];
      let completedCount = 0;
      for (let i = 1; i <= 12; i++) {
        if (i === currentLearnTheme) {
          completedCount++;
        } else {
          const status = islandProgress[`${currentLearnLevel}-${i}`];
          if (status === "completed-perfect" || status === "completed-mistakes") {
            completedCount++;
          }
        }
      }
      if (isFinalTestUnlocked(updatedSectionXp) && completedCount >= 12) {
        nextKey = `${currentLearnLevel}-0`;
      }
    }
    
    // Aktualizuj island progress
    setIslandProgress(prev => {
      const newProgressState = { ...prev, [currentKey]: completionStatus };
      if (nextKey) {
        const nextIslandStatus = newProgressState[nextKey];
        if (!nextIslandStatus || nextIslandStatus === "locked") {
          newProgressState[nextKey] = "unlocked";
        }
      }
      return newProgressState;
    });

    // Uloz pocet correct answers
    setIslandExerciseData(prev => ({ ...prev, [currentKey]: correctAnswers }));

    // Aktualizuj streak
    try {
      const streakData = await progressAPI.incrementStreak(accessToken);
      setStreakCount(streakData.count);
      setStreakActiveToday(streakData.activeToday);
    } catch (error) {}
  };

  // Handler pre zmenu tabu
  const handleTabChange = (tab: "home" | "mistakes" | "admin") => {
    setActiveTab(tab);
    if (tab === "mistakes") {
      setMistakesRefreshTrigger(prev => prev + 1);
      navigate('/mistakes');
    } else if (tab === "admin") {
      navigate('/admin');
    } else {
      navigate('/');
    }
  };

  // Handler pre kliknutie na profile
  const handleProfileClick = () => {
    if (isLoggedIn) {
      setModalState("profile");
    } else {
      navigate('/signin');
    }
  };

  // Loading screen
  if (isLoadingAuth) {
    return (
      <div className="bg-[#1c1c1e] min-h-screen w-full flex items-center justify-center">
        <svg className="animate-spin" width="80" height="80" viewBox="0 0 80 80" style={{ animation: 'spin 1s linear infinite' }}>
          <circle cx="40" cy="40" r="32" fill="none" stroke="#4cb025" strokeWidth="6" strokeLinecap="round" strokeDasharray="160" strokeDashoffset="40" />
        </svg>
      </div>
    );
  }

  return (
    <>
      <div className="bg-[#1c1c1e] min-h-screen w-full overflow-x-hidden flex flex-col">
        {!showLearnPage && (
          <Header 
            activeTab={activeTab}
            onTabChange={handleTabChange}
            onTabHover={handleTabHoverPrefetch}
            userProgress={userProgress}
            streakCount={streakCount}
            streakActiveToday={streakActiveToday}
            userProfile={userProfile}
            isLoggedIn={isLoggedIn}
            isAdmin={isAdmin}
            onProfileClick={handleProfileClick}
            onProfileHover={handleProfileHoverPrefetch}
          />
        )}

        <main className="w-full pb-8 flex-1" style={{ paddingTop: showLearnPage ? '0' : '4rem' }}>
          {location.pathname === '/' && activeTab === "home" && (
            <Suspense fallback={<PageLoader />}>
              <HomePage 
                userProgress={userProgress}
                islandProgress={islandProgress}
                islandExerciseData={islandExerciseData}
                isAdmin={isAdmin}
                accessToken={accessToken}
                isLoggedIn={isLoggedIn}
                shouldAutoScroll={shouldAutoScroll}
                onVisibleSectionChange={setVisibleSection}
                onIslandClick={handleIslandClick}
                onIslandHover={handleIslandHoverPrefetch}
                onAutoScrollComplete={() => setShouldAutoScroll(false)}
              />
            </Suspense>
          )}
          {activeTab === "mistakes" && location.pathname === '/mistakes' && (
            <Suspense fallback={<PageLoader />}>
              <MistakesPage userEmail={currentUserEmail} refreshTrigger={mistakesRefreshTrigger} />
            </Suspense>
          )}
          {activeTab === "admin" && isAdmin && location.pathname === '/admin' && (
            <Suspense fallback={<PageLoader />}>
              <AdminPanel 
                accessToken={accessToken} 
                currentUserId={userId} 
                onSelfReset={async () => {
                  alert('Your data has been reset. You will be logged out and need to sign in again.');
                  await forceLogout(accessToken);
                }} 
              />
            </Suspense>
          )}
        </main>

        <Footer />
      </div>

      <ModalWrapper isOpen={modalState === "profile"} onClose={() => setModalState("none")} canClose={true} modalType="profile">
        <Suspense fallback={<PageLoader />}>
          <ProfilePopup 
            onLogout={async () => { 
              await forceLogout(accessToken); 
              navigate('/signin'); 
            }} 
            profile={userProfile} 
            onProfileUpdate={setUserProfile} 
          />
        </Suspense>
      </ModalWrapper>

      {showLearnPage && (
        <div className="fixed inset-0 bg-[#1c1c1e] z-50 overflow-auto">
          <Suspense fallback={<PageLoader />}>
            <LearnPage 
              level={currentLearnLevel} 
              theme={currentLearnTheme} 
              onBack={() => setShowLearnPage(false)} 
              onComplete={handleLearnComplete} 
              userEmail={currentUserEmail} 
              themeName={getThemeName(currentLearnLevel, currentLearnTheme)} 
              isAdmin={isAdmin} 
              accessToken={accessToken} 
            />
          </Suspense>
        </div>
      )}
    </>
  );
}

// Hlavny App komponent s routingom
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signin" element={<SignInPageWrapper />} />
        <Route path="/register" element={<RegisterPageWrapper />} />
        <Route path="/*" element={<AppContent />} />
      </Routes>
    </BrowserRouter>
  );
}

// Wrapper pre SignIn page
function SignInPageWrapper() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      localStorage.removeItem('accessToken');
      const response = await authAPI.signIn({ email, password });
      if (!response?.accessToken || !response?.user) {
        throw new Error('Invalid response from server');
      }
      localStorage.setItem('accessToken', response.accessToken);
      navigate('/');
      window.location.reload();
    } catch (error: any) {
      let errorMessage = 'Sign-in failed.\n\n';
      errorMessage += error.data?.error || error.message || 'Please check your credentials.';
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Suspense fallback={<PageLoader />}>
      <SignInPage onSubmit={handleSubmit} isLoading={isLoading} />
    </Suspense>
  );
}

// Wrapper pre Register page
function RegisterPageWrapper() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      await authAPI.signUp({ email, password, name });
      alert('Account created successfully! Please sign in with your credentials.');
      navigate('/signin');
    } catch (error: any) {
      alert(error.message || 'Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Suspense fallback={<PageLoader />}>
      <RegisterPage onSubmit={handleSubmit} isLoading={isLoading} />
    </Suspense>
  );
}