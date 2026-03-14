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
const xpCorrect = 5; // Opravene z 10 na 5 XP za spravne cvicenie
const finalTestXp = 300;
const maxLevel = 15;
const maxTotalXpForLeveling = 1050; // 3 urovne * 350 XP za 100%
const xpPerLevel = 70;

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
  const safeLevel = clamp(level, 0, maxLevel);
  return safeLevel * xpPerLevel;
}

// Funkcia na vypocet levelu
function calculateLevel(totalXP: number): number {
  if (totalXP === undefined || totalXP === null || isNaN(totalXP)) {
    return 0;
  }

  const safeTotalXp = clamp(totalXP, 0, maxTotalXpForLeveling);
  const computedLevel = Math.floor(safeTotalXp / xpPerLevel);
  return clamp(computedLevel, 0, maxLevel);
}

// Vypocet zarobionych XP
export function calculateXPEarned(_totalExercises: number, correctAnswers: number): number {
  let earnedXP = 0;
  
  // Za kazdu spravnu odpoved
  for (let i = 0; i < correctAnswers; i++) {
    earnedXP = earnedXP + xpCorrect;
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
  return sectionXP >= finalTestXp;
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

  const safeTotalXp = clamp(totalXP, 0, maxTotalXpForLeveling);
  const currentLevel = calculateLevel(safeTotalXp);

  if (currentLevel >= maxLevel) {
    return 100;
  }

  const currentLevelStartXp = getLevelStartXp(currentLevel);
  const nextLevelStartXp = getLevelStartXp(currentLevel + 1);
  const xpWindow = Math.max(1, nextLevelStartXp - currentLevelStartXp);
  const xpInsideWindow = safeTotalXp - currentLevelStartXp;

  const percentage = (xpInsideWindow / xpWindow) * 100;
  return Math.round(clamp(percentage, 0, 100));
}