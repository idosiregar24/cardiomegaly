/**
 * TranslationContext.jsx
 * Lightweight i18n engine — no external library.
 *
 * Usage:
 *   const { t, lang, toggleLang } = useTranslation();
 *   t('key')            → translated string
 *   t('key', {n: 42})  → string with variable interpolation: "{n}" → "42"
 */

import React, { createContext, useCallback, useContext, useState } from 'react';
import id from '../locales/id';
import en from '../locales/en';

const dictionaries = { id, en };

const TranslationContext = createContext(null);

export function TranslationProvider({ children }) {
  const [lang, setLang] = useState(() => {
    try {
      return localStorage.getItem('app_lang') || 'id';
    } catch {
      return 'id';
    }
  });

  const toggleLang = useCallback(() => {
    setLang(prev => {
      const next = prev === 'id' ? 'en' : 'id';
      try { localStorage.setItem('app_lang', next); } catch {}
      return next;
    });
  }, []);

  /** Translate a key, with optional variable substitution.
   *  e.g. t('db_total', { n: 128 }) → "dari 128 total pemeriksaan tersimpan"
   */
  const t = useCallback((key, vars = {}) => {
    const dict = dictionaries[lang] || dictionaries.id;
    let str = dict[key];
    if (str === undefined) {
      // Fallback to the other language, then to the key itself
      str = dictionaries[lang === 'id' ? 'en' : 'id'][key] ?? key;
    }
    // Replace {variable} placeholders
    if (vars && typeof str === 'string') {
      Object.entries(vars).forEach(([k, v]) => {
        str = str.replace(new RegExp(`\\{${k}\\}`, 'g'), v);
      });
    }
    return str;
  }, [lang]);

  return (
    <TranslationContext.Provider value={{ t, lang, toggleLang }}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  const ctx = useContext(TranslationContext);
  if (!ctx) throw new Error('useTranslation must be used inside <TranslationProvider>');
  return ctx;
}
