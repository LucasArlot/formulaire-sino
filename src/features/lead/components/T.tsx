import React from 'react';
import { useI18n } from '../context/I18nProvider';
import type { I18nKey, Params } from '../context/i18n';

export function T({ k, values }: { k: I18nKey; values?: Params }) {
  const { t } = useI18n();
  return <>{t(k, values)}</>;
}

