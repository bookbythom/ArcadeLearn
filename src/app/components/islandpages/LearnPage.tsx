import { useState, useEffect } from 'react';
import { replaceThemeMistakes } from "@/app/utils/mistakesUtils";
import { Dot } from './Dot';
import ResultPage from './ResultPage';
import ExerciseTypePopup from '@/app/components/reusable/ExerciseTypePopup';
import { LoadingSpinner } from '@/app/components/ui/LoadingSpinner';
import { getThemeData, getExerciseTypeName } from "@/app/utils/learnPageUtils";
import { initializeExerciseStates, type ExerciseState } from "@/app/utils/exerciseStateUtils";
import { createMistakesFromResults } from "@/app/utils/mistakeCreationUtils";
import { renderExerciseByType, renderContentSlide } from "@/app/utils/exerciseRendererUtils";
import type { Theme } from "@/app/data/beginnerthemes";

// Rozhranie pre vlastnosti komponentu LearnPage
interface LearnPageProps {
  level: "beginner" | "intermediate" | "professional";
  theme: number;
  onBack: () => void;
  onComplete?: (correctAnswers: number, totalExercises: number) => void;
  userEmail: string;
  themeName: string;
  isAdmin?: boolean;
  accessToken?: string;
  previousBestCorrectAnswers?: number;
}

type ExerciseStateMap = Record<number, ExerciseState>;

interface ReviewState {
  active: boolean;
  incorrectExerciseIndices: number[];
}

interface ExerciseTypePopupState {
  visible: boolean;
  exerciseTypeName: string;
}

interface UseExerciseTypePopupParams {
  currentSlideIndex: number;
  isFinalTest: boolean;
  numberOfExercises: number;
  exercises: Theme['exercises'];
}

// Hook pre popup s nazvom typu cvicenia pri prvom vstupe na slide
const useExerciseTypePopup = ({
  currentSlideIndex,
  isFinalTest,
  numberOfExercises,
  exercises
}: UseExerciseTypePopupParams) => {
  const [popupState, setPopupState] = useState<ExerciseTypePopupState>({
    visible: false,
    exerciseTypeName: ""
  });
  const [visitedSlides, setVisitedSlides] = useState<Set<number>>(new Set([0]));

  useEffect(() => {
    const maxExerciseSlideIndex = isFinalTest ? numberOfExercises - 1 : numberOfExercises;
    const isExerciseSlide = isFinalTest
      ? (currentSlideIndex >= 0 && currentSlideIndex <= maxExerciseSlideIndex)
      : (currentSlideIndex >= 1 && currentSlideIndex <= maxExerciseSlideIndex);

    if (isExerciseSlide && !visitedSlides.has(currentSlideIndex)) {
      const exerciseType = getExerciseTypeName(currentSlideIndex, isFinalTest, exercises.length, exercises);
      setPopupState({ visible: true, exerciseTypeName: exerciseType });
      setVisitedSlides((previousSet) => new Set([...previousSet, currentSlideIndex]));
    }
  }, [currentSlideIndex, visitedSlides, isFinalTest, numberOfExercises, exercises]);

  const closePopup = () => {
    setPopupState((previousState) => ({ ...previousState, visible: false }));
  };

  return { popupState, closePopup };
};

// Hook pre review mode (prechod iba cez nespravne odpovede)
const useReviewMode = () => {
  const [reviewState, setReviewState] = useState<ReviewState>({ active: false, incorrectExerciseIndices: [] });

  const startReview = (incorrectExerciseIndices: number[]) => {
    setReviewState({ active: true, incorrectExerciseIndices });
  };

  const stopReview = () => {
    setReviewState({ active: false, incorrectExerciseIndices: [] });
  };

  return {
    reviewModeActive: reviewState.active,
    incorrectExerciseIndices: reviewState.incorrectExerciseIndices,
    startReview,
    stopReview
  };
};

interface UseContentSlideTimerParams {
  currentSlideIndex: number;
  isFinalTest: boolean;
  isAdmin?: boolean;
}

