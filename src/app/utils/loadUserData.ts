import { profileAPI, progressAPI } from './api';

// Funkcia na nacitanie user dat z backendu
export async function loadUserData(
  token: string,
  currentUserEmail: string,
  callbacks: {
    setUserProfile: (profile: any) => void;
    setUserProgress: (progress: any) => void;
    setIslandProgress: (islands: any) => void;
    setIslandExerciseData?: (exerciseData: any) => void;
    setStreakCount: (streak: number) => void;
    setStreakActiveToday?: (active: boolean) => void;
    setIsInitialLoad: (loading: boolean) => void;
    handleAPIError: (error: any, context: string) => Promise<void>;
  }
): Promise<{ success: boolean; had401: boolean; islandProgress?: any }> {
  let islandsData: any = null;
  
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
  } catch (error: any) {
    if (error?.status === 401) {
      return { success: false, had401: true };
    }
    
    // Fallback profil
    let userName = currentUserEmail.split('@')[0];
    if (!userName) {
      userName = 'User';
    }
    
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
  } catch (error: any) {
    if (error?.status === 401) {
      return { success: false, had401: true };
    }
    
    // Defaultny progress
    const defaultProgress = {
      level: 0,
      totalXP: 0,
      sectionXP: {
        beginner: 0,
        intermediate: 0,
        professional: 0
      }
    };
    
    callbacks.setUserProgress(defaultProgress);
  }

  // Nacitanie island progressu
  try {
    const islands = await progressAPI.getIslands(token);
    islandsData = islands;
    callbacks.setIslandProgress(islands);
  } catch (error: any) {
    if (error?.status === 401) {
      return { success: false, had401: true };
    }
    
    // Defaultne odomknuty prvy island
    const defaultIslands = { "beginner-1": "unlocked" };
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
      let isActive = streak.activeToday;
      if (!isActive) {
        isActive = false;
      }
      callbacks.setStreakActiveToday(isActive);
    }
  } catch (error: any) {
    if (error?.status === 401) {
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
  } catch (error: any) {
    if (error?.status === 401) {
      return { success: false, had401: true };
    }
    
    if (callbacks.setIslandExerciseData) {
      callbacks.setIslandExerciseData({});
    }
  }
  
  // Ukoncenie nacitavania po kratkom delay
  setTimeout(() => {
    callbacks.setIsInitialLoad(false);
  }, 100);
  
  return {
    success: true,
    had401: false,
    islandProgress: islandsData
  };
}
