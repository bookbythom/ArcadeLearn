import { mistakesAPI } from '@/app/utils/api';
import { beginnerThemes } from '@/app/data/beginnerthemes';
import { intermediateThemes } from '@/app/data/intermediatethemes';
import { professionalThemes } from '@/app/data/professionalthemes';

// Typy pre mistakes
export interface MistakeExercise {
  type: 'single-choice' | 'multiple-choice' | 'sorting' | 'matching' | 'true-false';
  question: string;
  userAnswer: unknown;
  correctAnswer: unknown;
  timestamp: number;
  categories?: string[];
}

export interface ThemeMistakes {
  themeName: string;
  level: 'beginner' | 'intermediate' | 'professional';
  theme: number;
  mistakes: MistakeExercise[];
}

export interface UserMistakes {
  [key: string]: ThemeMistakes;
}

// Nacitanie mistakes z localStorage
export function getUserMistakes(userEmail: string): UserMistakes {
  if (typeof window === 'undefined') {
    return {};
  }
  
  if (!userEmail) {
    return {};
  }
  
  const storageKey = 'mistakes_' + userEmail;
  const savedData = localStorage.getItem(storageKey);
  
  if (savedData) {
    try {
      const parsedData = JSON.parse(savedData);
      
      // Kontrola ci je to pole (stary format)
      if (Array.isArray(parsedData)) {
        const emptyObj = {};
        localStorage.setItem(storageKey, JSON.stringify(emptyObj));
        return emptyObj;
      }
      
      return parsedData;
    } catch (e) {
      return {};
    }
  }
  
  return {};
}

// Ulozenie mistakes do localStorage
export function saveUserMistakes(mistakes: UserMistakes, userEmail: string): void {
  if (typeof window === 'undefined') {
    return;
  }
  
  if (!userEmail) {
    return;
  }
  
  const storageKey = 'mistakes_' + userEmail;
  const jsonString = JSON.stringify(mistakes);
  localStorage.setItem(storageKey, jsonString);
}

// Synchronizacia mistakes na backend
export async function syncMistakesToBackend(accessToken: string, mistakes: UserMistakes): Promise<void> {
  if (!accessToken) {
    return;
  }
  
  if (accessToken === 'DEMO_TOKEN') {
    return;
  }

  try {
    await mistakesAPI.addMistake(accessToken, mistakes);
  } catch (error) {
    // Tichý error handling
  }
}

// Nacitanie mistakes z backendu
export async function loadMistakesFromBackend(accessToken: string, userEmail: string): Promise<UserMistakes> {
  if (!accessToken) {
    return getUserMistakes(userEmail);
  }
  
  if (accessToken === 'DEMO_TOKEN') {
    return getUserMistakes(userEmail);
  }

  try {
    const backendData = await mistakesAPI.getMistakes(accessToken);
    
    // Kontrola ci su data validne
    let isValidData = false;
    
    if (backendData) {
      if (typeof backendData === 'object') {
        if (!Array.isArray(backendData)) {
          isValidData = true;
        }
      }
    }
    
    if (isValidData) {
      // Vycistenie nevalidnych tem
      const cleaned = cleanInvalidThemes(backendData);
      saveUserMistakes(cleaned, userEmail);
      
      // Pocitanie celkoveho poctu chyb
      let totalCount = 0;
      const values = Object.values(cleaned);
      
      for (let i = 0; i < values.length; i++) {
        const theme = values[i] as ThemeMistakes;
        if (theme.mistakes) {
          totalCount = totalCount + theme.mistakes.length;
        }
      }
      
      if (totalCount > 0) {
        markHasHadMistakes(userEmail);
      }
      
      return cleaned;
    } else if (Array.isArray(backendData)) {
      return {};
    }
  } catch (error) {
    // Tichý error handling
  }
  
  return getUserMistakes(userEmail);
}

