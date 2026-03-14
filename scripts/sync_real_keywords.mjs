import fs from "node:fs";
import ts from "typescript";

const themeConfigs = [
  {
    filePath: "src/app/data/beginnerthemes.ts",
    exportName: "beginnerThemes",
    constName: "beginnerThemes",
  },
  {
    filePath: "src/app/data/intermediatethemes.ts",
    exportName: "intermediateThemes",
    constName: "intermediateThemes",
  },
  {
    filePath: "src/app/data/professionalthemes.ts",
    exportName: "professionalThemes",
    constName: "professionalThemes",
  },
];

function normalize(text) {
  return String(text).trim().toLowerCase();
}

function getBoldTerms(content) {
  const set = new Set();
  const regex = /\*\*([^*]+)\*\*/g;
  let match;

  while ((match = regex.exec(content)) !== null) {
    set.add(normalize(match[1]));
  }

  return set;
}

function findMatchingBracket(source, openIndex) {
  let depth = 0;
  let inString = false;
  let quote = "";

  for (let i = openIndex; i < source.length; i += 1) {
    const ch = source[i];
    const prev = i > 0 ? source[i - 1] : "";

    if (inString) {
      if (ch === quote && prev !== "\\") {
        inString = false;
        quote = "";
      }
      continue;
    }

    if (ch === '"' || ch === "'" || ch === "`") {
      inString = true;
      quote = ch;
      continue;
    }

    if (ch === "[") {
      depth += 1;
    } else if (ch === "]") {
      depth -= 1;
      if (depth === 0) {
        return i;
      }
    }
  }

  throw new Error("Could not find matching closing bracket");
}

function escapeString(value) {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/'/g, "\\'")
    .replace(/\n/g, "\\n")
    .replace(/\r/g, "\\r")
    .replace(/\t/g, "\\t");
}

function toTs(value, level = 0) {
  const indent = "  ".repeat(level);
  const childIndent = "  ".repeat(level + 1);

  if (value === null) return "null";
  if (typeof value === "string") return `'${escapeString(value)}'`;
  if (typeof value === "number" || typeof value === "boolean") return String(value);

  if (Array.isArray(value)) {
    if (value.length === 0) {
      return "[]";
    }

    const items = value.map((item) => childIndent + toTs(item, level + 1));
    return "[\n" + items.join(",\n") + "\n" + indent + "]";
  }

  const entries = Object.entries(value);
  if (entries.length === 0) {
    return "{}";
  }

  const lines = entries.map(([key, val]) => {
    const safeKey = /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(key) || /^\d+$/.test(key)
      ? key
      : `'${escapeString(key)}'`;

    return childIndent + safeKey + ": " + toTs(val, level + 1);
  });

  return "{\n" + lines.join(",\n") + "\n" + indent + "}";
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

function replaceThemesArray(source, constName, newArrayString) {
  const marker = `export const ${constName}: Theme[] =`;
  const markerIndex = source.indexOf(marker);
  if (markerIndex === -1) {
    throw new Error(`Cannot find marker: ${marker}`);
  }

  const arrayStart = source.indexOf("[", markerIndex + marker.length);
  if (arrayStart === -1) {
    throw new Error(`Cannot find array start for ${constName}`);
  }

  const arrayEnd = findMatchingBracket(source, arrayStart);

  const before = source.slice(0, arrayStart);
  const after = source.slice(arrayEnd + 1);

  return before + newArrayString + after;
}

async function syncOneConfig(config) {
  const moduleData = await importTsModule(config.filePath);
  const originalThemes = moduleData[config.exportName];

  if (!Array.isArray(originalThemes)) {
    throw new Error(`Export ${config.exportName} is not an array in ${config.filePath}`);
  }

  const cleanedThemes = [];
  const removed = [];

  for (const theme of originalThemes) {
    const usedTerms = getBoldTerms(theme.content || "");

    const filteredKeywords = (theme.keywords || []).filter((keyword) => {
      const keep = usedTerms.has(normalize(keyword.text));
      if (!keep) {
        removed.push({ title: theme.title, text: keyword.text });
      }
      return keep;
    });

    cleanedThemes.push({
      ...theme,
      keywords: filteredKeywords,
    });
  }

  const newArrayString = toTs(cleanedThemes, 0);
  const currentSource = fs.readFileSync(config.filePath, "utf8");
  const nextSource = replaceThemesArray(currentSource, config.constName, newArrayString);
  fs.writeFileSync(config.filePath, nextSource, "utf8");

  return removed;
}

let totalRemoved = 0;
for (const config of themeConfigs) {
  const removed = await syncOneConfig(config);
  totalRemoved += removed.length;

  console.log("\n" + config.filePath);
  if (removed.length === 0) {
    console.log("  removed: 0");
  } else {
    for (const item of removed) {
      console.log("  removed: [" + item.title + "] " + item.text);
    }
    console.log("  removed total: " + removed.length);
  }
}

console.log("\nTOTAL REMOVED KEYWORDS: " + totalRemoved);
