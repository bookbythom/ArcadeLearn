import { useState, useEffect } from 'react';
import { replaceThemeMistakes } from "@/app/utils/mistakesUtils";
import { Dot } from './Dot';
import ResultPage from './ResultPage';
import ExerciseTypePopup from '@/app/components/reusable/ExerciseTypePopup';
import { LoadingSpinner } from '@/app/components/ui/LoadingSpinner';
import { getThemeData, getExerciseTypeName } from "@/app/utils/learnPageUtils";
import { initializeExerciseStates } from "@/app/utils/exerciseStateUtils";
import { createMistakesFromResults } from "@/app/utils/mistakeCreationUtils";
import { renderExerciseByType, renderContentSlide } from "@/app/utils/exerciseRendererUtils";

// Interface pre properties komponentu LearnPage
interface LearnPageProps {
  level: "beginner" | "intermediate" | "professional";
  theme: number;
  onBack: () => void;
  onComplete?: (correctAnswers: number, totalExercises: number) => void;
  userEmail: string;
  themeName: string;
  isAdmin?: boolean;
  accessToken?: string;
}

// Hlavny komponent pre ucenie sa a cvicenia na ostrove
export default function LearnPage(props: LearnPageProps) {
  // Ziskanie dat pre aktualne temu
  const themeData = getThemeData(props.level, props.theme);
  const isFinalTest = props.theme === 0;
  const numberOfExercises = themeData.exercises.length;
  const totalSlidesCount = isFinalTest ? numberOfExercises : numberOfExercises + 1;

  // State premenne
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [timerSeconds, setTimerSeconds] = useState(30);
  const [canUserProceed, setCanUserProceed] = useState(false);
  const [showResultsPage, setShowResultsPage] = useState(false);
  const [exerciseResults, setExerciseResults] = useState<boolean[]>([]);
  const [reviewModeActive, setReviewModeActive] = useState(false);
  const [incorrectExerciseIndices, setIncorrectExerciseIndices] = useState<number[]>([]);
  const [hasCalledCompleteCallback, setHasCalledCompleteCallback] = useState(false);
  const [showExerciseTypePopup, setShowExerciseTypePopup] = useState(false);
  const [currentExerciseTypeName, setCurrentExerciseTypeName] = useState("");
  const [visitedSlides, setVisitedSlides] = useState<Set<number>>(new Set([0]));
  const [exerciseStates, setExerciseStates] = useState<{ [key: number]: any }>({});
  const [isInitialized, setIsInitialized] = useState(false);

  // Inicializacia stavov pre cvicenia
  useEffect(() => {
    const initialStates = initializeExerciseStates(themeData.exercises, isFinalTest);
    setExerciseStates(initialStates);
    setIsInitialized(true);
  }, [props.theme, props.level, isFinalTest]);

  // Zobrazenie popup okna s typom cvicenia pre nove slidy
  useEffect(() => {
    const maxExerciseSlideIndex = isFinalTest ? numberOfExercises - 1 : numberOfExercises;
    const isExerciseSlide = isFinalTest 
      ? (currentSlideIndex >= 0 && currentSlideIndex <= maxExerciseSlideIndex) 
      : (currentSlideIndex >= 1 && currentSlideIndex <= maxExerciseSlideIndex);
    
    if (isExerciseSlide && !visitedSlides.has(currentSlideIndex)) {
      const exerciseType = getExerciseTypeName(currentSlideIndex, isFinalTest, themeData.exercises.length, themeData.exercises);
      setCurrentExerciseTypeName(exerciseType);
      setShowExerciseTypePopup(true);
      setVisitedSlides(previousSet => new Set([...previousSet, currentSlideIndex]));
    }
  }, [currentSlideIndex, visitedSlides, isFinalTest, numberOfExercises]);

  // Spracovanie dokoncenia a ulozenie chyb
  useEffect(() => {
    if (showResultsPage && !hasCalledCompleteCallback) {
      const correctCount = exerciseResults.filter(result => result === true).length;
      const newMistakes = createMistakesFromResults(exerciseResults, exerciseStates, themeData, isFinalTest);
      
      replaceThemeMistakes(
        props.userEmail, 
        props.level, 
        props.theme, 
        props.themeName, 
        newMistakes.map(mistake => ({ ...mistake, timestamp: Date.now() })), 
        props.accessToken
      );
      
      if (props.onComplete) {
        props.onComplete(correctCount, numberOfExercises);
      }
      setHasCalledCompleteCallback(true);
    }
  }, [showResultsPage, hasCalledCompleteCallback, exerciseResults, exerciseStates, props.userEmail, props.level, props.theme, props.themeName, props.accessToken, isFinalTest, themeData, numberOfExercises, props.onComplete]);

  // Casovac pre content slide
  useEffect(() => {
    const isContentSlide = !isFinalTest && currentSlideIndex === 0;
    if (!isContentSlide || props.isAdmin) {
      setCanUserProceed(true);
      return;
    }

    setTimerSeconds(30);
    setCanUserProceed(false);

    const intervalId = setInterval(() => {
      setTimerSeconds((previousValue) => {
        if (previousValue <= 1) {
          setCanUserProceed(true);
          clearInterval(intervalId);
          return 0;
        }
        return previousValue - 1;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [currentSlideIndex, props.isAdmin, isFinalTest]);

  // Funkcia pre prechod na dalsi slide
  const handleNextButton = () => {
    if (reviewModeActive) {
      const currentIndex = incorrectExerciseIndices.indexOf(currentSlideIndex);
      if (currentIndex !== -1 && currentIndex < incorrectExerciseIndices.length - 1) {
        setCurrentSlideIndex(incorrectExerciseIndices[currentIndex + 1]);
      } else {
        setShowResultsPage(true);
        setReviewModeActive(false);
      }
    } else {
      if (currentSlideIndex < totalSlidesCount - 1) {
        setCurrentSlideIndex(currentSlideIndex + 1);
      } else {
        setShowResultsPage(true);
      }
    }
  };

  // Funkcia pre prechod na predchadzajuci slide
  const handlePreviousButton = () => {
    if (reviewModeActive) {
      const currentIndex = incorrectExerciseIndices.indexOf(currentSlideIndex);
      if (currentIndex > 0) {
        setCurrentSlideIndex(incorrectExerciseIndices[currentIndex - 1]);
      } else {
        setShowResultsPage(true);
        setReviewModeActive(false);
      }
    } else {
      if (currentSlideIndex > 0) {
        setCurrentSlideIndex(currentSlideIndex - 1);
      } else {
        const confirmExit = window.confirm("Naozaj chcete odísť? Váš pokrok bude stratený.");
        if (confirmExit) {
          props.onBack();
        }
      }
    }
  };

  // Funkcia pre back button
  const handleBackButton = () => {
    if (currentSlideIndex === 0) {
      const confirmExit = window.confirm("Naozaj chcete odísť? Váš pokrok bude stratený.");
      if (confirmExit) {
        props.onBack();
      }
    } else {
      handlePreviousButton();
    }
  };

  // Funkcia pre odoslanie odpovede
  const handleAnswerSubmit = (slideIndex: number, isCorrect: boolean) => {
    setExerciseResults(previousResults => {
      const newResults = [...previousResults];
      newResults[slideIndex] = isCorrect;
      return newResults;
    });
  };

  // Funkcia pre kontrolu chyb
  const handleCheckMistakesButton = () => {
    const incorrectIndices = exerciseResults
      .map((result, index) => (result === false && index > 0 ? index : -1))
      .filter(index => index !== -1);
    
    if (incorrectIndices.length > 0) {
      setIncorrectExerciseIndices(incorrectIndices);
      setCurrentSlideIndex(incorrectIndices[0]);
      setShowResultsPage(false);
      setReviewModeActive(true);
    }
  };

  // Funkcia pre dokoncenie
  const handleFinishButton = () => {
    const correctCount = exerciseResults.filter(result => result === true).length;
    if (props.onComplete && !hasCalledCompleteCallback) {
      props.onComplete(correctCount, numberOfExercises);
      setHasCalledCompleteCallback(true);
    }
    props.onBack();
  };

  // Funkcia pre vykreslovanie navigacneho baru
  const renderNavigationBar = () => {
    const isContentSlide = !isFinalTest && currentSlideIndex === 0;
    const shouldShowTimer = isContentSlide && !props.isAdmin && !canUserProceed;

    return (
      <div className="fixed bottom-0 left-0 right-0 bg-[#1c1c1e] border-t border-[#4e4e57] z-[106] pb-[env(safe-area-inset-bottom)]">
        <div className="w-full max-w-[1920px] mx-auto px-3 sm:px-6 lg:px-16">
          <div className="min-h-[88px] sm:h-[110px] py-3 sm:py-0 flex items-center justify-between gap-2 sm:gap-4">
            <button
              onClick={handleBackButton}
              className="bg-[#ec4545] hover:bg-[#d63939] text-white font-['Inter:Bold',sans-serif] font-bold text-[13px] sm:text-[clamp(14px,1.5vw,24px)] rounded-[12px] sm:rounded-[15px] transition-colors px-3 sm:px-6 h-[46px] sm:h-[54px] w-[96px] sm:w-[155px] flex items-center justify-center whitespace-nowrap flex-shrink-0"
            >
              ← Back
            </button>

            <div className="flex items-center justify-center gap-3 sm:gap-[50px] flex-1 overflow-x-auto px-1 sm:px-0">
              {Array.from({ length: totalSlidesCount }).map((_, index) => (
                <div key={index} className="flex-shrink-0">
                  <Dot isActive={index === currentSlideIndex} />
                </div>
              ))}
            </div>

            <button
              onClick={handleNextButton}
              disabled={shouldShowTimer}
              className={`
                ${shouldShowTimer ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#4cb025] hover:bg-[#3d9d1e]'}
                rounded-[12px] sm:rounded-[15px] transition-colors flex items-center justify-center gap-[6px] px-3 sm:px-6 h-[46px] sm:h-[54px] w-[96px] sm:w-[155px] flex-shrink-0
              `}
            >
              <span className="font-['Inter:Bold',sans-serif] font-bold text-white text-[13px] sm:text-[clamp(14px,1.5vw,24px)]">
                {shouldShowTimer ? `${timerSeconds}s` : 'Next →'}
              </span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Funkcia pre vykreslovanie cvicenia
  const renderExercise = () => {
    // Ak je to content slide
    if (!isFinalTest && currentSlideIndex === 0) {
      return renderContentSlide({ 
        level: props.level, 
        theme: props.theme, 
        onNext: handleNextButton, 
        isAdmin: props.isAdmin, 
        accessToken: props.accessToken, 
        renderNavigationBar: renderNavigationBar 
      });
    }

    // Vypocet indexu cvicenia
    const exerciseIndex = isFinalTest ? currentSlideIndex : currentSlideIndex - 1;
    
    // Kontrola validity indexu
    if (exerciseIndex >= numberOfExercises || exerciseIndex < 0) {
      if (!showResultsPage) {
        setShowResultsPage(true);
      }
      return null;
    }
    
    // Ziskanie cvicenia a jeho stavu
    const exercise = themeData.exercises[exerciseIndex];
    const state = exerciseStates[currentSlideIndex];
    
    // Kontrola ci existuje cvicenie a jeho stav
    if (!exercise || !state) {
      if (currentSlideIndex > 0) {
        setCurrentSlideIndex(Math.min(currentSlideIndex - 1, totalSlidesCount - 1));
      } else {
        setShowResultsPage(true);
      }
      return null;
    }

    // Vypocet pomocnych premennych
    const isLastInReview = reviewModeActive && incorrectExerciseIndices.indexOf(currentSlideIndex) === incorrectExerciseIndices.length - 1;
    const isLastExercise = reviewModeActive ? isLastInReview : currentSlideIndex === totalSlidesCount - 1;
    const slideNumber = reviewModeActive ? incorrectExerciseIndices.indexOf(currentSlideIndex) : currentSlideIndex;
    const totalSlidesCountDisplay = reviewModeActive ? incorrectExerciseIndices.length : totalSlidesCount;
    const isFirstExercise = isFinalTest ? currentSlideIndex === 0 : currentSlideIndex === 1;
    const shouldHideBack = isFirstExercise && !props.isAdmin && !state.isSubmitted;

    return (
      <>
        {renderExerciseByType({
          exercise: exercise,
          state: state,
          currentSlide: currentSlideIndex,
          slideNumber: slideNumber,
          totalSlidesCount: totalSlidesCountDisplay,
          isLastExercise: isLastExercise,
          reviewMode: reviewModeActive,
          shouldHideBack: shouldHideBack,
          onNext: handleNextButton,
          onPrevious: handlePreviousButton,
          onStateChange: (newState) => {
            setExerciseStates(previousMap => ({ ...previousMap, [currentSlideIndex]: newState }));
          },
          onAnswerSubmit: (isCorrect) => handleAnswerSubmit(currentSlideIndex, isCorrect)
        })}
      </>
    );
  };

  // Ak sa zobrazuju vysledky
  if (showResultsPage) {
    const correctCount = exerciseResults.filter(result => result === true).length;
    return (
      <ResultPage
        correctAnswers={correctCount}
        totalExercises={numberOfExercises}
        onCheckMistakes={handleCheckMistakesButton}
        onFinish={handleFinishButton}
      />
    );
  }

  // Ak nie je inicializovane
  if (!isInitialized) {
    return <LoadingSpinner />;
  }

  // Hlavny render
  return (
    <>
      {renderExercise()}
      {showExerciseTypePopup && (
        <ExerciseTypePopup
          exerciseType={currentExerciseTypeName}
          onClose={() => setShowExerciseTypePopup(false)}
        />
      )}
    </>
  );
}