import fs from "node:fs";
import ts from "typescript";

const LEVELS = [
  {
    levelName: "BEGINNER",
    sourceFile: "src/app/data/beginnerthemes.ts",
    exportName: "beginnerThemes",
    outputFile: "PRAKTICKA_CAST_BEGINNER_OBSAH.txt",
  },
  {
    levelName: "INTERMEDIATE",
    sourceFile: "src/app/data/intermediatethemes.ts",
    exportName: "intermediateThemes",
    outputFile: "PRAKTICKA_CAST_INTERMEDIATE_OBSAH.txt",
  },
  {
    levelName: "PROFESSIONAL",
    sourceFile: "src/app/data/professionalthemes.ts",
    exportName: "professionalThemes",
    outputFile: "PRAKTICKA_CAST_PROFESSIONAL_OBSAH.txt",
  },
];

function stripKeywordMarkers(text) {
  return String(text || "").replace(/\*\*([^*]+)\*\*/g, "$1");
}

async function importTsModule(filePath) {
  const source = fs.readFileSync(filePath, "utf8");
  const transpiled = ts.transpileModule(source, {
    compilerOptions: {
      target: ts.ScriptTarget.ES2020,
      module: ts.ModuleKind.ESNext,
    },
  }).outputText;

  const url = "data:text/javascript;base64," + Buffer.from(transpiled).toString("base64");
  return import(url);
}

function isOptionCorrect(exercise, option, index) {
  const answer = exercise.correctAnswer;

  if (exercise.type === "true-false") {
    const normalized = String(option).toLowerCase();
    if (normalized === "true") return answer === true;
    if (normalized === "false") return answer === false;
    return false;
  }

  if (exercise.type === "single-choice") {
    return typeof answer === "number" && answer === index;
  }

  if (exercise.type === "multiple-choice") {
    return Array.isArray(answer) && answer.includes(index);
  }

  if (exercise.type === "choose-correct") {
    if (answer && typeof answer === "object" && !Array.isArray(answer)) {
      const values = Object.values(answer).map((v) => String(v).trim());
      return values.includes(String(option).trim());
    }
    return false;
  }

  return false;
}

function writeExerciseLines(lines, exercise, exerciseIndex) {
  lines.push(`${exerciseIndex + 1}) Typ: ${exercise.type}`);
  lines.push(`Otazka: ${exercise.question}`);

  if (exercise.categories && Array.isArray(exercise.categories) && exercise.categories.length > 0) {
    lines.push(`Kategorie: ${exercise.categories.join(", ")}`);
  }

  lines.push("Moznosti:");

  if (exercise.type === "sort") {
    if (Array.isArray(exercise.options)) {
      exercise.options.forEach((option, i) => {
        lines.push(`* [${i + 1}] ${option}`);
      });
    }
  } else {
    (exercise.options || []).forEach((option, i) => {
      const marker = isOptionCorrect(exercise, option, i) ? "*" : "-";
      lines.push(`${marker} ${option}`);
    });
  }

  lines.push("");
}

function buildLevelText(levelName, themes) {
  const lines = [];
  lines.push(`UROVEN: ${levelName}`);
  lines.push("");

  themes.forEach((theme, themeIndex) => {
    lines.push(`TEMA ${themeIndex + 1}: ${theme.title}`);
    lines.push("");

    lines.push("POUCKA:");
    lines.push(stripKeywordMarkers(theme.content));
    lines.push("");

    lines.push("KEYWORD POUCKY:");
    if (Array.isArray(theme.keywords) && theme.keywords.length > 0) {
      theme.keywords.forEach((keyword, i) => {
        const label = keyword.displayName || keyword.text;
        lines.push(`${i + 1}. ${label}: ${keyword.explanation}`);
      });
    } else {
      lines.push("(ziadne klucove slova)");
    }
    lines.push("");

    lines.push("CVICENIA:");
    (theme.exercises || []).forEach((exercise, exerciseIndex) => {
      writeExerciseLines(lines, exercise, exerciseIndex);
    });

    if (themeIndex < themes.length - 1) {
      lines.push("");
    }
  });

  return lines.join("\n");
}

for (const level of LEVELS) {
  const moduleData = await importTsModule(level.sourceFile);
  const themes = moduleData[level.exportName];

  if (!Array.isArray(themes)) {
    throw new Error(`Export ${level.exportName} not found or not array in ${level.sourceFile}`);
  }

  const text = buildLevelText(level.levelName, themes);
  fs.writeFileSync(level.outputFile, text, "utf8");
  console.log("Generated: " + level.outputFile);
}
