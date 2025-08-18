/* eslint-disable no-console */
import fs from 'fs';
import path from 'path';
import { I18N_TEXT } from '../src/features/lead/context/i18n';

const SRC = path.resolve(__dirname, '../src');

function walk(dir: string, filelist: string[] = []): string[] {
  for (const entry of fs.readdirSync(dir)) {
    const p = path.join(dir, entry);
    const stat = fs.statSync(p);
    if (stat.isDirectory()) walk(p, filelist);
    else if (/\.(ts|tsx|js|jsx)$/.test(p)) filelist.push(p);
  }
  return filelist;
}

const files = walk(SRC);
const used = new Set<string>();

const keyRegexes = [
  /(?:\bt\(|<T\s+[^>]*\bk=)\s*(?:'([^']+)'|"([^"]+)")/g,
  /\btp\(\s*(?:'([^']+)'|"([^"]+)")\s*,/g,
];

for (const f of files) {
  const txt = fs.readFileSync(f, 'utf8');
  for (const re of keyRegexes) {
    let m: RegExpExecArray | null;
    while ((m = re.exec(txt))) {
      const key = (m[1] || m[2])?.trim();
      if (key) used.add(key);
    }
  }
}

const locales = Object.keys(I18N_TEXT) as (keyof typeof I18N_TEXT)[];
const base = I18N_TEXT.en;
const baseKeys = new Set(Object.keys(base));

const missingInBaseFromUsage = [...used].filter(k => !baseKeys.has(k) && !k.endsWith('_one') && !k.endsWith('_other'));
const unusedInBase = [...baseKeys].filter(k => !used.has(k) && !k.endsWith('_one') && !k.endsWith('_other'));

const problems: string[] = [];

if (missingInBaseFromUsage.length) {
  problems.push(`Keys used in code but missing from EN: ${missingInBaseFromUsage.join(', ')}`);
}

for (const loc of locales) {
  const keys = new Set(Object.keys(I18N_TEXT[loc]));
  const missing = [...baseKeys].filter(k => !keys.has(k));
  const extra = [...keys].filter(k => !baseKeys.has(k));
  if (missing.length) problems.push(`[${loc}] missing: ${missing.join(', ')}`);
  if (extra.length) problems.push(`[${loc}] extra: ${extra.join(', ')}`);
}

if (unusedInBase.length) {
  problems.push(`Unused EN keys: ${unusedInBase.join(', ')}`);
}

if (problems.length) {
  console.error('\nI18N extract issues:\n- ' + problems.join('\n- ') + '\n');
  process.exit(1);
} else {
  console.log('I18N extract OK ✅');
}

