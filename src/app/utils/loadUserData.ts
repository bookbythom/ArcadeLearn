import { profileAPI, progressAPI } from './api';
import type { UserProfile } from './profileUtils';
import type { UserProgress } from './progressionUtils';

type IslandStatus = "locked" | "unlocked" | "completed-perfect" | "completed-mistakes";
type IslandProgress = Record<string, IslandStatus>;
type IslandExerciseData = Record<string, number>;

interface LoadUserDataCallbacks {
  setUserProfile: (profile: UserProfile) => void;
  setUserProgress: (progress: UserProgress) => void;
  setIslandProgress: (islands: IslandProgress) => void;
  setIslandExerciseData?: (exerciseData: IslandExerciseData) => void;
  setStreakCount: (streak: number) => void;
  setStreakActiveToday?: (active: boolean) => void;
  setIsInitialLoad: (loading: boolean) => void;
}

type LoadUserDataResult = {
  success: boolean;
  had401: boolean;
  islandProgress?: IslandProgress;
};

// Jednoducha kontrola, ci API vratilo unauthorized
const hasStatus401 = (error: unknown): boolean => {
  return typeof error === 'object' && error !== null && 'status' in error && (error as { status?: number }).status === 401;
};

function getFallbackUserName(email: string): string {
  const nameFromEmail = email.split('@')[0];
  return nameFromEmail || 'User';
}

function getDefaultProgress(): UserProgress {
  return {
    level: 0,
    totalXP: 0,
    sectionXP: {
      beginner: 0,
      intermediate: 0,
      professional: 0,
    },
  };
}

// Funkcia na nacitanie user dat z backendu
export async function loadUserData(
  token: string,
  currentUserEmail: string,
  callbacks: LoadUserDataCallbacks
): Promise<LoadUserDataResult> {
  // Toto sa vracia von, aby parent komponent vedel dorobit odomykanie ostrovov
  let islandsData: IslandProgress | null = null;
  
  // Nacitanie profilu
  try {
    const profileData = await profileAPI.getProfile(token);
    
    const userProfile = {
      name: profileData.name,
      email: profileData.email,
      password: '',
      profilePicture: profileData.profilePicture || ''
    };
    
    callbacks.setUserProfile(userProfile);
  } catch (error: unknown) {
    if (hasStatus401(error)) {
      return { success: false, had401: true };
    }
    
    // Fallback profil
    const userName = getFallbackUserName(currentUserEmail);
    
    callbacks.setUserProfile({
      name: userName,
      email: currentUserEmail,
      password: '',
      profilePicture: ''
    });
  }

  // Nacitanie progressu
  try {
    const progressData = await progressAPI.getProgress(token);
    callbacks.setUserProgress(progressData);
  } catch (error: unknown) {
    if (hasStatus401(error)) {
      return { success: false, had401: true };
    }
    
    // Defaultny progress
    callbacks.setUserProgress(getDefaultProgress());
  }

  // Nacitanie island progressu
  try {
    const islands = await progressAPI.getIslands(token);
    const typedIslands = islands as IslandProgress;
    islandsData = typedIslands;
    callbacks.setIslandProgress(typedIslands);
  } catch (error: unknown) {
    if (hasStatus401(error)) {
      return { success: false, had401: true };
    }
    
    // Defaultne odomknuty prvy island
    const defaultIslands: IslandProgress = { "beginner-1": "unlocked" };
    islandsData = defaultIslands;
    callbacks.setIslandProgress(defaultIslands);
  }

  // Nacitanie streak dat
  try {
    const streak = await progressAPI.getStreak(token);
    
    let streakCount = streak.count;
    if (!streakCount) {
      streakCount = 0;
    }
    
    callbacks.setStreakCount(streakCount);
    
    if (callbacks.setStreakActiveToday) {
      callbacks.setStreakActiveToday(Boolean(streak.activeToday));
    }
  } catch (error: unknown) {
    if (hasStatus401(error)) {
      return { success: false, had401: true };
    }
    
    callbacks.setStreakCount(0);
  }

  // Nacitanie exercise dat
  try {
    const exerciseData = await progressAPI.getExerciseData(token);
    
    if (callbacks.setIslandExerciseData) {
      callbacks.setIslandExerciseData(exerciseData);
    }
  } catch (error: unknown) {
    if (hasStatus401(error)) {
      return { success: false, had401: true };
    }
    
    if (callbacks.setIslandExerciseData) {
      callbacks.setIslandExerciseData({});
    }
  }
  
  // Kratky delay zabrani okamzitemu flickeru pri prvom rendri
  setTimeout(() => {
    callbacks.setIsInitialLoad(false);
  }, 100);
  
  return {
    success: true,
    had401: false,
    islandProgress: islandsData || undefined
  };
}
