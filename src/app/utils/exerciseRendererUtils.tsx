import type { ReactNode } from "react";
import TrueFalseExercise from '@/app/components/islandpages/TrueFalseExercise';
import ChooseCorrectOptionExercise from '@/app/components/islandpages/ChooseCorrectOptionExercise';
import SortExercise from '@/app/components/islandpages/SortExercise';
import SingleChoiceTextExercise from '@/app/components/islandpages/SingleChoiceTextExercise';
import TextMultipleChoiceExercise from '@/app/components/islandpages/TextMultipleChoiceExercise';
import LearnPageMechanics from '@/app/components/reusable/LearnPageMechanics';
import type { Exercise } from "@/app/data/beginnerthemes";

type ExerciseRenderState = {
  selectedOptions?: number[] | Record<string, string>;
  selectedOption?: number | boolean | null;
  itemOrder?: Array<{ id: string; label: string; position: number }>;
  isSubmitted?: boolean;
};

interface ExerciseRendererProps {
  exercise: Exercise;
  state: ExerciseRenderState;
  currentSlide: number;
  slideNumber: number;
  totalSlidesCount: number;
  isLastExercise: boolean;
  reviewMode: boolean;
  shouldHideBack: boolean;
  onNext: () => void;
  onPrevious: () => void;
  onStateChange: (state: ExerciseRenderState) => void;
  onAnswerSubmit: (isCorrect: boolean) => void;
}

function getInitialSelectedArray(value: ExerciseRenderState['selectedOptions']): number[] | undefined {
  return Array.isArray(value) ? value : undefined;
}

function getInitialMatchingSelections(value: ExerciseRenderState['selectedOptions']): { [key: number]: string } | undefined {
  if (Array.isArray(value)) {
    return undefined;
  }
  return value as { [key: number]: string } | undefined;
}

function getInitialBooleanSelection(value: ExerciseRenderState['selectedOption']): boolean | null | undefined {
  if (typeof value === 'boolean' || value === null) {
    return value;
  }
  return undefined;
}

function getInitialNumberSelection(value: ExerciseRenderState['selectedOption']): number | null | undefined {
  if (typeof value === 'number' || value === null) {
    return value;
  }
  return undefined;
}

export function renderExerciseByType({
  exercise,
  state,
  currentSlide,
  slideNumber,
  totalSlidesCount,
  isLastExercise,
  reviewMode,
  shouldHideBack,
  onNext,
  onPrevious,
  onStateChange,
  onAnswerSubmit
}: ExerciseRendererProps) {
  switch (exercise.type) {
    case 'multiple-choice':
      return (
        <TextMultipleChoiceExercise
          key={currentSlide}
          question={exercise.question}
          options={exercise.options}
          correctAnswer={exercise.correctAnswer as number[]}
          onNext={onNext}
          onBack={onPrevious}
          currentSlide={slideNumber}
          totalSlides={totalSlidesCount}
          initialSelectedOptions={getInitialSelectedArray(state.selectedOptions)}
          initialIsSubmitted={Boolean(state.isSubmitted)}
          onStateChange={(selectedOptions, isSubmitted) => {
            onStateChange({ selectedOptions, isSubmitted });
          }}
          onAnswerSubmit={onAnswerSubmit}
          isLastExercise={isLastExercise}
          hideBackButton={shouldHideBack}
        />
      );

    case 'true-false':
      return (
        <TrueFalseExercise
          key={currentSlide}
          question={exercise.question}
          options={exercise.options}
          correctAnswer={exercise.correctAnswer as boolean}
          onNext={onNext}
          onBack={onPrevious}
          currentSlide={slideNumber}
          totalSlides={totalSlidesCount}
          initialSelectedOption={getInitialBooleanSelection(state.selectedOption)}
          initialIsSubmitted={Boolean(state.isSubmitted)}
          onStateChange={(selectedOption, isSubmitted) => {
            onStateChange({ selectedOption, isSubmitted });
          }}
          onAnswerSubmit={onAnswerSubmit}
          isLastExercise={isLastExercise}
          isReviewMode={reviewMode}
          hideBackButton={shouldHideBack}
        />
      );

    case 'choose-correct':
      return (
        <ChooseCorrectOptionExercise
          key={currentSlide}
          question={exercise.question}
          options={exercise.options}
          correctAnswer={exercise.correctAnswer as { [key: number]: string }}
          onNext={onNext}
          onBack={onPrevious}
          currentSlide={slideNumber}
          totalSlides={totalSlidesCount}
          initialSelectedOptions={getInitialMatchingSelections(state.selectedOptions)}
          initialIsSubmitted={Boolean(state.isSubmitted)}
          onStateChange={(selectedOptions, isSubmitted) => {
            onStateChange({ selectedOptions, isSubmitted });
          }}
          onAnswerSubmit={onAnswerSubmit}
          isLastExercise={isLastExercise}
          isReviewMode={reviewMode}
          hideBackButton={shouldHideBack}
        />
      );

    case 'sort':
      return (
        <SortExercise
          key={currentSlide}
          question={exercise.question}
          options={exercise.options}
          correctAnswer={exercise.correctAnswer as string[] | number[]}
          categories={exercise.categories}
          onNext={onNext}
          onBack={onPrevious}
          currentSlide={slideNumber}
          totalSlides={totalSlidesCount}
          initialItemOrder={state.itemOrder}
          initialIsSubmitted={Boolean(state.isSubmitted)}
          onStateChange={(itemOrder, isSubmitted) => {
            onStateChange({ itemOrder, isSubmitted });
          }}
          onAnswerSubmit={onAnswerSubmit}
          isLastExercise={isLastExercise}
          isReviewMode={reviewMode}
          hideBackButton={shouldHideBack}
        />
      );

    case 'single-choice':
      return (
        <SingleChoiceTextExercise
          key={currentSlide}
          question={exercise.question}
          options={exercise.options}
          correctAnswer={exercise.correctAnswer as number}
          onNext={onNext}
          onBack={onPrevious}
          currentSlide={slideNumber}
          totalSlides={totalSlidesCount}
          initialSelectedOption={getInitialNumberSelection(state.selectedOption)}
          initialIsSubmitted={Boolean(state.isSubmitted)}
          onStateChange={(selectedOption, isSubmitted) => {
            onStateChange({ selectedOption, isSubmitted });
          }}
          onAnswerSubmit={onAnswerSubmit}
          isLastExercise={isLastExercise}
          hideBackButton={shouldHideBack}
        />
      );

    default:
      return null;
  }
}

interface ContentSlideProps {
  level: "beginner" | "intermediate" | "professional";
  theme: number;
  onNext: () => void;
  isAdmin?: boolean;
  accessToken?: string;
  renderNavigationBar: () => ReactNode;
}

export function renderContentSlide({
  level,
  theme,
  onNext,
  isAdmin,
  accessToken,
  renderNavigationBar
}: ContentSlideProps) {
  return (
    <div className="fixed inset-0 bg-[#1c1c1e] z-[105] flex flex-col overflow-hidden">
      <div className="flex-1 w-full flex items-center justify-center overflow-y-auto pb-[130px]">
        <LearnPageMechanics 
          level={level} 
          theme={theme} 
          onNext={onNext} 
          isAdmin={isAdmin} 
          accessToken={accessToken} 
        />
      </div>
      {renderNavigationBar()}
    </div>
  );
}