// Nahradenie mistakes pre konkretnu temu
export async function replaceThemeMistakes(
  userEmail: string,
  level: 'beginner' | 'intermediate' | 'professional',
  theme: number,
  themeName: string,
  newMistakes: MistakeExercise[],
  accessToken?: string
): Promise<void> {
  const currentMistakes = getUserMistakes(userEmail);
  const themeKey = level + '-' + theme;
  
  if (newMistakes.length > 0) {
    currentMistakes[themeKey] = {
      themeName: themeName,
      level: level,
      theme: theme,
      mistakes: newMistakes
    };
    markHasHadMistakes(userEmail);
  } else {
    delete currentMistakes[themeKey];
  }
  
  saveUserMistakes(currentMistakes, userEmail);
  
  if (accessToken) {
    await syncMistakesToBackend(accessToken, currentMistakes);
  }
}

// Kontrola ci tema existuje
function checkThemeExists(level: 'beginner' | 'intermediate' | 'professional', theme: number): boolean {
  // Final testy (tema 0) su vzdy validne
  if (theme === 0) {
    return true;
  }
  
  // Vyber spravneho theme array
  let themesArray;
  
  if (level === 'beginner') {
    themesArray = beginnerThemes;
  } else if (level === 'intermediate') {
    themesArray = intermediateThemes;
  } else if (level === 'professional') {
    themesArray = professionalThemes;
  } else {
    return false;
  }
  
  // Tema cislo je 1-indexed, array je 0-indexed
  if (theme >= 1 && theme <= themesArray.length) {
    return true;
  }
  
  return false;
}

// Ziskanie mistakes zoskupenych podla temy
export function getMistakesGroupedByTheme(userEmail: string): ThemeMistakes[] {
  const allMistakes = getUserMistakes(userEmail);
  
  const result: ThemeMistakes[] = [];
  const values = Object.values(allMistakes);
  
  for (let i = 0; i < values.length; i++) {
    const theme = values[i];
    
    // Musi mat mistakes
    let hasMistakes = false;
    if (theme.mistakes) {
      if (theme.mistakes.length > 0) {
        hasMistakes = true;
      }
    }
    
    if (!hasMistakes) {
      continue;
    }
    
    // Musi byt validna tema
    const isValid = checkThemeExists(theme.level, theme.theme);
    if (!isValid) {
      continue;
    }
    
    result.push(theme);
  }
  
  return result;
}

// Celkovy pocet mistakes
export function getTotalMistakesCount(userEmail: string): number {
  const allMistakes = getUserMistakes(userEmail);
  let total = 0;
  
  const values = Object.values(allMistakes);
  
  for (let i = 0; i < values.length; i++) {
    const theme = values[i];
    total = total + theme.mistakes.length;
  }
  
  return total;
}

// Kontrola ci uzivatel niekedy mal chyby
export function hasEverHadMistakes(userEmail: string): boolean {
  if (typeof window === 'undefined') {
    return false;
  }
  
  if (!userEmail) {
    return false;
  }
  
  const historyKey = 'mistakes_history_' + userEmail;
  const historyValue = localStorage.getItem(historyKey);
  
  if (historyValue === 'true') {
    return true;
  }
  
  return false;
}

// Oznacenie ze uzivatel mal chyby
export function markHasHadMistakes(userEmail: string): void {
  if (typeof window === 'undefined') {
    return;
  }
  
  if (!userEmail) {
    return;
  }
  
  const historyKey = 'mistakes_history_' + userEmail;
  localStorage.setItem(historyKey, 'true');
}

// Kontrola ci su vsetky chyby opravene
export function hasFixedAllMistakes(userEmail: string): boolean {
  const currentCount = getTotalMistakesCount(userEmail);
  const hadMistakes = hasEverHadMistakes(userEmail);
  
  if (hadMistakes && currentCount === 0) {
    return true;
  }
  
  return false;
}

// Vycistenie nevalidnych tem
export function cleanInvalidThemes(mistakes: UserMistakes): UserMistakes {
  const cleanedResult: UserMistakes = {};
  
  const keys = Object.keys(mistakes);
  
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const themeMistakes = mistakes[key];
    
    const isValid = checkThemeExists(themeMistakes.level, themeMistakes.theme);
    
    if (isValid) {
      cleanedResult[key] = themeMistakes;
    }
  }
  
  return cleanedResult;
}
