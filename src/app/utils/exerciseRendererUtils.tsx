import type { ReactNode } from "react";
import TrueFalseExercise from '@/app/components/islandpages/TrueFalseExercise';
import ChooseCorrectOptionExercise from '@/app/components/islandpages/ChooseCorrectOptionExercise';
import SortExercise from '@/app/components/islandpages/SortExercise';
import SingleChoiceTextExercise from '@/app/components/islandpages/SingleChoiceTextExercise';
import TextMultipleChoiceExercise from '@/app/components/islandpages/TextMultipleChoiceExercise';
import LearnPageMechanics from '@/app/components/reusable/LearnPageMechanics';
import type { Exercise } from "@/app/data/beginnerthemes";

interface ExerciseRendererProps {
  exercise: Exercise;
  state: any;
  currentSlide: number;
  slideNumber: number;
  totalSlidesCount: number;
  isLastExercise: boolean;
  reviewMode: boolean;
  shouldHideBack: boolean;
  onNext: () => void;
  onPrevious: () => void;
  onStateChange: (state: any) => void;
  onAnswerSubmit: (isCorrect: boolean) => void;
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
          initialSelectedOptions={state.selectedOptions}
          initialIsSubmitted={state.isSubmitted}
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
          initialSelectedOption={state.selectedOption}
          initialIsSubmitted={state.isSubmitted}
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
          correctAnswer={exercise.correctAnswer}
          onNext={onNext}
          onBack={onPrevious}
          currentSlide={slideNumber}
          totalSlides={totalSlidesCount}
          initialSelectedOptions={state.selectedOptions}
          initialIsSubmitted={state.isSubmitted}
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
          correctAnswer={exercise.correctAnswer}
          categories={exercise.categories}
          onNext={onNext}
          onBack={onPrevious}
          currentSlide={slideNumber}
          totalSlides={totalSlidesCount}
          initialItemOrder={state.itemOrder}
          initialIsSubmitted={state.isSubmitted}
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
          initialSelectedOption={state.selectedOption}
          initialIsSubmitted={state.isSubmitted}
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
    <div className="fixed inset-0 bg-[#1c1c1e] z-[105] flex flex-col overflow-y-auto overflow-x-hidden overscroll-y-contain touch-pan-y">
      <div className="flex-1 w-full flex items-center justify-center overflow-y-auto overscroll-y-contain touch-pan-y pb-[96px] sm:pb-[130px] px-2 sm:px-0">
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