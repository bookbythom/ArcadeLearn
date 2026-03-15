// Rozhranie pre user progress
export interface UserProgress {
  totalXP: number;
  level: number;
  sectionXP: {
    beginner: number;
    intermediate: number;
    professional: number;
  };
}

// Konstanty pre XP system
const XP_PER_CORRECT_ANSWER = 5;
const FINAL_TEST_UNLOCK_XP = 300;
const MAX_LEVEL = 15;
const MAX_TOTAL_XP_FOR_LEVELING = 1050; // 3 urovne * 350 XP za 100%
const XP_PER_LEVEL = 70;

function clamp(value: number, min: number, max: number): number {
  if (value < min) {
    return min;
  }
  if (value > max) {
    return max;
  }
  return value;
}

function getLevelStartXp(level: number): number {
  const safeLevel = clamp(level, 0, MAX_LEVEL);
  return safeLevel * XP_PER_LEVEL;
}

// Funkcia na vypocet levelu
function calculateLevel(totalXP: number): number {
  if (totalXP === undefined || totalXP === null || isNaN(totalXP)) {
    return 0;
  }

  const safeTotalXp = clamp(totalXP, 0, MAX_TOTAL_XP_FOR_LEVELING);
  const computedLevel = Math.floor(safeTotalXp / XP_PER_LEVEL);
  return clamp(computedLevel, 0, MAX_LEVEL);
}

// Vypocet zarobionych XP
export function calculateXPEarned(_totalExercises: number, correctAnswers: number): number {
  let earnedXP = 0;
  
  // Za kazdu spravnu odpoved
  for (let i = 0; i < correctAnswers; i++) {
    earnedXP = earnedXP + XP_PER_CORRECT_ANSWER;
  }
  
  return earnedXP;
}

// Pridanie XP do progressu
export function addXP(
  currentProgress: UserProgress,
  xpToAdd: number,
  section: 'beginner' | 'intermediate' | 'professional'
): UserProgress {
  const newTotal = currentProgress.totalXP + xpToAdd;
  const newLvl = calculateLevel(newTotal);
  
  let newBeginnerXP = currentProgress.sectionXP.beginner;
  let newIntermediateXP = currentProgress.sectionXP.intermediate;
  let newProfessionalXP = currentProgress.sectionXP.professional;
  
  if (section === 'beginner') {
    newBeginnerXP = newBeginnerXP + xpToAdd;
  } else if (section === 'intermediate') {
    newIntermediateXP = newIntermediateXP + xpToAdd;
  } else if (section === 'professional') {
    newProfessionalXP = newProfessionalXP + xpToAdd;
  }

  return {
    totalXP: newTotal,
    level: newLvl,
    sectionXP: {
      beginner: newBeginnerXP,
      intermediate: newIntermediateXP,
      professional: newProfessionalXP,
    },
  };
}

// Kontrola ci je final test odomknuty
export function isFinalTestUnlocked(sectionXP: number): boolean {
  return sectionXP >= FINAL_TEST_UNLOCK_XP;
}

// Vypocet progressu v aktuálnom leveli (percenta)
export function getLevelProgress(totalXP: number): number {
  // Kontrola ci je XP platne
  if (totalXP === undefined || totalXP === null) {
    return 0;
  }
  
  if (isNaN(totalXP)) {
    return 0;
  }

  const safeTotalXp = clamp(totalXP, 0, MAX_TOTAL_XP_FOR_LEVELING);
  const currentLevel = calculateLevel(safeTotalXp);

  if (currentLevel >= MAX_LEVEL) {
    return 100;
  }

  const currentLevelStartXp = getLevelStartXp(currentLevel);
  const nextLevelStartXp = getLevelStartXp(currentLevel + 1);
  const xpWindow = Math.max(1, nextLevelStartXp - currentLevelStartXp);
  const xpInsideWindow = safeTotalXp - currentLevelStartXp;

  const percentage = (xpInsideWindow / xpWindow) * 100;
  return Math.round(clamp(percentage, 0, 100));
}