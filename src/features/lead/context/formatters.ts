import type { Locale } from './i18n';

export function makeFormatters(locale: Locale) {
  return {
    number: (n: number, opts?: Intl.NumberFormatOptions) =>
      new Intl.NumberFormat(locale, opts).format(n),
    currency: (n: number, currency: string, opts?: Intl.NumberFormatOptions) =>
      new Intl.NumberFormat(locale, { style: 'currency', currency, ...opts }).format(n),
    date: (d: Date | number, opts?: Intl.DateTimeFormatOptions) =>
      new Intl.DateTimeFormat(locale, opts).format(d),
    relativeTime: (
      value: number,
      unit: Intl.RelativeTimeFormatUnit,
      opts?: Intl.RelativeTimeFormatOptions
    ) => new Intl.RelativeTimeFormat(locale, { numeric: 'auto', ...opts }).format(value, unit),
    list: (items: string[], opts?: Intl.ListFormatOptions) =>
      new Intl.ListFormat(locale, { style: 'long', type: 'conjunction', ...opts }).format(items),
    unit: (n: number, unit: Intl.NumberFormatOptions['unit'], opts?: Intl.NumberFormatOptions) =>
      new Intl.NumberFormat(locale, {
        style: 'unit',
        unit,
        unitDisplay: 'short',
        ...opts,
      } as Intl.NumberFormatOptions).format(n),
  };
}
export type Formatters = ReturnType<typeof makeFormatters>;
