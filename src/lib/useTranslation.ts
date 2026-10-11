import { useState, useEffect, useCallback } from 'react';
import { SupportedLanguageCode, LanguageOption, TranslationKeyItem } from '../types';
import {
  SUPPORTED_LANGUAGES,
  getStoredLanguage,
  setStoredLanguage,
  getStoredTranslations,
  translate,
  formatDate as fmtDate,
  formatTime as fmtTime,
  formatNumber as fmtNum,
  formatCurrency as fmtCurr
} from './i18n';

export function useTranslation() {
  const [lang, setLangState] = useState<SupportedLanguageCode>(getStoredLanguage);
  const [translationKeys, setTranslationKeys] = useState<TranslationKeyItem[]>(getStoredTranslations);

  useEffect(() => {
    const handleLangChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ lang: SupportedLanguageCode }>;
      if (customEvent.detail?.lang) {
        setLangState(customEvent.detail.lang);
      }
    };

    const handleTranslationsUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<{ items: TranslationKeyItem[] }>;
      if (customEvent.detail?.items) {
        setTranslationKeys(customEvent.detail.items);
      } else {
        setTranslationKeys(getStoredTranslations());
      }
    };

    const handleStorageEvent = (e: StorageEvent) => {
      if (e.key === 'kava_user_language' || e.key === 'kava_user_profile') {
        setLangState(getStoredLanguage());
      }
      if (e.key === 'kava_custom_translations') {
        setTranslationKeys(getStoredTranslations());
      }
    };

    window.addEventListener('kava_language_changed', handleLangChange);
    window.addEventListener('kava_translations_updated', handleTranslationsUpdate);
    window.addEventListener('storage', handleStorageEvent);

    return () => {
      window.removeEventListener('kava_language_changed', handleLangChange);
      window.removeEventListener('kava_translations_updated', handleTranslationsUpdate);
      window.removeEventListener('storage', handleStorageEvent);
    };
  }, []);

  const changeLanguage = useCallback((newLang: SupportedLanguageCode) => {
    setLangState(newLang);
    setStoredLanguage(newLang);
  }, []);

  const t = useCallback(
    (key: string, fallbackOrParams?: string | Record<string, string | number>, params?: Record<string, string | number>): string => {
      return translate(key, lang, fallbackOrParams, translationKeys, params);
    },
    [lang, translationKeys]
  );

  const formatDate = useCallback(
    (date: string | Date | number, options?: Intl.DateTimeFormatOptions): string => {
      return fmtDate(date, lang, options);
    },
    [lang]
  );

  const formatTime = useCallback(
    (date: string | Date | number): string => {
      return fmtTime(date, lang);
    },
    [lang]
  );

  const formatNumber = useCallback(
    (num: number): string => {
      return fmtNum(num, lang);
    },
    [lang]
  );

  const formatCurrency = useCallback(
    (amount: number, currency: string = 'USD'): string => {
      return fmtCurr(amount, currency, lang);
    },
    [lang]
  );

  const currentLanguageObj = SUPPORTED_LANGUAGES.find(l => l.code === lang) || SUPPORTED_LANGUAGES[0];

  return {
    lang,
    setLanguage: changeLanguage,
    t,
    formatDate,
    formatTime,
    formatNumber,
    formatCurrency,
    supportedLanguages: SUPPORTED_LANGUAGES,
    currentLanguageObj,
    translationKeys
  };
}
