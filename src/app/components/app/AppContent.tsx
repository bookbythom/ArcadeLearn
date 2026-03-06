import { useState, useEffect, lazy, Suspense } from "react";
import { useNavigate, useLocation } from "react-router";
import { Header } from "@/app/components/layout/Header";
import { Footer } from "@/app/components/layout/Footer";
import { ModalWrapper } from "@/app/components/ui/ModalWrapper";
import { LoadingSpinner } from "@/app/components/ui/LoadingSpinner";
import { beginnerThemes } from "@/app/data/beginnerthemes";
import { intermediateThemes } from "@/app/data/intermediatethemes";
import { professionalThemes } from "@/app/data/professionalthemes";
import { addXP, isFinalTestUnlocked, type UserProgress } from "@/app/utils/progressionUtils";
import { type UserProfile } from "@/app/utils/profileUtils";
import { authAPI, progressAPI, adminAPI } from "@/app/utils/api";
import { loadUserData as loadUserDataHelper } from "@/app/utils/loadUserData";
import { loadMistakesFromBackend } from "@/app/utils/mistakesUtils";
import { PageLoader } from "@/app/components/app/PageLoader";

const loadHomePage = () => import("@/app/components/pages/HomePage");
const loadLearnPage = () => import("@/app/components/islandpages/LearnPage");
const loadProfilePopup = () => import("@/app/components/profile/ProfilePopup");
const loadMistakesPage = () => import("@/app/components/pages/MistakesPage");
const loadAdminPanel = () => import("@/app/components/admin/AdminPanel");

const HomePage = lazy(() => loadHomePage().then((module) => ({ default: module.HomePage })));
const LearnPage = lazy(() => loadLearnPage());
const ProfilePopup = lazy(() => loadProfilePopup());
const MistakesPage = lazy(() => loadMistakesPage());
const AdminPanel = lazy(() => loadAdminPanel());

type ModalState = "none" | "profile";
type IslandStatus = "locked" | "unlocked" | "completed-perfect" | "completed-mistakes";
interface IslandProgress { [key: string]: IslandStatus; }
interface IslandExerciseData { [key: string]: number; }
type LearnLevel = "beginner" | "intermediate" | "professional";
type AutoScrollTarget = { level: LearnLevel; theme: number };

function parseLearnRoute(pathname: string): { level: LearnLevel; theme: number } | null {
  const match = pathname.match(/^\/learn\/(beginner|intermediate|professional)\/(\d+)$/);
  if (!match) return null;

  const level = match[1] as LearnLevel;
  const theme = Number(match[2]);
  if (!Number.isInteger(theme) || theme < 0 || theme > 12) return null;

  return { level, theme };
}

const LEVEL_CONFIG = {
  beginner: { themes: beginnerThemes },
  intermediate: { themes: intermediateThemes },
  professional: { themes: professionalThemes }
};

