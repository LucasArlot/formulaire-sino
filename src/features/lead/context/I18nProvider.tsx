import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { I18N_TEXT } from './i18n';
import { I18N_TEXT, translate, plural, type Locale, type I18nKey, type Params } from './i18n';
import { makeFormatters, type Formatters } from './formatters';

type Ctx = {
  locale: Locale;
  dir: 'ltr' | 'rtl';
  t: (k: I18nKey, p?: Params) => string;
  tp: (base: I18nKey, count: number, p?: Omit<Params, 'count'>) => string;
  fmt: Formatters;
  setLocale: (l: Locale) => void;
};

const I18nCtx = createContext<Ctx>(null as unknown as Ctx);

function getInitialLocale(fallback: Locale): Locale {
  try {
    const stored = localStorage.getItem('locale');
    if (stored && Object.prototype.hasOwnProperty.call(I18N_TEXT, stored)) {
      return stored as Locale;
    }
  } catch {}
  return fallback;
}

export function I18nProvider({ initialLocale = 'en' as Locale, children }: { initialLocale?: Locale; children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>(() => getInitialLocale(initialLocale));
  const RTL_LOCALES = new Set<Locale>(['ar']);
  const dir: 'ltr' | 'rtl' = RTL_LOCALES.has(locale) ? 'rtl' : 'ltr';

  const fmt = useMemo(() => makeFormatters(locale), [locale]);

  const value = useMemo<Ctx>(() => ({
    locale,
    dir,
    fmt,
    setLocale,
    t: (k: I18nKey, p?: Params) => translate(locale, k, p),
    tp: (base: I18nKey, count: number, p?: Omit<Params, 'count'>) => plural(locale, base as any, count, p),
  }), [locale, dir, fmt]);

  useEffect(() => {
    document.documentElement.setAttribute('dir', dir);
    document.documentElement.setAttribute('lang', locale);
  }, [dir, locale]);

  useEffect(() => {
    try {
      localStorage.setItem('locale', locale);
    } catch {}
  }, [locale]);

  return <I18nCtx.Provider value={value}>{children}</I18nCtx.Provider>;
}

export const useI18n = () => useContext(I18nCtx);

