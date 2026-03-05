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
const xpPerLevel = 100;
const xpCorrect = 5; // Opravene z 10 na 5 XP za spravne cvicenie
const finalTestXp = 300;

// Funkcia na vypocet levelu
function calculateLevel(totalXP: number): number {
  let lvl = 1;
  let xp = totalXP;
  
  while (xp >= xpPerLevel) {
    xp = xp - xpPerLevel;
    lvl = lvl + 1;
  }
  
  return lvl;
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
  
  // Vypocet XP v aktualnom leveli
  let currentLevelXP = totalXP;
  while (currentLevelXP >= xpPerLevel) {
    currentLevelXP = currentLevelXP - xpPerLevel;
  }
  
  // Prevedenie na percenta
  const percentage = (currentLevelXP / xpPerLevel) * 100;
  
  // Zaokruhlenie
  const roundedPercentage = Math.round(percentage);
  
  return roundedPercentage;
}