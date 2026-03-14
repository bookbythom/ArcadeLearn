import fs from 'fs';
import path from 'path';

const files = [
  'PRAKTICKA_CAST_BEGINNER_OBSAH.txt',
  'PRAKTICKA_CAST_INTERMEDIATE_OBSAH.txt',
  'PRAKTICKA_CAST_PROFESSIONAL_OBSAH.txt',
];

function wrapText(text, width, indent = '') {
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length === 0) return [''];

  const lines = [];
  let current = '';

  for (const word of words) {
    const next = current ? current + ' ' + word : word;
    if ((indent + next).length <= width) {
      current = next;
    } else {
      if (current) {
        lines.push(indent + current);
      }
      current = word;
    }
  }

  if (current) {
    lines.push(indent + current);
  }

  return lines;
}

function formatFile(filePath) {
  const original = fs.readFileSync(filePath, 'utf8');
  const inputLines = original.split('\n');
  const outputLines = [];

  let section = '';

  for (let i = 0; i < inputLines.length; i++) {
    const line = inputLines[i];

    if (line.trim() === 'POUCKA:') {
      section = 'POUCKA';
      outputLines.push(line);
      continue;
    }

    if (line.trim() === 'KEYWORD POUCKY:') {
      section = 'KEYWORD';
      outputLines.push(line);
      continue;
    }

    if (line.trim() === 'CVICENIA:') {
      section = 'CVICENIA';
      outputLines.push(line);
      continue;
    }

    if (line.startsWith('------------------------------------------------------------')) {
      section = '';
      outputLines.push(line);
      continue;
    }

    if (section === 'POUCKA') {
      if (line.trim() === '') {
        outputLines.push(line);
        continue;
      }
      outputLines.push(...wrapText(line.trim(), 120));
      continue;
    }

    if (section === 'KEYWORD') {
      if (line.trim() === '') {
        outputLines.push(line);
        continue;
      }

      const keywordMatch = line.match(/^(\d+\.\s+[^:]+:\s*)(.*)$/);
      if (keywordMatch) {
        const prefix = keywordMatch[1];
        const body = keywordMatch[2];
        const wrappedBody = wrapText(body, 120 - prefix.length);
        if (wrappedBody.length > 0) {
          outputLines.push(prefix + wrappedBody[0].trim());
          for (let j = 1; j < wrappedBody.length; j++) {
            outputLines.push(' '.repeat(prefix.length) + wrappedBody[j].trim());
          }
        } else {
          outputLines.push(prefix.trimEnd());
        }
        continue;
      }

      outputLines.push(...wrapText(line.trim(), 120));
      continue;
    }

    outputLines.push(line);
  }

  fs.writeFileSync(filePath, outputLines.join('\n'), 'utf8');
}

for (const file of files) {
  const absolutePath = path.join(process.cwd(), file);
  if (fs.existsSync(absolutePath)) {
    formatFile(absolutePath);
    console.log('Formatted:', file);
  }
}
