import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

const filePath = resolve(import.meta.dirname, '../dist/index.js');

try {
  let content = readFileSync(filePath, 'utf8');

  content = content.split('export {')[0];

  content = `// Copyright 2025 hellolin <i@hellolin.top>
// Released under the MIT License.

${content}`;

  writeFileSync(filePath, content, 'utf8');
} catch (error) {
  console.error('Error: ', error.message);
  process.exit(1);
}
