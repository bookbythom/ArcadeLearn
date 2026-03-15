import type { Theme } from "@/app/data/beginnerthemes";
import type { MistakeExercise } from "@/app/utils/mistakesUtils";

type ExerciseStateEntry = {
  selectedOptions?: number[] | Record<string, string>;
  selectedOption?: number | boolean | null;
  itemOrder?: Array<{ label: string; position: number }>;
  isSubmitted?: boolean;
};

const toNumberArray = (value: unknown): number[] => {
  return Array.isArray(value) && value.every((item) => typeof item === 'number') ? value : [];
};

const toItemOrderArray = (value: unknown): Array<{ label: string; position: number }> => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is { label: string; position: number } => {
    return typeof item === 'object' && item !== null && 'label' in item && 'position' in item;
  });
};

function isExerciseResultIndex(index: number, isFinalTest: boolean): boolean {
  return isFinalTest || index > 0;
}

function getExerciseIndex(index: number, isFinalTest: boolean): number {
  return isFinalTest ? index : index - 1;
}

function mapOptionIndexesToLabels(optionIndexes: number[], options: string[]): string[] {
  const labels: string[] = [];

  for (let i = 0; i < optionIndexes.length; i++) {
    labels.push(options[optionIndexes[i]]);
  }

  return labels;
}

// Vytvorenie mistakes zo zle zodpovedanych cviceni
export function createMistakesFromResults(
  exerciseResults: boolean[],
  exerciseStates: Record<number, ExerciseStateEntry>,
  themeData: Theme,
  isFinalTest: boolean
): Omit<MistakeExercise, 'timestamp'>[] {
  const mistakesList: Omit<MistakeExercise, 'timestamp'>[] = [];
  
  // Prejdi cez vsetky vysledky
  for (let i = 0; i < exerciseResults.length; i++) {
    const isCorrect = exerciseResults[i];
    const isExercise = isExerciseResultIndex(i, isFinalTest);
    
    // Ak nie je spravne a je to cvicenie
    if (!isCorrect && isExercise) {
      const exerciseIndex = getExerciseIndex(i, isFinalTest);
      
      const exercise = themeData.exercises[exerciseIndex];
      const state = exerciseStates[i];
      
      if (!exercise) {
        continue;
      }
      
      if (!state) {
        continue;
      }

      let mistakeData: Omit<MistakeExercise, 'timestamp'> | null = null;

      // Viacnasobny vyber
      if (exercise.type === 'multiple-choice') {
        const userSelectedOptions = toNumberArray(state.selectedOptions);
        const userAnswers = mapOptionIndexesToLabels(userSelectedOptions, exercise.options);
        
        let correctAnswers: string[] = [];
        if (Array.isArray(exercise.correctAnswer)) {
          const correctIndices = toNumberArray(exercise.correctAnswer);
          correctAnswers = mapOptionIndexesToLabels(correctIndices, exercise.options);
        }
        
        mistakeData = {
          type: 'multiple-choice',
          question: exercise.question,
          userAnswer: userAnswers,
          correctAnswer: correctAnswers
        };
      }

      // Pravda/Nepravda
      else if (exercise.type === 'true-false') {
        const userAnswerText = state.selectedOption === true ? 'True' : 'False';
        const correctAnswerText = exercise.correctAnswer === true ? 'True' : 'False';
        
        mistakeData = {
          type: 'true-false',
          question: exercise.question,
          userAnswer: userAnswerText,
          correctAnswer: correctAnswerText
        };
      }

      // Choose correct (matching)
      else if (exercise.type === 'choose-correct') {
        mistakeData = {
          type: 'matching',
          question: exercise.question,
          userAnswer: state.selectedOptions || {},
          correctAnswer: exercise.correctAnswer
        };
      }

      // Zoradovanie
      else if (exercise.type === 'sort') {
        const stateItemOrder = toItemOrderArray(state.itemOrder);
        const itemsCopy = [...stateItemOrder];
        
        // Zorad podla pozicie
        for (let n = 0; n < itemsCopy.length; n++) {
          for (let p = n + 1; p < itemsCopy.length; p++) {
            if (itemsCopy[n].position > itemsCopy[p].position) {
              const temp: { label: string; position: number } = itemsCopy[n];
              itemsCopy[n] = itemsCopy[p];
              itemsCopy[p] = temp;
            }
          }
        }
        
        const userOrderLabels: string[] = [];
        for (let q = 0; q < itemsCopy.length; q++) {
          userOrderLabels.push(itemsCopy[q].label);
        }
        
        // Ziskaj spravne poradie
        let correctOrderLabels: string[] = [];
        
        if (Array.isArray(exercise.correctAnswer)) {
          const firstElement = exercise.correctAnswer[0];
          
          // Ak su to cisla (indexy)
          if (typeof firstElement === 'number') {
            for (let r = 0; r < exercise.correctAnswer.length; r++) {
              const idx = exercise.correctAnswer[r];
              const optText = exercise.options[idx as number];
              if (optText) {
                correctOrderLabels.push(optText);
              } else {
                correctOrderLabels.push('');
              }
            }
          }
          // Ak su to stringy
          else {
            for (let s = 0; s < exercise.correctAnswer.length; s++) {
              let str = String(exercise.correctAnswer[s]);
              
              if (!exercise.categories) {
                if (str.includes(' - ')) {
                  const parts = str.split(' - ');
                  str = parts[1];
                }
              }
              
              correctOrderLabels.push(str);
            }
          }
        } else {
          correctOrderLabels = [String(exercise.correctAnswer)];
        }
        
        mistakeData = {
          type: 'sorting',
          question: exercise.question,
          userAnswer: userOrderLabels,
          correctAnswer: correctOrderLabels,
          categories: exercise.categories
        };
      }

      // Jedna moznost
      else if (exercise.type === 'single-choice') {
        let userAnswerText = 'No answer';
        
        if (typeof state.selectedOption === 'number') {
          userAnswerText = exercise.options[state.selectedOption];
        }
        
        const correctAnswerText = exercise.options[exercise.correctAnswer as number];
        
        mistakeData = {
          type: 'single-choice',
          question: exercise.question,
          userAnswer: userAnswerText,
          correctAnswer: correctAnswerText
        };
      }

      if (mistakeData) {
        mistakesList.push(mistakeData);
      }
    }
  }
  
  return mistakesList;
}