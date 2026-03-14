import { useRef, useEffect, useState } from "react";
import IslandRenderer from "@/app/components/islands/IslandRenderer";
import { SectionHeader } from "@/app/components/homepage/SectionHeader";
import { BeginnerIllustrations } from "@/app/components/homepage/BeginnerIllustrations";
import { IntermediateIllustrations } from "@/app/components/homepage/IntermediateIllustrations";
import { ProfessionalIllustrations } from "@/app/components/homepage/ProfessionalIllustrations";
import XPProgressIndicator from "@/app/components/ui/XPProgressIndicator";
import type { UserProgress } from "@/app/utils/progressionUtils";
import { isFinalTestUnlocked } from "@/app/utils/progressionUtils";

// Typy pre stav ostrova
type IslandStatus = "locked" | "unlocked" | "completed-perfect" | "completed-mistakes";

// Rozhranie pre progress ostrovov
interface IslandProgress {
  [key: string]: IslandStatus;
}

// Rozhranie pre data o cviceniach
interface IslandExerciseData {
  [key: string]: number;
}

// Vlastnosti pre HomePage komponent
interface HomePageProps {
  userProgress: UserProgress;
  islandProgress: IslandProgress;
  islandExerciseData: IslandExerciseData;
  isAdmin: boolean;
  accessToken: string;
  isLoggedIn: boolean;
  shouldAutoScroll: boolean;
  autoScrollTarget: { level: "beginner" | "intermediate" | "professional"; theme: number } | null;
  onVisibleSectionChange: (section: 'beginner' | 'intermediate' | 'professional') => void;
  onIslandClick: (level: "beginner" | "intermediate" | "professional", theme: number, isFinal: boolean) => void;
  onIslandHover?: (level: "beginner" | "intermediate" | "professional", theme: number, isFinal: boolean) => void;
  onAutoScrollComplete: () => void;
}

// Pozicie ostrovov na mape - fixne data pre layout
const islandPositions = [
  { left: '50%', top: '0%' }, 
  { left: '37%', top: '8%' }, 
  { left: '24%', top: '16%' }, 
  { left: '11%', top: '24%' },
  { left: '24%', top: '32%' }, 
  { left: '37%', top: '40%' }, 
  { left: '50%', top: '48%' }, 
  { left: '63%', top: '56%' },
  { left: '76%', top: '64%' }, 
  { left: '89%', top: '72%' }, 
  { left: '76%', top: '80%' }, 
  { left: '63%', top: '88%' },
  { left: '50%', top: '96%' },
];

