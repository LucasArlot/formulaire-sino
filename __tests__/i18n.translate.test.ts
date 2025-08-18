import { translate } from '../src/features/lead/context/i18n';

test('replaces {current} in stepCounter', () => {
  expect(translate('fr' as any, 'stepCounter', { current: 3 })).toMatch(/3/);
});

test('falls back to EN for unknown locale', () => {
  // @ts-expect-error intentional bad locale
  expect(translate('xx', 'mainTitle')).toBeTruthy();
});

