import { beginnerThemes, beginnerFinalTest, type Theme } from "@/app/data/beginnerthemes";
import { intermediateThemes, intermediateFinalTest } from "@/app/data/intermediatethemes";
import { professionalThemes, professionalFinalTest } from "@/app/data/professionalthemes";

function getFinalTestTheme(level: "beginner" | "intermediate" | "professional"): Theme {
  if (level === "beginner") {
    return {
      id: 0,
      title: "Beginner Final Test",
      content: "",
      keywords: [],
      exercises: beginnerFinalTest,
      useTextExercise: true,
    };
  }

  if (level === "intermediate") {
    return {
      id: 0,
      title: "Intermediate Final Test",
      content: "",
      keywords: [],
      exercises: intermediateFinalTest,
      useTextExercise: true,
    };
  }

  return {
    id: 0,
    title: "Professional Final Test",
    content: "",
    keywords: [],
    exercises: professionalFinalTest,
    useTextExercise: true,
  };
}

// Ziskanie theme dat
export function getThemeData(level: "beginner" | "intermediate" | "professional", theme: number): Theme {
  if (theme === 0) {
    return getFinalTestTheme(level);
  }

  const themeIndex = theme - 1;

  if (level === "beginner") {
    return beginnerThemes[themeIndex] || beginnerThemes[0];
  }

  if (level === "intermediate") {
    return intermediateThemes[themeIndex] || intermediateThemes[0];
  }

  if (level === "professional") {
    return professionalThemes[themeIndex] || professionalThemes[0];
  }

  // Predvolena nahrada
  return beginnerThemes[0];
}

// Ziskanie nazvu typu cvicenia
export function getExerciseTypeName(slideIndex: number, isFinalTest: boolean, exercisesLength: number, exercises: Theme['exercises']): string {
  const exerciseIndex = isFinalTest ? slideIndex : slideIndex - 1;
  
  if (exerciseIndex < 0) {
    return "";
  }
  
  if (exerciseIndex >= exercisesLength) {
    return "";
  }
  
  const exercise = exercises[exerciseIndex];
  const exerciseType = exercise.type;

  if (exerciseType === 'multiple-choice') {
    return "Multiple Choice";
  }
  if (exerciseType === 'true-false') {
    return "True or False";
  }
  if (exerciseType === 'choose-correct') {
    return "Choose Correct Option";
  }
  if (exerciseType === 'sort') {
    return "Sort Exercise";
  }
  if (exerciseType === 'single-choice') {
    return "Single Choice";
  }

  return "";
}
