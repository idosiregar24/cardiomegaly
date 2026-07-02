/**
 * LanguageSwitcher.jsx
 * Floating flag-button toggle for ID ↔ EN.
 * Can be rendered in both the PublicPortal header and the Admin Header.
 */

import React, { useState } from 'react';
import { useTranslation } from '../lib/TranslationContext';

/* ─── Compact inline variant (for Navbar / Header toolbar) ─── */
export function LanguageSwitcherInline() {
  const { lang, toggleLang, t } = useTranslation();
  const isEn = lang === 'en';

  return (
    <button
      onClick={toggleLang}
      title={`Switch to ${t('langSwitch')}`}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        padding: '5px 10px',
        borderRadius: 8,
        border: '1.5px solid #DADCE0',
        background: '#FFFFFF',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        fontFamily: "'Inter', system-ui",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = '#1A73E8';
        e.currentTarget.style.background = '#E8F0FE';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = '#DADCE0';
        e.currentTarget.style.background = '#FFFFFF';
      }}
    >
      {/* Flag emoji */}
      <span style={{ fontSize: 14, lineHeight: 1 }}>
        {isEn ? '🇬🇧' : '🇮🇩'}
      </span>
      <span style={{ fontSize: 11, fontWeight: 700, color: '#202124', letterSpacing: '0.04em' }}>
        {isEn ? 'EN' : 'ID'}
      </span>
      {/* Swap arrow */}
      <span style={{ fontSize: 11, color: '#80868B' }}>↕</span>
    </button>
  );
}

/* ─── Floating FAB variant (fixed bottom-right, always visible) ─── */
export function LanguageSwitcherFAB() {
  const { lang, toggleLang, t } = useTranslation();
  const [hovered, setHovered] = useState(false);
  const isEn = lang === 'en';

  return (
    <>
      {/* Style injected once */}
      <style>{`
        @keyframes ls-pop {
          from { transform: scale(0.8); opacity: 0; }
          to   { transform: scale(1);   opacity: 1; }
        }
        .ls-fab-tooltip {
          position: absolute; right: 60px; top: 50%;
          transform: translateY(-50%);
          background: #202124; color: #FFFFFF;
          font-size: 11px; font-weight: 600;
          padding: 5px 10px; border-radius: 8px;
          white-space: nowrap; pointer-events: none;
          font-family: 'Inter', system-ui;
          animation: ls-pop 0.2s ease both;
        }
        .ls-fab-tooltip::after {
          content: '';
          position: absolute; left: 100%; top: 50%;
          transform: translateY(-50%);
          border: 5px solid transparent;
          border-left-color: #202124;
        }
      `}</style>

      <div
        style={{
          position: 'fixed',
          bottom: 80,   /* above mobile bottom nav */
          right: 20,
          zIndex: 999,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {/* Tooltip */}
        {hovered && (
          <div className="ls-fab-tooltip">
            {isEn ? 'Ganti ke Indonesia' : 'Switch to English'}
          </div>
        )}

        {/* Main button */}
        <button
          onClick={toggleLang}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          title={`Switch to ${t('langSwitch')}`}
          style={{
            width: 46, height: 46, borderRadius: '50%',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            gap: 1,
            background: '#FFFFFF',
            border: '2px solid #DADCE0',
            boxShadow: hovered
              ? '0 6px 20px rgba(26,115,232,0.25)'
              : '0 2px 8px rgba(60,64,67,0.15)',
            cursor: 'pointer',
            transition: 'all 0.25s cubic-bezier(0.16,1,0.3,1)',
            transform: hovered ? 'scale(1.1)' : 'scale(1)',
          }}
        >
          <span style={{ fontSize: 18, lineHeight: 1 }}>
            {isEn ? '🇬🇧' : '🇮🇩'}
          </span>
          <span style={{
            fontSize: 7, fontWeight: 800, color: '#1A73E8',
            letterSpacing: '0.06em', fontFamily: "'Inter', system-ui",
          }}>
            {isEn ? 'EN' : 'ID'}
          </span>
        </button>
      </div>
    </>
  );
}

/* Default export = inline for convenience */
export default LanguageSwitcherInline;
