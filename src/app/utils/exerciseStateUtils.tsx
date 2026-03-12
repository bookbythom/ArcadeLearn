import type { Exercise } from "@/app/data/beginnerthemes";

export interface ExerciseState {
  selectedOptions?: number[] | Record<string, string>;
  selectedOption?: number | boolean | null;
  itemOrder?: Array<{ id: string; label: string; position: number }>;
  isSubmitted?: boolean;
}

// Inicializacia stavov pre cvicenia
export function initializeExerciseStates(exercises: Exercise[], isFinalTest: boolean): Record<number, ExerciseState> {
  const states: Record<number, ExerciseState> = {};
  
  // Prejdi cez vsetky cvicenia
  for (let i = 0; i < exercises.length; i++) {
    const exercise = exercises[i];
    let slideNumber = 0;
    
    if (isFinalTest) {
      slideNumber = i;
    } else {
      slideNumber = i + 1;
    }
    
    // Viacnasobny vyber cvicenie
    if (exercise.type === 'multiple-choice') {
      states[slideNumber] = {
        selectedOptions: [],
        isSubmitted: false
      };
    }
    
    // Jedna moznost cvicenie
    else if (exercise.type === 'single-choice') {
      states[slideNumber] = {
        selectedOption: null,
        isSubmitted: false
      };
    }
    
    // Pravda/Nepravda cvicenie
    else if (exercise.type === 'true-false') {
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
        let itemLabel = '';
        
        if (exercise.categories) {
          itemLabel = opt;
        } else {
          const splitParts = opt.split(' - ');
          if (splitParts.length > 1) {
            itemLabel = splitParts[1];
          } else {
            itemLabel = splitParts[0];
          }
        }
        
        const newItem = {
          id: String(j + 1),
          label: itemLabel,
          position: j
        };
        
        itemsList.push(newItem);
      }
      
      // Shuffle items
      const shuffledItems = [];
      const tempItems = [];
      
      for (let k = 0; k < itemsList.length; k++) {
        tempItems.push(itemsList[k]);
      }
      
      while (tempItems.length > 0) {
        const randomIndex = Math.floor(Math.random() * tempItems.length);
        const pickedItem = tempItems[randomIndex];
        shuffledItems.push(pickedItem);
        tempItems.splice(randomIndex, 1);
      }
      
      // Nastav pozicie
      for (let m = 0; m < shuffledItems.length; m++) {
        shuffledItems[m].position = m;
      }
      
      states[slideNumber] = {
        itemOrder: shuffledItems,
        isSubmitted: false
      };
    }
  }
  
  return states;
}
