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

// Zakladne typy pre stav aplikacie
type ModalState = "none" | "profile";
type IslandStatus = "locked" | "unlocked" | "completed-perfect" | "completed-mistakes";
interface IslandProgress { [key: string]: IslandStatus; }
interface IslandExerciseData { [key: string]: number; }
type LearnLevel = "beginner" | "intermediate" | "professional";
type AutoScrollTarget = { level: LearnLevel; theme: number };
type AppTab = "home" | "mistakes" | "admin";

interface AuthSessionState {
  isLoggedIn: boolean;
  currentUserEmail: string;
  isLoadingAuth: boolean;
  accessToken: string;
  userId: string;
  isInitialLoad: boolean;
  isAdmin: boolean;
}

// Predvolene hodnoty pre reset po odhlaseni
const INITIAL_USER_PROGRESS: UserProgress = {
  level: 0,
  totalXP: 0,
  sectionXP: { beginner: 0, intermediate: 0, professional: 0 }
};

const INITIAL_USER_PROFILE: UserProfile = {
  name: "Guest",
  email: "",
  password: "",
  profilePicture: ""
};

const INITIAL_AUTH_SESSION_STATE: AuthSessionState = {
  isLoggedIn: false,
  currentUserEmail: "",
  isLoadingAuth: true,
  accessToken: "",
  userId: "",
  isInitialLoad: true,
  isAdmin: false
};

// Pomocna funkcia pre API chyby
async function EMPTY_ERROR_HANDLER(_error: unknown) {}

