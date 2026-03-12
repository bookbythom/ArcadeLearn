import { beginnerThemes, beginnerFinalTest, type Theme } from "@/app/data/beginnerthemes";
import { intermediateThemes, intermediateFinalTest } from "@/app/data/intermediatethemes";
import { professionalThemes, professionalFinalTest } from "@/app/data/professionalthemes";

// Ziskanie theme dat
export function getThemeData(level: "beginner" | "intermediate" | "professional", theme: number): Theme {
  // Beginner level
  if (level === "beginner") {
    if (theme === 0) {
      const finalTestTheme = {
        id: 0,
        title: "Beginner Final Test",
        content: "",
        keywords: [],
        exercises: beginnerFinalTest,
        useTextExercise: true
      };
      return finalTestTheme;
    }
    
    const themeIndex = theme - 1;
    let themeData = beginnerThemes[themeIndex];
    
    if (!themeData) {
      themeData = beginnerThemes[0];
    }
    
    return themeData;
  }
  
  // Intermediate level
  else if (level === "intermediate") {
    if (theme === 0) {
      const finalTestTheme = {
        id: 0,
        title: "Intermediate Final Test",
        content: "",
        keywords: [],
        exercises: intermediateFinalTest,
        useTextExercise: true
      };
      return finalTestTheme;
    }
    
    const themeIndex = theme - 1;
    let themeData = intermediateThemes[themeIndex];
    
    if (!themeData) {
      themeData = intermediateThemes[0];
    }
    
    return themeData;
  }
  
  // Professional level
  else if (level === "professional") {
    if (theme === 0) {
      const finalTestTheme = {
        id: 0,
        title: "Professional Final Test",
        content: "",
        keywords: [],
        exercises: professionalFinalTest,
        useTextExercise: true
      };
      return finalTestTheme;
    }
    
    const themeIndex = theme - 1;
    let themeData = professionalThemes[themeIndex];
    
    if (!themeData) {
      themeData = professionalThemes[0];
    }
    
    return themeData;
  }
  
  // Predvolena nahrada
  return beginnerThemes[0];
}

// Ziskanie nazvu typu cvicenia
export function getExerciseTypeName(slideIndex: number, isFinalTest: boolean, exercisesLength: number, exercises: Theme['exercises']): string {
  let exerciseIndex = 0;
  
  if (isFinalTest) {
    exerciseIndex = slideIndex;
  } else {
    exerciseIndex = slideIndex - 1;
  }
  
  if (exerciseIndex < 0) {
    return "";
  }
  
  if (exerciseIndex >= exercisesLength) {
    return "";
  }
  
  const exercise = exercises[exerciseIndex];
  const exerciseType = exercise.type;
  
  let typeName = "";
  
  if (exerciseType === 'multiple-choice') {
    typeName = "Multiple Choice";
  } else if (exerciseType === 'true-false') {
    typeName = "True or False";
  } else if (exerciseType === 'choose-correct') {
    typeName = "Choose Correct Option";
  } else if (exerciseType === 'sort') {
    typeName = "Sort Exercise";
  } else if (exerciseType === 'single-choice') {
    typeName = "Single Choice";
  } else {
    typeName = "";
  }
  
  return typeName;
}
