import type { Exercise } from "@/app/data/beginnerthemes";

export interface ExerciseState {
  selectedOptions?: number[] | Record<string, string>;
  selectedOption?: number | boolean | null;
  itemOrder?: Array<{ id: string; label: string; position: number }>;
  isSubmitted?: boolean;
}

function getSlideNumber(index: number, isFinalTest: boolean): number {
  return isFinalTest ? index : index + 1;
}

function getSortItemLabel(optionText: string, categories: string[] | undefined): string {
  if (categories) {
    return optionText;
  }

  const splitParts = optionText.split(' - ');
  return splitParts.length > 1 ? splitParts[1] : splitParts[0];
}

function shuffleSortItems(items: Array<{ id: string; label: string; position: number }>): Array<{ id: string; label: string; position: number }> {
  const tempItems = [...items];
  const shuffledItems: Array<{ id: string; label: string; position: number }> = [];

  while (tempItems.length > 0) {
    const randomIndex = Math.floor(Math.random() * tempItems.length);
    const pickedItem = tempItems[randomIndex];
    shuffledItems.push(pickedItem);
    tempItems.splice(randomIndex, 1);
  }

  for (let i = 0; i < shuffledItems.length; i++) {
    shuffledItems[i].position = i;
  }

  return shuffledItems;
}

// Inicializacia stavov pre cvicenia
export function initializeExerciseStates(exercises: Exercise[], isFinalTest: boolean): Record<number, ExerciseState> {
  const states: Record<number, ExerciseState> = {};
  
  // Prejdi cez vsetky cvicenia
  for (let i = 0; i < exercises.length; i++) {
    const exercise = exercises[i];
    const slideNumber = getSlideNumber(i, isFinalTest);
    
    // Viacnasobny vyber cvicenie
    if (exercise.type === 'multiple-choice') {
      states[slideNumber] = {
        selectedOptions: [],
        isSubmitted: false
      };
    }
    
    // Jedna moznost cvicenie
    else if (exercise.type === 'single-choice' || exercise.type === 'true-false') {
      states[slideNumber] = {
        selectedOption: null,
        isSubmitted: false
      };
    }
    
    // Choose correct cvicenie
    else if (exercise.type === 'choose-correct') {
      states[slideNumber] = {
        selectedOptions: {},
        isSubmitted: false
      };
    }
    
    // Zoradovanie cvicenie
    else if (exercise.type === 'sort') {
      const itemsList = [];
      
      for (let j = 0; j < exercise.options.length; j++) {
        const opt = exercise.options[j];
        const itemLabel = getSortItemLabel(opt, exercise.categories);
        
        const newItem = {
          id: String(j + 1),
          label: itemLabel,
          position: j
        };
        
        itemsList.push(newItem);
      }
      
      const shuffledItems = shuffleSortItems(itemsList);
      
      states[slideNumber] = {
        itemOrder: shuffledItems,
        isSubmitted: false
      };
    }
  }
  
  return states;
}
