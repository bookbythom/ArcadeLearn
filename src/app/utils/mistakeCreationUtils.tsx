import type { Theme } from "@/app/data/beginnerthemes";
import type { MistakeExercise } from "@/app/utils/mistakesUtils";

// Vytvorenie mistakes zo zle zodpovedanych cviceni
export function createMistakesFromResults(
  exerciseResults: boolean[],
  exerciseStates: { [key: number]: any },
  themeData: Theme,
  isFinalTest: boolean
): Omit<MistakeExercise, 'timestamp'>[] {
  const mistakesList: Omit<MistakeExercise, 'timestamp'>[] = [];
  
  // Prejdi cez vsetky vysledky
  for (let i = 0; i < exerciseResults.length; i++) {
    const isCorrect = exerciseResults[i];
    
    // Je to cvicenie?
    let isExercise = false;
    if (isFinalTest) {
      isExercise = true;
    } else {
      if (i > 0) {
        isExercise = true;
      }
    }
    
    // Ak nie je spravne a je to cvicenie
    if (!isCorrect && isExercise) {
      let exerciseIndex = 0;
      
      if (isFinalTest) {
        exerciseIndex = i;
      } else {
        exerciseIndex = i - 1;
      }
      
      const exercise = themeData.exercises[exerciseIndex];
      const state = exerciseStates[i];
      
      if (!exercise) {
        continue;
      }
      
      if (!state) {
        continue;
      }

      let mistakeData: Omit<MistakeExercise, 'timestamp'> | null = null;

      // Multiple choice
      if (exercise.type === 'multiple-choice') {
        const userSelectedOptions = state.selectedOptions;
        const userAnswers = [];
        
        for (let j = 0; j < userSelectedOptions.length; j++) {
          const optionIndex = userSelectedOptions[j];
          const optionText = exercise.options[optionIndex];
          userAnswers.push(optionText);
        }
        
        let correctAnswers = [];
        if (Array.isArray(exercise.correctAnswer)) {
          for (let k = 0; k < exercise.correctAnswer.length; k++) {
            const correctIndex = exercise.correctAnswer[k];
            const correctText = exercise.options[correctIndex];
            correctAnswers.push(correctText);
          }
        }
        
        mistakeData = {
          type: 'multiple-choice',
          question: exercise.question,
          userAnswer: userAnswers,
          correctAnswer: correctAnswers
        };
      }

      // True/False
      else if (exercise.type === 'true-false') {
        let userAnswerText = '';
        if (state.selectedOption === true) {
          userAnswerText = 'True';
        } else {
          userAnswerText = 'False';
        }
        
        let correctAnswerText = '';
        if (exercise.correctAnswer === true) {
          correctAnswerText = 'True';
        } else {
          correctAnswerText = 'False';
        }
        
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
          userAnswer: state.selectedOptions,
          correctAnswer: exercise.correctAnswer
        };
      }

      // Sort
      else if (exercise.type === 'sort') {
        const itemsCopy: { label: string; position: number }[] = [];
        for (let m = 0; m < state.itemOrder.length; m++) {
          itemsCopy.push(state.itemOrder[m]);
        }
        
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
        
        const userOrderLabels = [];
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
              const optText = exercise.options[idx];
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
              let str = exercise.correctAnswer[s];
              
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
          correctOrderLabels = exercise.correctAnswer;
        }
        
        mistakeData = {
          type: 'sorting',
          question: exercise.question,
          userAnswer: userOrderLabels,
          correctAnswer: correctOrderLabels,
          categories: exercise.categories
        };
      }

      // Single choice
      else if (exercise.type === 'single-choice') {
        let userAnswerText = 'No answer';
        
        if (state.selectedOption !== null) {
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