import { I18N_TEXT } from '../src/features/lead/context/i18n';

const base = I18N_TEXT.en;
const baseKeys = Object.keys(base);
const placeholderRe = /\{(\w+)\}/g;

function placeholders(s: string) {
  const set = new Set<string>();
  s.replace(placeholderRe, (_: string, p: string) => (set.add(p), ''));
  return set;
}

let hasError = false;

for (const [locale, dict] of Object.entries(I18N_TEXT)) {
  const keys = Object.keys(dict);
  const missing = baseKeys.filter(k => !(k in dict));
  const extra = keys.filter(k => !baseKeys.includes(k));

  if (missing.length || extra.length) {
    hasError = true;
    if (missing.length) console.warn(`[${locale}] Missing keys (${missing.length}):`, missing.slice(0, 50));
    if (extra.length) console.warn(`[${locale}] Extra keys (${extra.length}):`, extra.slice(0, 50));
  }

  for (const k of baseKeys) {
    if (!(k in dict)) continue;
    const ref = placeholders(base[k]!);
    const cur = placeholders(dict[k]!);
    for (const p of ref) {
      if (!cur.has(p)) {
        hasError = true;
        console.warn(`[${locale}] Placeholder manquant dans "${k}": {${p}}`);
      }
    }
  }
}

process.exit(hasError ? 1 : 0);

