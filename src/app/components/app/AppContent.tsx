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

// Z URL zistime ci sme v learn route a aku temu mame otvorenu
function parseLearnRoute(pathname: string): { level: LearnLevel; theme: number } | null {
  const match = pathname.match(/^\/learn\/(beginner|intermediate|professional)\/(\d+)$/);
  if (!match) return null;

  const level = match[1] as LearnLevel;
  const theme = Number(match[2]);
  if (!Number.isInteger(theme) || theme < 0 || theme > 12) return null;

  return { level, theme };
}

function isCompletedIslandStatus(status: IslandStatus | undefined): boolean {
  return status === "completed-perfect" || status === "completed-mistakes";
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
      return;
    }
    if (tab === "mistakes") {
      void loadMistakesPage();
      return;
    }
    if (tab === "admin" && isAdmin) {
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

  function countSetBits(value: number): number {
    let bits = value;
    let count = 0;

    while (bits > 0) {
      if ((bits & 1) === 1) {
        count++;
      }
      bits >>= 1;
    }

    return count;
  }

  function buildFallbackMaskFromBest(bestCorrectAnswers: number, totalExercises: number): number {
    if (bestCorrectAnswers <= 0) {
      return 0;
    }

    if (bestCorrectAnswers >= totalExercises) {
      return (1 << totalExercises) - 1;
    }

    let fallbackMask = 0;
    for (let i = 0; i < bestCorrectAnswers; i++) {
      fallbackMask |= (1 << i);
    }
    return fallbackMask;
  }

  function getCompletedIslandsCount(level: LearnLevel): number {
    let completedCount = 0;
    for (let i = 1; i <= 12; i++) {
      const status = islandProgress[`${level}-${i}`];
      if (isCompletedIslandStatus(status)) {
        completedCount++;
      }
    }
    return completedCount;
  }

  function isIslandAccessible(level: LearnLevel, theme: number): boolean {
    if (isAdmin) {
      return true;
    }

    if (theme === 0) {
      const hasRequiredXp = isFinalTestUnlocked(userProgress.sectionXP[level]);
      const hasAllThemesCompleted = getCompletedIslandsCount(level) >= 12;
      return hasRequiredXp && hasAllThemesCompleted;
    }

    const status = islandProgress[`${level}-${theme}`] ?? "locked";
    return status !== "locked";
  }

  function clearOwnedLocalStorageKeys(email?: string) {
    localStorage.removeItem("accessToken");

    if (!email) {
      return;
    }

    localStorage.removeItem(`mistakes_${email}`);
    localStorage.removeItem(`mistakes_history_${email}`);
    localStorage.removeItem(`mistakes_hydrated_${email}`);
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
      clearOwnedLocalStorageKeys(currentUserEmail);
      navigate("/signin");
    }
  }

  async function handleApiError(error: unknown) {
    if (typeof error === "object" && error !== null && "status" in error) {
      const status = (error as { status?: number }).status;
      if (status === 401) {
        await forceLogout(accessToken);
      }
    }
  }

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
    const emailToUse = email || currentUserEmail;

    // Nacitanie profilu/progressu/streaku + admin statusu
    const result = await loadUserDataHelper(token, emailToUse, {
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
      await loadMistakesFromBackend(token, emailToUse);
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
          if (isCompletedIslandStatus(currentProgress[key])) {
            correctedProgress[key] = currentProgress[key];
          }
        });

        ["beginner", "intermediate", "professional"].forEach((level) => {
          for (let i = 1; i < 12; i++) {
            const currentKey = `${level}-${i}`;
            if (isCompletedIslandStatus(correctedProgress[currentKey])) {
              const nextKey = `${level}-${i + 1}`;
              if (!correctedProgress[nextKey]) {
                correctedProgress[nextKey] = "unlocked";
              }
            }
          }

        });

        // Ak je final test hotovy, odomkneme zaciatok dalsiej sekcie.
        const beginnerFinal = correctedProgress["beginner-0"];
        if (isCompletedIslandStatus(beginnerFinal)) {
          if (!correctedProgress["intermediate-1"]) {
            correctedProgress["intermediate-1"] = "unlocked";
          }
        }

        const intermediateFinal = correctedProgress["intermediate-0"];
        if (isCompletedIslandStatus(intermediateFinal)) {
          if (!correctedProgress["professional-1"]) {
            correctedProgress["professional-1"] = "unlocked";
          }
        }

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

    const isCompletedStatus = (status: IslandStatus | undefined) => {
      return status === "completed-perfect" || status === "completed-mistakes";
    };

    const isValidIslandPayload = (payload: IslandProgress) => {
      const validStates: IslandStatus[] = ["locked", "unlocked", "completed-perfect", "completed-mistakes"];
      const keyRegex = /^(beginner|intermediate|professional)-(0|[1-9]|1[0-2])$/;
      const levels: LearnLevel[] = ["beginner", "intermediate", "professional"];

      const beginnerOne = payload["beginner-1"];
      if (!beginnerOne || beginnerOne === "locked") {
        return false;
      }

      for (const key of Object.keys(payload)) {
        if (!keyRegex.test(key)) {
          return false;
        }

        const status = payload[key];
        if (!status || !validStates.includes(status)) {
          return false;
        }
      }

      for (let levelIndex = 0; levelIndex < levels.length; levelIndex++) {
        const level = levels[levelIndex];

        for (let theme = 2; theme <= 12; theme++) {
          const current = payload[`${level}-${theme}`];
          if (!current || current === "locked") {
            continue;
          }

          const previous = payload[`${level}-${theme - 1}`];
          if (!isCompletedStatus(previous)) {
            return false;
          }
        }

        const finalStatus = payload[`${level}-0`];
        if (finalStatus && finalStatus !== "locked") {
          const sectionXP = userProgress.sectionXP[level] || 0;
          if (sectionXP < 300) {
            return false;
          }

          for (let theme = 1; theme <= 12; theme++) {
            if (!isCompletedStatus(payload[`${level}-${theme}`])) {
              return false;
            }
          }
        }

        if (levelIndex > 0) {
          const previousLevel = levels[levelIndex - 1];
          const hasCompletedPreviousFinal = isCompletedStatus(payload[`${previousLevel}-0`]);

          let hasAnyOpenInCurrentLevel = false;
          for (let theme = 0; theme <= 12; theme++) {
            const status = payload[`${level}-${theme}`];
            if (status && status !== "locked") {
              hasAnyOpenInCurrentLevel = true;
              break;
            }
          }

          if (hasAnyOpenInCurrentLevel && !hasCompletedPreviousFinal) {
            return false;
          }
        }
      }

      return true;
    };

    // Admin ma ostrovceky vzdy odomknute bez ohladu na ulozene islands data, PUT /islands pre admin preset byval zdroj 400.
    if (saveFunction === progressAPI.updateIslands && isAdmin) {
      return;
    }

    if (saveFunction === progressAPI.updateIslands && !isValidIslandPayload(data as IslandProgress)) {
      return;
    }

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
    if (isIslandAccessible(level, theme)) {
      navigate(`/learn/${level}/${theme}`);
      return;
    }

    // Pri zamknutom final teste zobrazime co este chyba splnit
    if (theme === 0) {
      const sectionXp = userProgress.sectionXP[level];
      const xpNeeded = Math.max(0, 300 - sectionXp);
      const completedCount = getCompletedIslandsCount(level);
      const islandsNeeded = 12 - completedCount;
      if (islandsNeeded > 0) {
        alert(`To unlock the final test, you need:\n\n• 300 XP (Currently: ${sectionXp} XP)\n• Complete all 12 islands (Completed: ${completedCount}/12)\n\nYou still need to complete ${islandsNeeded} more island${islandsNeeded > 1 ? "s" : ""}.`);
      } else {
        alert(`You have completed all 12 islands but need ${xpNeeded} more XP to unlock the final test.\n\nCurrent XP: ${sectionXp}/300\n\nTip: Replay islands with perfect scores to earn more XP!`);
      }
    }
  }

  async function handleLearnComplete(correctAnswers: number, totalExercises: number, correctMask = 0, attemptStartAwardedMask = 0) {
    // Po dokonceni ostrovceka prepocitame XP a odomykanie dalsieho kroku
    if (currentLearnTheme === null || currentLearnTheme === undefined) return;

    const currentKey = `${currentLearnLevel}-${currentLearnTheme}`;
    const awardedMaskKey = `${currentKey}-xp-mask`;
    const previousBest = islandExerciseData[currentKey] || 0;
    const stateAwardedMask = islandExerciseData[awardedMaskKey] || 0;
    const fallbackAwardedMask = buildFallbackMaskFromBest(previousBest, totalExercises);
    const effectivePreviousAwardedMask = Math.max(attemptStartAwardedMask, stateAwardedMask, fallbackAwardedMask);

    const newlyAwardedMask = correctMask & ~effectivePreviousAwardedMask;
    const newlyAwardedCount = countSetBits(newlyAwardedMask);
    const xpToAward = newlyAwardedCount * 5;

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
    }

    const updatedSectionXp = newProgress.sectionXP[currentLearnLevel];
    let completedCount = 0;
    for (let i = 1; i <= 12; i++) {
      if (i === currentLearnTheme) {
        completedCount++;
      } else {
        const status = islandProgress[`${currentLearnLevel}-${i}`];
        if (isCompletedIslandStatus(status)) {
          completedCount++;
        }
      }
    }

    if (currentLearnTheme !== 0 && isFinalTestUnlocked(updatedSectionXp) && completedCount >= 12) {
      nextKey = `${currentLearnLevel}-0`;
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

    setIslandExerciseData((prev) => {
      const existingMask = prev[awardedMaskKey] || 0;
      const mergedMask = existingMask | effectivePreviousAwardedMask | correctMask;
      return {
        ...prev,
        [currentKey]: correctAnswers,
        [awardedMaskKey]: mergedMask,
      };
    });

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
      return;
    }

    navigate("/signin");
  }

  // Context pre Learn route a porovnanie najlepsieho vysledku
  const learnRoute = parseLearnRoute(location.pathname);
  const isLearnRoute = Boolean(learnRoute);
  const learnIslandKey = learnRoute ? `${learnRoute.level}-${learnRoute.theme}` : null;
  const previousBestCorrectAnswers = learnIslandKey ? (islandExerciseData[learnIslandKey] ?? 0) : 0;
  const previousAwardedMask = learnIslandKey ? (islandExerciseData[`${learnIslandKey}-xp-mask`] ?? 0) : 0;

  // Guard proti direct URL pristupu na zamknute learn route.
  useEffect(() => {
    if (!learnRoute) {
      return;
    }

    if (!isIslandAccessible(learnRoute.level, learnRoute.theme)) {
      navigate("/");
    }
  }, [learnRoute, isAdmin, islandProgress, userProgress, navigate]);

  if (isLoadingAuth) {
    // Kym overujeme session, zobrazime loader
    return <LoadingSpinner className="z-[110]" />;
  }

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

        <main className="w-full pb-8 flex-1" style={{ paddingTop: isLearnRoute ? "0" : "4rem" }}>
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
                previousAwardedMask={previousAwardedMask}
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
