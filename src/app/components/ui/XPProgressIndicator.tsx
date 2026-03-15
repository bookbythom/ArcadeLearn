import { UserProgress } from "@/app/utils/progressionUtils";

type IslandStatus = "locked" | "unlocked" | "completed-perfect" | "completed-mistakes";

interface XPProgressIndicatorProps {
  userProgress: UserProgress;
  currentLevel: 'beginner' | 'intermediate' | 'professional';
  isVisible: boolean;
  islandProgress: Record<string, IslandStatus>;
}

const FINAL_TEST_XP = 300;

// Hlavny komponent pre XP progress
export default function XPProgressIndicator({ userProgress, currentLevel, isVisible, islandProgress }: XPProgressIndicatorProps) {
  if (!isVisible) {
    return null;
  }

  // Funkcia na kontrolu ci je sekcia zamknuta
  const checkIfSectionLocked = () => {
    if (currentLevel === 'beginner') {
      return false; // Beginner je vzdy odomknuty
    }
    
    if (currentLevel === 'intermediate') {
      // Intermediate sa odomkne po dokonceni beginner final testu
      const beginnerFinal = islandProgress['beginner-0'];
      
      if (!beginnerFinal) {
        return true;
      }
      
      if (beginnerFinal === 'locked') {
        return true;
      }
      
      if (beginnerFinal === 'unlocked') {
        return true;
      }
      
      return false;
    }
    
    if (currentLevel === 'professional') {
      // Professional sa odomkne po dokonceni intermediate final testu
      const intermediateFinal = islandProgress['intermediate-0'];
      
      if (!intermediateFinal) {
        return true;
      }
      
      if (intermediateFinal === 'locked') {
        return true;
      }
      
      if (intermediateFinal === 'unlocked') {
        return true;
      }
      
      return false;
    }
    
    return false;
  };

  const sectionLocked = checkIfSectionLocked();

  // Zobrazenie locked spravy
  if (sectionLocked) {
    let levelName = '';
    
    if (currentLevel === 'beginner') {
      levelName = 'Beginner';
    } else if (currentLevel === 'intermediate') {
      levelName = 'Intermediate';
    } else if (currentLevel === 'professional') {
      levelName = 'Professional';
    }

    return (
      <div 
        className="fixed top-[calc(clamp(4.25rem,11vw,4.75rem)+env(safe-area-inset-top)+0.5rem)] sm:top-[calc(4rem+env(safe-area-inset-top)+0.75rem)] left-1/2 sm:left-4 lg:left-8 -translate-x-1/2 sm:translate-x-0 z-50 backdrop-blur-lg bg-[rgba(28,28,30,0.95)] border border-[rgba(255,255,255,0.2)] rounded-lg shadow-2xl p-3 sm:p-4 lg:p-5 w-[calc(100vw-1.5rem)] max-w-[340px] transition-opacity duration-300"
      >
        {/* Lock ikona */}
        <div className="flex items-center gap-3 mb-3">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <div className="text-xl sm:text-2xl font-bold text-gray-300">
            {levelName} Locked
          </div>
        </div>

        {/* Sprava */}
        <div className="text-sm text-gray-300">
          Complete previous section to unlock{' '}
          <span className="font-semibold text-white">{levelName}</span> section.
        </div>
      </div>
    );
  }

  // Vypocet aktualneho XP
  const xpInCurrentLevel = userProgress.sectionXP[currentLevel];
  const xpStillNeeded = FINAL_TEST_XP - xpInCurrentLevel;
  
  // Vypocet percent progressu
  let percentProgress = (xpInCurrentLevel / FINAL_TEST_XP) * 100;
  
  if (percentProgress > 100) {
    percentProgress = 100;
  }
  
  // Pocitanie dokoncených islandov
  let completedCount = 0;
  
  for (let i = 1; i <= 12; i++) {
    const islandKey = currentLevel + '-' + i;
    const islandStatus = islandProgress[islandKey];
    
    if (islandStatus === "completed-perfect") {
      completedCount = completedCount + 1;
    } else if (islandStatus === "completed-mistakes") {
      completedCount = completedCount + 1;
    }
  }
  
  // Kontrola ci je final test odomknuty
  let hasXP = false;
  if (xpInCurrentLevel >= FINAL_TEST_XP) {
    hasXP = true;
  }
  
  let hasAllIslands = false;
  if (completedCount >= 12) {
    hasAllIslands = true;
  }
  
  let finalTestUnlocked = false;
  if (hasXP && hasAllIslands) {
    finalTestUnlocked = true;
  }

  // Farby pre jednotlive levely
  let barColor = '#C69C6D'; // beginner
  if (currentLevel === 'intermediate') {
    barColor = '#EC4545';
  } else if (currentLevel === 'professional') {
    barColor = '#6E44FF';
  }

  return (
    <div 
      className="fixed top-[calc(clamp(4.25rem,11vw,4.75rem)+env(safe-area-inset-top)+0.5rem)] sm:top-[calc(4rem+env(safe-area-inset-top)+0.75rem)] left-1/2 sm:left-4 lg:left-8 -translate-x-1/2 sm:translate-x-0 z-50 backdrop-blur-lg bg-[rgba(28,28,30,0.95)] border border-[rgba(255,255,255,0.2)] rounded-lg shadow-2xl p-3 sm:p-4 lg:p-5 w-[calc(100vw-1.5rem)] max-w-[340px] transition-opacity duration-300"
    >
      {/* Zobrazenie XP */}
      <div className="mb-3">
        <div className="flex items-baseline justify-between mb-3">
          <span className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white transition-all duration-300">
            {xpInCurrentLevel}
          </span>
          <span className="text-sm sm:text-base lg:text-lg text-gray-400">
            / {FINAL_TEST_XP} XP
          </span>
        </div>

        {/* Priebehova lista */}
        <div className="relative w-full h-2.5 bg-[#2c2c2e] rounded-full overflow-hidden">
          <div 
            className="absolute inset-0 rounded-full transition-all duration-500 ease-out"
            style={{
              width: percentProgress + '%',
              backgroundColor: barColor,
              boxShadow: '0 0 10px ' + barColor + '40'
            }}
          />
        </div>
      </div>

      {/* Stavova sprava */}
      {finalTestUnlocked ? (
        <div className="flex items-center gap-2 text-green-400 text-sm transition-all duration-300">
          <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span className="font-medium">Final Test Unlocked!</span>
        </div>
      ) : (
        <div className="text-sm text-gray-300 transition-all duration-300">
          <span className="font-semibold transition-colors duration-300" style={{ color: barColor }}>
            {xpStillNeeded < 0 ? 0 : xpStillNeeded} XP
          </span>
          {' '}and{' '}
          <span className="font-semibold transition-colors duration-300" style={{ color: barColor }}>
            {12 - completedCount} island{(12 - completedCount) !== 1 ? 's' : ''}
          </span>
          {' '}needed to unlock final test.
        </div>
      )}
    </div>
  );
}