// Z URL zistime ci sme v learn route a aku temu mame otvorenu
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

  // Nastavime title tab-u v prehliadaci
  useEffect(() => {
    document.title = "ArcadeLearn";
  }, []);

  // Hlavne stavy celej aplikacie
  const [activeTab, setActiveTab] = useState<AppTab>("home");
  const [modalState, setModalState] = useState<ModalState>("none");
  const [authSessionState, setAuthSessionState] = useState<AuthSessionState>(INITIAL_AUTH_SESSION_STATE);
  const [mistakesRefreshTrigger, setMistakesRefreshTrigger] = useState(0);
  const [currentLearnLevel, setCurrentLearnLevel] = useState<LearnLevel>("beginner");
  const [currentLearnTheme, setCurrentLearnTheme] = useState(1);
  const [userProgress, setUserProgress] = useState<UserProgress>(INITIAL_USER_PROGRESS);
  const [userProfile, setUserProfile] = useState<UserProfile>(INITIAL_USER_PROFILE);
  const [islandProgress, setIslandProgress] = useState<IslandProgress>({ "beginner-1": "unlocked" });
  const [islandExerciseData, setIslandExerciseData] = useState<IslandExerciseData>({});
  const [streakCount, setStreakCount] = useState(0);
  const [streakActiveToday, setStreakActiveToday] = useState(false);
  const [, setVisibleSection] = useState<LearnLevel>("beginner");
  const [shouldAutoScroll, setShouldAutoScroll] = useState(false);
  const [autoScrollTarget, setAutoScrollTarget] = useState<AutoScrollTarget | null>(null);

  // Prehladne vytiahnutie hodnot zo session objektu
  const {
    isLoggedIn,
    currentUserEmail,
    isLoadingAuth,
    accessToken,
    userId,
    isInitialLoad,
    isAdmin
  } = authSessionState;

  // Pomocny updater, aby sme nemenili cely session state rucne na viac miestach
  function updateAuthSessionState(patch: Partial<AuthSessionState>) {
    setAuthSessionState((previousState) => ({ ...previousState, ...patch }));
  }

  // Synchronizacia aktivnej karty podla aktualnej URL
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
    // Ak sme v learn route, nastavime aktualny level a temu
    const learnRoute = parseLearnRoute(location.pathname);
    if (!learnRoute) return;
    setCurrentLearnLevel(learnRoute.level);
    setCurrentLearnTheme(learnRoute.theme);
  }, [location.pathname]);

  useEffect(() => {
    if (!isLoggedIn || isLoadingAuth) return;

    // Jemny prefetch po prihlaseni, aby boli prve prechody rychlejsie
    function prefetch() {
      void loadHomePage();
      void loadLearnPage();
      void loadProfilePopup();
    }

    const timeoutId = setTimeout(prefetch, 800);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [isLoggedIn, isLoadingAuth]);

  function handleTabHoverPrefetch(tab: AppTab) {
    // Prefetch po hoveri skrati cakanie pri kliknuti
    if (!isLoggedIn) return;
    if (tab === "home") {
      void loadHomePage();
    } else if (tab === "mistakes") {
      void loadMistakesPage();
    } else if (tab === "admin" && isAdmin) {
      void loadAdminPanel();
    }
  }

  function handleProfileHoverPrefetch() {
    // Prefetch profilu pri hoveri na avatar
    if (!isLoggedIn) return;
    void loadProfilePopup();
  }

  function handleIslandHoverPrefetch() {
    // Prefetch LearnPage pri hoveri nad ostrovcekom
    if (!isLoggedIn) return;
    void loadLearnPage();
  }

  async function forceLogout(tokenToRevoke?: string) {
    try {
      if (tokenToRevoke) {
        await authAPI.signOut(tokenToRevoke);
      }
    } catch {
      // Odhlasenie je best-effort, lokalny reset spravime vzdy vo finally.
    } finally {
      // Hard reset lokalneho stavu po odhlaseni
      setAuthSessionState(INITIAL_AUTH_SESSION_STATE);
      setUserProfile(INITIAL_USER_PROFILE);
      setUserProgress(INITIAL_USER_PROGRESS);
      setIslandProgress({ "beginner-1": "unlocked" });
      setIslandExerciseData({});
      setStreakCount(0);
      setStreakActiveToday(false);
      localStorage.clear();
      navigate("/signin");
    }
  }

  const handleApiError = EMPTY_ERROR_HANDLER;

  useEffect(() => {
    // Pri starte overime session token a podla toho pustime app alebo signin
    const checkSession = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        updateAuthSessionState({ isLoadingAuth: false });
        navigate("/signin");
        return;
      }

      try {
        const sessionData = await authAPI.getSession(token);
        if (sessionData.session?.user) {
          updateAuthSessionState({
            isInitialLoad: true,
            accessToken: token,
            userId: sessionData.session.user.id,
            currentUserEmail: sessionData.session.user.email,
            isLoggedIn: true
          });
          await loadUserData(token);
          setShouldAutoScroll(true);
          updateAuthSessionState({ isLoadingAuth: false });
        } else {
          localStorage.removeItem("accessToken");
          updateAuthSessionState({ isLoadingAuth: false });
          navigate("/signin");
        }
      } catch {
        localStorage.removeItem("accessToken");
        updateAuthSessionState({ isLoadingAuth: false });
        navigate("/signin");
      }
    };

    checkSession();
  }, []);

  async function loadUserData(token: string, email?: string) {
    // Nacitanie profilu/progressu/streaku + admin statusu
    const result = await loadUserDataHelper(token, email || currentUserEmail, {
      setUserProfile: setUserProfile,
      setUserProgress: setUserProgress,
      setIslandProgress: setIslandProgress,
      setIslandExerciseData: setIslandExerciseData,
      setStreakCount: setStreakCount,
      setStreakActiveToday: setStreakActiveToday,
      setIsInitialLoad: (value: boolean) => updateAuthSessionState({ isInitialLoad: value })
    });

    if (result.had401) {
      // Pri expirovanej session rovno odhlasime usera
      await forceLogout(token);
      return result;
    }

    try {
      // Mistakes drzim v sync s backendom hned po nacitani session
      await loadMistakesFromBackend(token, email || currentUserEmail);
    } catch {
      // Ak sync zlyha, app stale funguje a data sa dosynchronizuju neskor.
    }

    try {
      // Podla role admin upravime pristupy k ostrovcekom
      const adminStatus = await adminAPI.checkAdmin(token);
      updateAuthSessionState({ isAdmin: adminStatus });

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
        // Beznemu userovi nechavame iba validny progres + postupne odomykanie
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
    } catch {
      updateAuthSessionState({ isAdmin: false });
    }

    return result;
  }

  function saveToBackend<T>(data: T, saveFunction: (token: string, data: T) => Promise<unknown>) {
    // Auto-save je vypnuty pocas prveho loadu, aby sa neprepisi initial data
    if (!accessToken || !isLoggedIn || isInitialLoad) return;
    const timeoutId = setTimeout(async () => {
      try {
        await saveFunction(accessToken, data);
      } catch (error: unknown) {
        if (typeof error === "object" && error !== null && "status" in error && (error as { status?: number }).status === 401) {
          handleApiError(error);
        }
      }
    }, 500);
    return () => clearTimeout(timeoutId);
  }

  useEffect(() => saveToBackend(userProgress, progressAPI.updateProgress), [userProgress, accessToken, isLoggedIn, isInitialLoad]);
  useEffect(() => saveToBackend(islandProgress, progressAPI.updateIslands), [islandProgress, accessToken, isLoggedIn, isInitialLoad]);
  useEffect(() => saveToBackend(islandExerciseData, progressAPI.updateExerciseData), [islandExerciseData, accessToken, isLoggedIn, isInitialLoad]);

  // Nazov temy pouzivame v LearnPage headri
  function getThemeName(level: LearnLevel, theme: number): string {
    if (theme === 0) {
      const names = {
        beginner: "Beginner Final Test",
        intermediate: "Intermediate Final Test",
        professional: "Professional Final Test"
      };
      return names[level];
    }
    return LEVEL_CONFIG[level].themes?.[theme - 1]?.title || `Theme ${theme}`;
  }

  function handleIslandClick(level: LearnLevel, theme: number, _isFinal: boolean) {
    // Admin moze ist na ktorukolvek temu bez podmienok
    if (isAdmin) {
      navigate(`/learn/${level}/${theme}`);
      return;
    }

    const key = `${level}-${theme}`;
    const status = islandProgress[key] || "locked";

    if (status === "locked") {
      // Pri zamknutom final teste zobrazime co este chyba splnit
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
  }

  async function handleLearnComplete(correctAnswers: number, totalExercises: number) {
    // Po dokonceni ostrovceka prepocitame XP a odomykanie dalsieho kroku
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
      // Aktualizujeme stav aktualneho a pripadne dalsieho ostrovceka
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
      // Streak zvysujeme po uspesnom dokonceni lekcie
      const streakData = await progressAPI.incrementStreak(accessToken);
      setStreakCount(streakData.count);
      setStreakActiveToday(streakData.activeToday);
    } catch {
      // Zlyhanie streak requestu nemoze blokovat dokoncenu lekciu.
    }
  }

  function handleTabChange(tab: AppTab) {
    // Klik na tab meni route + pripadne refreshne mistakes list
    setActiveTab(tab);
    if (tab === "mistakes") {
      setMistakesRefreshTrigger((prev) => prev + 1);
      navigate("/mistakes");
    } else if (tab === "admin") {
      navigate("/admin");
    } else {
      navigate("/");
    }
  }

  function handleProfileClick() {
    // Profil modal iba pre prihlaseneho usera
    if (isLoggedIn) {
      setModalState("profile");
    } else {
      navigate("/signin");
    }
  }

  if (isLoadingAuth) {
    // Kym overujeme session, zobrazime loader
    return <LoadingSpinner className="z-[110]" />;
  }

  // Context pre Learn route a porovnanie najlepsieho vysledku
  const learnRoute = parseLearnRoute(location.pathname);
  const isLearnRoute = Boolean(learnRoute);
  const learnIslandKey = learnRoute ? `${learnRoute.level}-${learnRoute.theme}` : null;
  const previousBestCorrectAnswers = learnIslandKey ? (islandExerciseData[learnIslandKey] || 0) : 0;

  return (
    <>
      <div className="bg-[#1c1c1e] min-h-screen w-full overflow-x-hidden flex flex-col">
        {/* Header je skryty na Learn route pre cisty focus rezim */}
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

        <main className={`w-full pb-8 flex-1 ${isLearnRoute ? "pt-0" : "pt-[7.25rem] sm:pt-16"}`}>
          {/* Learn obsah */}
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
            /* Home mapa ostrovcekov */
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
            /* Mistakes zoznam */
            <Suspense fallback={<PageLoader />}>
              <MistakesPage userEmail={currentUserEmail} refreshTrigger={mistakesRefreshTrigger} />
            </Suspense>
          )}
          {activeTab === "admin" && isAdmin && location.pathname === "/admin" && (
            /* Admin panel iba pre admin rolu */
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
        {/* Profil popup modal */}
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