// Hook pre 30s timer na content slide pri beznom userovi
const useContentSlideTimer = ({ currentSlideIndex, isFinalTest, isAdmin }: UseContentSlideTimerParams) => {
  const [timerSeconds, setTimerSeconds] = useState(30);
  const [canUserProceed, setCanUserProceed] = useState(false);

  useEffect(() => {
    const isContentSlide = !isFinalTest && currentSlideIndex === 0;
    if (!isContentSlide || isAdmin) {
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
  }, [currentSlideIndex, isAdmin, isFinalTest]);

  return { timerSeconds, canUserProceed };
};

// Hlavny komponent pre ucenie sa a cvicenia na ostrove
export default function LearnPage(props: LearnPageProps) {
  // Ziskanie dat pre aktualne temu
  const themeData = getThemeData(props.level, props.theme);
  const isFinalTest = props.theme === 0;
  const numberOfExercises = themeData.exercises.length;
  const totalSlidesCount = isFinalTest ? numberOfExercises : numberOfExercises + 1;

  // State premenne
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [showResultsPage, setShowResultsPage] = useState(false);
  const [exerciseResults, setExerciseResults] = useState<boolean[]>([]);
  const [hasCalledCompleteCallback, setHasCalledCompleteCallback] = useState(false);
  const [exerciseStates, setExerciseStates] = useState<ExerciseStateMap>({});
  const [isInitialized, setIsInitialized] = useState(false);
  const [initialBestCorrectAnswers, setInitialBestCorrectAnswers] = useState(props.previousBestCorrectAnswers || 0);

  // Lokalna logika je rozdelena do malych hookov kvoli citatelnosti
  const { timerSeconds, canUserProceed } = useContentSlideTimer({
    currentSlideIndex,
    isFinalTest,
    isAdmin: props.isAdmin
  });
  const {
    reviewModeActive,
    incorrectExerciseIndices,
    startReview,
    stopReview
  } = useReviewMode();
  const { popupState: exerciseTypePopupState, closePopup } = useExerciseTypePopup({
    currentSlideIndex,
    isFinalTest,
    numberOfExercises,
    exercises: themeData.exercises
  });

  // Zapamataj si best score iba pri vstupe na iny ostrovcek, aby sa po dokonceni neprepisal.
  useEffect(() => {
    setInitialBestCorrectAnswers(props.previousBestCorrectAnswers || 0);
  }, [props.level, props.theme]);

  // Inicializacia stavov pre cvicenia
  useEffect(() => {
    const initialStates = initializeExerciseStates(themeData.exercises, isFinalTest);
    setExerciseStates(initialStates);
    setIsInitialized(true);
  }, [props.theme, props.level, isFinalTest]);

  // Spracovanie dokoncenia a ulozenie chyb
  useEffect(() => {
    if (showResultsPage && !hasCalledCompleteCallback) {
      // Po dokonceni vytvorime mistakes a ulozime vysledok ostrovceka
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

  // Funkcia pre prechod na dalsi slide
  const handleNextButton = () => {
    if (reviewModeActive) {
      const currentIndex = incorrectExerciseIndices.indexOf(currentSlideIndex);
      if (currentIndex !== -1 && currentIndex < incorrectExerciseIndices.length - 1) {
        setCurrentSlideIndex(incorrectExerciseIndices[currentIndex + 1]);
      } else {
        setShowResultsPage(true);
        stopReview();
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
        stopReview();
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
      startReview(incorrectIndices);
      setCurrentSlideIndex(incorrectIndices[0]);
      setShowResultsPage(false);
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
      <div className="fixed bottom-0 left-0 right-0 bg-[#1c1c1e] border-t border-[#4e4e57] z-[106]">
        <div className="w-full max-w-[1920px] mx-auto px-16">
          <div className="h-[110px] flex items-center justify-between gap-4">
            <button
              onClick={handleBackButton}
              className="bg-[#ec4545] hover:bg-[#d63939] text-white font-bold text-[clamp(14px,1.5vw,24px)] rounded-[15px] transition-colors px-6 h-[54px] w-[155px] flex items-center justify-center whitespace-nowrap flex-shrink-0 leading-none"
            >
              ← Back
            </button>

            <div className="flex items-center justify-center gap-[50px] flex-1 overflow-x-auto">
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
                rounded-[15px] transition-colors flex items-center justify-center gap-[6px] px-6 h-[54px] w-[155px] flex-shrink-0
              `}
            >
              <span className="font-bold text-white text-[clamp(14px,1.5vw,24px)]">
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
    const shouldHideBack = isFirstExercise && !props.isAdmin;

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
    const previousBest = initialBestCorrectAnswers;
    const improvedBy = Math.max(0, correctCount - previousBest);
    const xpEarned = improvedBy * 5;
    return (
      <ResultPage
        correctAnswers={correctCount}
        totalExercises={numberOfExercises}
        xpEarned={xpEarned}
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
      {exerciseTypePopupState.visible && (
        <ExerciseTypePopup
          exerciseType={exerciseTypePopupState.exerciseTypeName}
          onClose={closePopup}
        />
      )}
    </>
  );
}