// Hlavny HomePage komponent
export function HomePage(props: HomePageProps) {
  // Referencie na sekcie pre scrollovanie
  const beginnerSectionRef = useRef<HTMLElement>(null);
  const intermediateSectionRef = useRef<HTMLElement>(null);
  const professionalSectionRef = useRef<HTMLElement>(null);
  
  // State pre sledovanie viditelnej sekcie
  const [visibleSection, setVisibleSection] = useState<'beginner' | 'intermediate' | 'professional'>('beginner');

  // Funkcia na ziskanie stavu ostrova
  const getIslandStatus = (levelName: string, themeNumber: number): IslandStatus => {
    // Ak je admin, vsetko je odomknute
    if (props.isAdmin === true) {
      return "unlocked";
    }
    
    // Vytvorime kluc pre ostrov
    const islandKey = levelName + '-' + themeNumber;
    
    // Specialny handling pre finalny test (tema 0)
    if (themeNumber === 0) {
      // Zistime XP pre danu sekciu
      let sectionXpValue = 0;
      if (levelName === 'beginner') {
        sectionXpValue = props.userProgress.sectionXP.beginner;
      } else if (levelName === 'intermediate') {
        sectionXpValue = props.userProgress.sectionXP.intermediate;
      } else if (levelName === 'professional') {
        sectionXpValue = props.userProgress.sectionXP.professional;
      }
      
      // Skontrolujeme ci je finalny test odomknuty
      const isFinalTestUnlockedNow = isFinalTestUnlocked(sectionXpValue);
      if (isFinalTestUnlockedNow === false) {
        return "locked";
      }
      
      // Spocitame kolko ostrovov je dokoncene
      let completedIslandsCount = 0;
      let i = 1;
      while (i <= 12) {
        const checkKey = levelName + '-' + i;
        const islandStatus = props.islandProgress[checkKey];
        if (islandStatus === "completed-perfect" || islandStatus === "completed-mistakes") {
          completedIslandsCount = completedIslandsCount + 1;
        }
        i = i + 1;
      }
      
      // Ak nie su vsetky ostrovy dokoncene, test je zamknute
      if (completedIslandsCount < 12) {
        return "locked";
      }
    }
    
    // Vratime status z progress objektu alebo locked ak neexistuje
    const statusFromProgress = props.islandProgress[islandKey];
    if (statusFromProgress) {
      return statusFromProgress;
    } else {
      return "locked";
    }
  };

  // Funkcia na ziskanie poctu spravnych cviceni
  const getIslandExerciseData = (levelName: string, themeNumber: number): number => {
    const islandKey = levelName + '-' + themeNumber;
    const exerciseData = props.islandExerciseData[islandKey];
    if (exerciseData) {
      return exerciseData;
    } else {
      return 0;
    }
  };

  // Funkcia na vykreslenie ostrovov pre danu uroven
  function renderIslandsForLevel(levelName: 'beginner' | 'intermediate' | 'professional') {
    const resultElements = [];
    
    // Najprv vykreslime 12 normalnych ostrovov
    let islandIndex = 0;
    while (islandIndex < 12) {
      const themeNumber = islandIndex + 1;
      const positionData = islandPositions[islandIndex];
      
      const islandStatus = getIslandStatus(levelName, themeNumber);
      const exercisesCorrect = getIslandExerciseData(levelName, themeNumber);
      
      const islandElement = (
        <div 
          key={'island-' + themeNumber} 
          className="absolute" 
          data-island-key={`${levelName}-${themeNumber}`}
          style={{ 
            left: positionData.left, 
            top: positionData.top, 
            transform: 'translateX(-50%)' 
          }}
        >
          <IslandRenderer 
            level={levelName} 
            theme={themeNumber} 
            status={islandStatus} 
            onClick={() => {
              props.onIslandClick(levelName, themeNumber, false);
            }} 
            onHover={() => {
              props.onIslandHover?.(levelName, themeNumber, false);
            }}
            isAdmin={props.isAdmin} 
            accessToken={props.accessToken} 
            exercisesCorrect={exercisesCorrect} 
          />
        </div>
      );
      
      resultElements.push(islandElement);
      islandIndex = islandIndex + 1;
    }
    
    // Potom vykreslime finalny test ostrov (tema 0)
    const finalTestPosition = islandPositions[12];
    const finalTestStatus = getIslandStatus(levelName, 0);
    const finalTestExercises = getIslandExerciseData(levelName, 0);
    
    const finalTestElement = (
      <div 
        key="island-final-test" 
        className="absolute" 
        data-island-key={`${levelName}-0`}
        style={{ 
          left: finalTestPosition.left, 
          top: finalTestPosition.top, 
          transform: 'translateX(-50%)' 
        }}
      >
        <IslandRenderer 
          level={levelName} 
          theme={0} 
          status={finalTestStatus} 
          onClick={() => {
            props.onIslandClick(levelName, 0, true);
          }} 
          onHover={() => {
            props.onIslandHover?.(levelName, 0, true);
          }}
          isAdmin={props.isAdmin} 
          accessToken={props.accessToken} 
          exercisesCorrect={finalTestExercises} 
        />
      </div>
    );
    
    resultElements.push(finalTestElement);
    
    return resultElements;
  }

  // Effect pre sledovanie viditelnej sekcie pomocou Intersection Observer
  useEffect(() => {
    // Skontrolujeme ci su referencie dostupne
    const beginnerRefExists = beginnerSectionRef.current !== null;
    const intermediateRefExists = intermediateSectionRef.current !== null;
    const professionalRefExists = professionalSectionRef.current !== null;
    
    if (!beginnerRefExists || !intermediateRefExists || !professionalRefExists) {
      return;
    }
    
    // Mapa pre sledovanie intersection ratio
    const intersectionRatioMap = new Map<HTMLElement, number>();
    
    // Callback funkcia pre observer
    const observerCallback = (entriesArray: IntersectionObserverEntry[]) => {
      // Prejdeme vsetky entries a aktualizujeme mapu
      let entryIndex = 0;
      while (entryIndex < entriesArray.length) {
        const currentEntry = entriesArray[entryIndex];
        
        if (currentEntry.isIntersecting === true) {
          intersectionRatioMap.set(
            currentEntry.target as HTMLElement, 
            currentEntry.intersectionRatio
          );
        } else {
          intersectionRatioMap.delete(currentEntry.target as HTMLElement);
        }
        
        entryIndex = entryIndex + 1;
      }
      
      // Najdeme sekciu s najvyssim intersection ratio
      let maxRatioValue = 0;
      let mostVisibleSectionName: 'beginner' | 'intermediate' | 'professional' | null = null;
      
      intersectionRatioMap.forEach((ratioValue, htmlElement) => {
        if (ratioValue > maxRatioValue) {
          maxRatioValue = ratioValue;
          
          if (htmlElement === beginnerSectionRef.current) {
            mostVisibleSectionName = 'beginner';
          } else if (htmlElement === intermediateSectionRef.current) {
            mostVisibleSectionName = 'intermediate';
          } else if (htmlElement === professionalSectionRef.current) {
            mostVisibleSectionName = 'professional';
          }
        }
      });
      
      // Ak sme nasli viditelnu sekciu, aktualizujeme state
      if (mostVisibleSectionName !== null) {
        setVisibleSection(mostVisibleSectionName);
        props.onVisibleSectionChange(mostVisibleSectionName);
      }
    };
    
    // Vytvorime observer
    const intersectionObserver = new IntersectionObserver(
      observerCallback,
      { 
        root: null, 
        rootMargin: '-20% 0px -20% 0px', 
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0] 
      }
    );
    
    // Pozorujeme vsetky sekcie
    intersectionObserver.observe(beginnerSectionRef.current);
    intersectionObserver.observe(intermediateSectionRef.current);
    intersectionObserver.observe(professionalSectionRef.current);
    
    // Cleanup funkcia
    return () => { 
      intersectionObserver.disconnect(); 
      intersectionRatioMap.clear(); 
    };
  }, [props.userProgress, props.islandProgress, props.onVisibleSectionChange]);

  // Effect pre automaticke scrollovanie k prvemu odomknutemu ostrovu
  useEffect(() => {
    // Skontrolujeme podmienky pre auto scroll
    const shouldPerformAutoScroll = props.shouldAutoScroll === true;
    const userIsLoggedIn = props.isLoggedIn === true;
    
    if (!shouldPerformAutoScroll || !userIsLoggedIn) {
      return;
    }
    
    // Funkcia na najdenie prveho odomknuteho ostrova
    const findFirstUnlockedLevel = () => {
      // Prejdeme vsetky urovne
      const levelsToCheck = ['beginner', 'intermediate', 'professional'];
      
      let levelIndex = 0;
      while (levelIndex < levelsToCheck.length) {
        const currentLevel = levelsToCheck[levelIndex];
        
        // Prejdeme vsetky ostrovy v urovni (1-12)
        let islandNumber = 1;
        while (islandNumber <= 12) {
          const islandKey = currentLevel + '-' + islandNumber;
          const islandStatus = props.islandProgress[islandKey];
          
          if (islandStatus === 'unlocked') {
            return currentLevel as 'beginner' | 'intermediate' | 'professional';
          }
          
          islandNumber = islandNumber + 1;
        }
        
        // Skontrolujeme aj finalny test (0)
        const finalTestKey = currentLevel + '-0';
        const finalTestStatus = props.islandProgress[finalTestKey];
        if (finalTestStatus === 'unlocked') {
          return currentLevel as 'beginner' | 'intermediate' | 'professional';
        }
        
        levelIndex = levelIndex + 1;
      }
      
      return null;
    };
    
    // Ak mame konkretny target z LearnPage, pouzijeme ho prednostne.
    const targetIslandKey = props.autoScrollTarget
      ? `${props.autoScrollTarget.level}-${props.autoScrollTarget.theme}`
      : null;

    const scrollToSection = (targetLevel: 'beginner' | 'intermediate' | 'professional') => {
      let sectionRefToScroll = null;
      if (targetLevel === 'beginner') {
        sectionRefToScroll = beginnerSectionRef;
      } else if (targetLevel === 'intermediate') {
        sectionRefToScroll = intermediateSectionRef;
      } else if (targetLevel === 'professional') {
        sectionRefToScroll = professionalSectionRef;
      }

      if (sectionRefToScroll !== null && sectionRefToScroll.current !== null) {
        const elementPosition = sectionRefToScroll.current.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - 64 - 100;
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      }
    };

    const scrollToIsland = (islandKey: string): boolean => {
      const islandElement = document.querySelector(`[data-island-key="${islandKey}"]`) as HTMLElement | null;
      if (!islandElement) {
        return false;
      }

      const elementPosition = islandElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - 64 - 140;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      return true;
    };

    // Najdeme cielovu uroven pre fallback spravanie.
    const targetLevel = findFirstUnlockedLevel();
    
    if (targetLevel !== null) {
      // Nastavime timeout pre smooth scroll
      const timeoutId = setTimeout(() => {
        let scrolledToTargetIsland = false;

        if (targetIslandKey !== null) {
          scrolledToTargetIsland = scrollToIsland(targetIslandKey);
        }

        if (!scrolledToTargetIsland) {
          scrollToSection(targetLevel);
        }
        
        props.onAutoScrollComplete();
      }, 500);
      
      return () => {
        clearTimeout(timeoutId);
      };
    } else {
      // Ak nie je ziadny odomknuty ostrov, hned zavolame callback
      props.onAutoScrollComplete();
    }
  }, [props.shouldAutoScroll, props.autoScrollTarget, props.isLoggedIn, props.isAdmin, props.islandProgress, props.onAutoScrollComplete]);

  // Render hlavneho contentu
  return (
    <>
      <XPProgressIndicator 
        key={visibleSection}
        userProgress={props.userProgress} 
        currentLevel={visibleSection} 
        isVisible={props.isLoggedIn} 
        islandProgress={props.islandProgress} 
      />
      
      {/* Beginner sekcia */}
      <section ref={beginnerSectionRef} className="py-10 sm:py-14 lg:py-20">
        <div className="w-full px-3 sm:px-6 lg:px-8">
          <SectionHeader level="beginner" />
          <div className="max-w-6xl mx-auto">
            <div className="relative w-full aspect-[3/5] sm:aspect-[6/7] max-h-[1000px]">
              {renderIslandsForLevel('beginner')}
              <BeginnerIllustrations />
            </div>
          </div>
        </div>
      </section>
      
      {/* Intermediate sekcia */}
      <section ref={intermediateSectionRef} className="py-10 sm:py-14 lg:py-20">
        <div className="w-full px-3 sm:px-6 lg:px-8">
          <SectionHeader level="intermediate" />
          <div className="max-w-6xl mx-auto">
            <div className="relative w-full aspect-[3/5] sm:aspect-[6/7] max-h-[1000px]">
              {renderIslandsForLevel('intermediate')}
              <IntermediateIllustrations />
            </div>
          </div>
        </div>
      </section>
      
      {/* Professional sekcia */}
      <section ref={professionalSectionRef} className="py-10 sm:py-14 lg:py-20">
        <div className="w-full px-3 sm:px-6 lg:px-8">
          <SectionHeader level="professional" />
          <div className="max-w-6xl mx-auto">
            <div className="relative w-full aspect-[3/5] sm:aspect-[6/7] max-h-[1000px]">
              {renderIslandsForLevel('professional')}
              <ProfessionalIllustrations />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}