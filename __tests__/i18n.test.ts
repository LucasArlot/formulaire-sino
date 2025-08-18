import { translate, I18N_TEXT } from '../src/features/lead/context/i18n';

describe('translate()', () => {
  test('returns localized string', () => {
    expect(translate('fr' as any, 'mainTitle')).toBe(I18N_TEXT.fr.mainTitle);
  });

  test('falls back to key when key missing', () => {
    const key = 'totallyNotThere' as unknown as keyof typeof I18N_TEXT['en'];
    expect(translate('fr' as any, key)).toBe('totallyNotThere');
  });

  test('interpolates params', () => {
    expect(translate('en' as any, 'stepCounter', { current: 3 })).toBe('Step 3/6');
  });

  test('keeps unknown placeholders intact', () => {
    expect(translate('en' as any, 'stepCounter')).toBe('Step {current}/6');
  });
});