export default function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    document.title = "ArcadeLearn";
  }, []);

  const [activeTab, setActiveTab] = useState<"home" | "mistakes" | "admin">("home");
  const [modalState, setModalState] = useState<ModalState>("none");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUserEmail, setCurrentUserEmail] = useState("");
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [accessToken, setAccessToken] = useState("");
  const [userId, setUserId] = useState("");
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [mistakesRefreshTrigger, setMistakesRefreshTrigger] = useState(0);
  const [currentLearnLevel, setCurrentLearnLevel] = useState<LearnLevel>("beginner");
  const [currentLearnTheme, setCurrentLearnTheme] = useState(1);
  const [userProgress, setUserProgress] = useState<UserProgress>({
    level: 0,
    totalXP: 0,
    sectionXP: { beginner: 0, intermediate: 0, professional: 0 }
  });
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: "Guest",
    email: "",
    password: "",
    profilePicture: ""
  });
  const [islandProgress, setIslandProgress] = useState<IslandProgress>({ "beginner-1": "unlocked" });
  const [islandExerciseData, setIslandExerciseData] = useState<IslandExerciseData>({});
  const [streakCount, setStreakCount] = useState(0);
  const [streakActiveToday, setStreakActiveToday] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [, setVisibleSection] = useState<"beginner" | "intermediate" | "professional">("beginner");
  const [shouldAutoScroll, setShouldAutoScroll] = useState(false);
  const [autoScrollTarget, setAutoScrollTarget] = useState<AutoScrollTarget | null>(null);

  useEffect(() => {
    if (location.pathname === "/") {
      setActiveTab("home");
    } else if (location.pathname === "/mistakes") {
      setActiveTab("mistakes");
    } else if (location.pathname === "/admin") {
      setActiveTab("admin");
    }
  }, [location.pathname]);

  useEffect(() => {
    const learnRoute = parseLearnRoute(location.pathname);
    if (!learnRoute) return;
    setCurrentLearnLevel(learnRoute.level);
    setCurrentLearnTheme(learnRoute.theme);
  }, [location.pathname]);

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

    if (typeof win.requestIdleCallback === "function") {
      idleId = win.requestIdleCallback(prefetch, { timeout: 1500 });
    } else {
      timeoutId = setTimeout(prefetch, 800);
    }

    return () => {
      if (idleId !== undefined && typeof win.cancelIdleCallback === "function") {
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

  const forceLogout = async (tokenToRevoke?: string) => {
    try {
      if (tokenToRevoke) {
        await authAPI.signOut(tokenToRevoke);
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoggedIn(false);
      setUserId("");
      setAccessToken("");
      setCurrentUserEmail("");
      setUserProfile({ name: "Guest", email: "", password: "", profilePicture: "" });
      setUserProgress({ level: 0, totalXP: 0, sectionXP: { beginner: 0, intermediate: 0, professional: 0 } });
      setIslandProgress({ "beginner-1": "unlocked" });
      setIslandExerciseData({});
      setStreakCount(0);
      setStreakActiveToday(false);
      setIsAdmin(false);
      localStorage.clear();
      navigate("/signin");
    }
  };

  const handleApiError = async (_error: any) => {};

  useEffect(() => {
    const checkSession = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setIsLoadingAuth(false);
        navigate("/signin");
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
          localStorage.removeItem("accessToken");
          setIsLoadingAuth(false);
          navigate("/signin");
        }
      } catch (error) {
        localStorage.removeItem("accessToken");
        setIsLoadingAuth(false);
        navigate("/signin");
      }
    };

    checkSession();
  }, []);

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

    try {
      await loadMistakesFromBackend(token, email || currentUserEmail);
    } catch (error) {}

    try {
      const adminStatus = await adminAPI.checkAdmin(token);
      setIsAdmin(adminStatus);

      if (adminStatus) {
        const allIslands: IslandProgress = {};
        ["beginner", "intermediate", "professional"].forEach((level) => {
          allIslands[`${level}-0`] = "unlocked";
          for (let i = 1; i <= 12; i++) {
            allIslands[`${level}-${i}`] = "unlocked";
          }
        });
        setIslandProgress(allIslands);
      } else {
        const currentProgress = result.islandProgress || {};
        const correctedProgress: IslandProgress = {
          "beginner-1": currentProgress["beginner-1"] || "unlocked"
        };

        Object.keys(currentProgress).forEach((key) => {
          if (currentProgress[key] === "completed-mistakes" || currentProgress[key] === "completed-perfect") {
            correctedProgress[key] = currentProgress[key];
          }
        });

        ["beginner", "intermediate", "professional"].forEach((level) => {
          for (let i = 1; i <= 12; i++) {
            const currentKey = `${level}-${i}`;
            if (correctedProgress[currentKey] === "completed-mistakes" || correctedProgress[currentKey] === "completed-perfect") {
              const nextKey = `${level}-${i + 1}`;
              if (!correctedProgress[nextKey]) {
                correctedProgress[nextKey] = "unlocked";
              }
            }
          }

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

  useEffect(() => saveToBackend(userProgress, progressAPI.updateProgress), [userProgress, accessToken, isLoggedIn, isInitialLoad]);
  useEffect(() => saveToBackend(islandProgress, progressAPI.updateIslands), [islandProgress, accessToken, isLoggedIn, isInitialLoad]);
  useEffect(() => saveToBackend(islandExerciseData, progressAPI.updateExerciseData), [islandExerciseData, accessToken, isLoggedIn, isInitialLoad]);

  const getThemeName = (level: LearnLevel, theme: number): string => {
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

  const handleIslandClick = (level: LearnLevel, theme: number, _isFinal: boolean) => {
    if (isAdmin) {
      navigate(`/learn/${level}/${theme}`);
      return;
    }

    const key = `${level}-${theme}`;
    const status = islandProgress[key] || "locked";

    if (status === "locked") {
      if (theme === 0) {
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
          alert(`To unlock the final test, you need:\n\n• 300 XP (Currently: ${sectionXp} XP)\n• Complete all 12 islands (Completed: ${completedCount}/12)\n\nYou still need to complete ${islandsNeeded} more island${islandsNeeded > 1 ? "s" : ""}.`);
        } else {
          alert(`You have completed all 12 islands but need ${xpNeeded} more XP to unlock the final test.\n\nCurrent XP: ${sectionXp}/300\n\nTip: Replay islands with perfect scores to earn more XP!`);
        }
      }
      return;
    }

    navigate(`/learn/${level}/${theme}`);
  };

  const handleLearnComplete = async (correctAnswers: number, totalExercises: number) => {
    if (!currentLearnLevel || currentLearnTheme === null || currentLearnTheme === undefined) return;

    const currentKey = `${currentLearnLevel}-${currentLearnTheme}`;
    const previousBest = islandExerciseData[currentKey] || 0;
    const improvedBy = Math.max(0, correctAnswers - previousBest);
    const xpToAward = improvedBy * 5;

    let newProgress = userProgress;
    if (xpToAward > 0) {
      newProgress = addXP(userProgress, xpToAward, currentLearnLevel);
      setUserProgress(newProgress);
    }

    const mistakeCount = totalExercises - correctAnswers;
    const completionStatus: IslandStatus = mistakeCount === 0 ? "completed-perfect" : "completed-mistakes";

    let nextKey: string | null = null;
    if (currentLearnTheme === 0) {
      if (currentLearnLevel === "beginner") {
        nextKey = "intermediate-1";
      } else if (currentLearnLevel === "intermediate") {
        nextKey = "professional-1";
      }
    } else if (currentLearnTheme < 12) {
      nextKey = `${currentLearnLevel}-${currentLearnTheme + 1}`;
    } else {
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

    setIslandProgress((prev) => {
      const newProgressState = { ...prev, [currentKey]: completionStatus };
      if (nextKey) {
        const nextIslandStatus = newProgressState[nextKey];
        if (!nextIslandStatus || nextIslandStatus === "locked") {
          newProgressState[nextKey] = "unlocked";
        }
      }
      return newProgressState;
    });

    setIslandExerciseData((prev) => ({ ...prev, [currentKey]: correctAnswers }));

    try {
      const streakData = await progressAPI.incrementStreak(accessToken);
      setStreakCount(streakData.count);
      setStreakActiveToday(streakData.activeToday);
    } catch (error) {}
  };

  const handleTabChange = (tab: "home" | "mistakes" | "admin") => {
    setActiveTab(tab);
    if (tab === "mistakes") {
      setMistakesRefreshTrigger((prev) => prev + 1);
      navigate("/mistakes");
    } else if (tab === "admin") {
      navigate("/admin");
    } else {
      navigate("/");
    }
  };

  const handleProfileClick = () => {
    if (isLoggedIn) {
      setModalState("profile");
    } else {
      navigate("/signin");
    }
  };

  if (isLoadingAuth) {
    return <LoadingSpinner className="z-[110]" />;
  }

  const learnRoute = parseLearnRoute(location.pathname);
  const isLearnRoute = Boolean(learnRoute);
  const learnIslandKey = learnRoute ? `${learnRoute.level}-${learnRoute.theme}` : null;
  const previousBestCorrectAnswers = learnIslandKey ? (islandExerciseData[learnIslandKey] || 0) : 0;

  return (
    <>
      <div className="bg-[#1c1c1e] min-h-screen w-full overflow-x-hidden flex flex-col">
        {!isLearnRoute && (
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

        <main className="w-full pb-8 flex-1" style={{ paddingTop: isLearnRoute ? "0" : "4rem" }}>
          {isLearnRoute && learnRoute && (
            <Suspense fallback={<PageLoader />}>
              <LearnPage
                level={learnRoute.level}
                theme={learnRoute.theme}
                onBack={() => {
                  setAutoScrollTarget({ level: learnRoute.level, theme: learnRoute.theme });
                  setShouldAutoScroll(true);
                  navigate("/");
                }}
                onComplete={handleLearnComplete}
                userEmail={currentUserEmail}
                themeName={getThemeName(learnRoute.level, learnRoute.theme)}
                isAdmin={isAdmin}
                accessToken={accessToken}
                previousBestCorrectAnswers={previousBestCorrectAnswers}
              />
            </Suspense>
          )}
          {location.pathname === "/" && activeTab === "home" && (
            <Suspense fallback={<PageLoader />}>
              <HomePage
                userProgress={userProgress}
                islandProgress={islandProgress}
                islandExerciseData={islandExerciseData}
                isAdmin={isAdmin}
                accessToken={accessToken}
                isLoggedIn={isLoggedIn}
                shouldAutoScroll={shouldAutoScroll}
                autoScrollTarget={autoScrollTarget}
                onVisibleSectionChange={setVisibleSection}
                onIslandClick={handleIslandClick}
                onIslandHover={handleIslandHoverPrefetch}
                onAutoScrollComplete={() => {
                  setShouldAutoScroll(false);
                  setAutoScrollTarget(null);
                }}
              />
            </Suspense>
          )}
          {activeTab === "mistakes" && location.pathname === "/mistakes" && (
            <Suspense fallback={<PageLoader />}>
              <MistakesPage userEmail={currentUserEmail} refreshTrigger={mistakesRefreshTrigger} />
            </Suspense>
          )}
          {activeTab === "admin" && isAdmin && location.pathname === "/admin" && (
            <Suspense fallback={<PageLoader />}>
              <AdminPanel
                accessToken={accessToken}
                currentUserId={userId}
                onSelfReset={async () => {
                  alert("Your data has been reset. You will be logged out and need to sign in again.");
                  await forceLogout(accessToken);
                }}
              />
            </Suspense>
          )}
        </main>

        {!isLearnRoute && <Footer />}
      </div>

      <ModalWrapper isOpen={modalState === "profile"} onClose={() => setModalState("none")} canClose={true} modalType="profile">
        <Suspense fallback={<PageLoader />}>
          <ProfilePopup
            onLogout={async () => {
              await forceLogout(accessToken);
              navigate("/signin");
            }}
            profile={userProfile}
            onProfileUpdate={setUserProfile}
          />
        </Suspense>
      </ModalWrapper>
    </>
  );
}
