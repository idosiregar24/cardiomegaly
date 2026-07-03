import React, { useState } from 'react';
import { useTranslation } from '../lib/TranslationContext';
import { LanguageSwitcherInline } from './LanguageSwitcher';

const PAGE_META = {
  dashboard:  { icon: 'dashboard',     desc: 'Ringkasan statistik & analisis terkini',        color: '#1A73E8', bg: '#E8F0FE' },
  upload:     { icon: 'biotech',       desc: 'Unggah & proses citra rontgen dada pasien',     color: '#D93025', bg: '#FCE8E6' },
  history:    { icon: 'folder_shared', desc: 'Riwayat rekam medis dan data pasien',           color: '#1E8E3E', bg: '#E6F4EA' },
  settings:   { icon: 'tune',          desc: 'Konfigurasi endpoint API & sistem komputasi',   color: '#F9AB00', bg: '#FEF7E0' },
  karakteristik: { icon: 'analytics',  desc: 'Ambang batas & karakteristik CTR',             color: '#1A73E8', bg: '#E8F0FE' },
  biodata:    { icon: 'group',         desc: 'Profil kelompok peneliti',                      color: '#5F6368', bg: '#F1F3F4' },
};

export default function Header({ title, currentTab, onToggleMenu }) {
  const { t } = useTranslation();
  const [showNotifications, setShowNotifications] = useState(false);
  const meta = PAGE_META[currentTab] || { icon: 'menu', desc: '', color: '#5F6368', bg: '#F1F3F4' };

  const notifications = [
    { id: 1, text: t('notif1'), time: t('time_10min'), unread: true,  type: 'error' },
    { id: 2, text: t('notif2'), time: t('time_1h'),    unread: true,  type: 'warning' },
    { id: 3, text: t('notif3'), time: t('time_2h'),    unread: false, type: 'success' },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  const typeConfig = {
    error:   { dot: '#D93025', bg: '#FCE8E6' },
    warning: { dot: '#F9AB00', bg: '#FEF7E0' },
    success: { dot: '#1E8E3E', bg: 'transparent' },
  };

  return (
    <header
      className="w-full sticky top-0 z-40 bg-white/95 backdrop-blur-md"
      style={{ borderBottom: '1px solid #DADCE0', boxShadow: '0 1px 6px rgba(60,64,67,0.06)' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 24px', height: 60 }}>

        {/* Left — Title & breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Mobile menu placeholder */}
          <span onClick={onToggleMenu} className="md:hidden material-symbols-outlined" style={{ fontSize: 20, color: '#80868B', cursor: 'pointer' }}>menu</span>

          {/* Icon chip */}
          <div className="hidden md:flex" style={{
            width: 34, height: 34, borderRadius: 8,
            background: meta.bg, alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <span
              className="material-symbols-outlined"
              style={{ fontSize: 18, color: meta.color, fontVariationSettings: "'FILL' 1" }}
            >
              {meta.icon}
            </span>
          </div>

          <div>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: '#202124', margin: 0, lineHeight: 1.3, fontFamily: "'Hanken Grotesk', system-ui" }}>
              {title}
            </h2>
            {meta.desc && (
              <p className="hidden sm:block" style={{ fontSize: 10, color: '#80868B', margin: '1px 0 0' }}>{meta.desc}</p>
            )}
          </div>
        </div>

        {/* Right — Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, position: 'relative' }}>

          {/* Language switcher in header */}
          <div className="hidden sm:flex">
            <LanguageSwitcherInline />
          </div>

          {/* Date chip */}
          <div
            className="hidden sm:flex"
            style={{
              alignItems: 'center', gap: 6,
              padding: '5px 10px', borderRadius: 8,
              background: '#F8F9FA', border: '1px solid #DADCE0',
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 13, color: '#80868B' }}>calendar_today</span>
            <span style={{ fontSize: 11, fontWeight: 600, color: '#5F6368' }}>
              {new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
            </span>
          </div>

          {/* Notification button */}
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            style={{
              width: 36, height: 36, borderRadius: 8,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              position: 'relative', cursor: 'pointer', border: 'none',
              background: showNotifications ? '#E8F0FE' : 'transparent',
              transition: 'background 0.15s ease',
            }}
            onMouseEnter={e => { if (!showNotifications) e.currentTarget.style.background = '#F1F3F4'; }}
            onMouseLeave={e => { if (!showNotifications) e.currentTarget.style.background = 'transparent'; }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 20, color: showNotifications ? '#1A73E8' : '#5F6368' }}>
              {showNotifications ? 'notifications_active' : 'notifications'}
            </span>
            {unreadCount > 0 && (
              <span style={{
                position: 'absolute', top: -2, right: -2,
                width: 16, height: 16, background: '#D93025', borderRadius: '50%',
                color: '#FFFFFF', fontSize: 8, fontWeight: 800,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: '2px solid #FFFFFF',
              }}>
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notification Dropdown */}
          {showNotifications && (
            <div style={{
              position: 'absolute', right: 0, top: 44,
              width: 290, maxWidth: 'calc(100vw - 32px)', borderRadius: 14,
              background: '#FFFFFF', border: '1px solid #DADCE0',
              boxShadow: '0 8px 32px rgba(60,64,67,0.14)',
              zIndex: 60, overflow: 'hidden',
              animation: 'scale-in 0.2s ease both',
            }}>
              {/* Dropdown header */}
              <div style={{
                padding: '12px 16px', borderBottom: '1px solid #F1F3F4',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                background: '#F8F9FA',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 16, color: '#1A73E8', fontVariationSettings: "'FILL' 1" }}>notifications_active</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#202124' }}>{t('notifications')}</span>
                  <span style={{
                    background: '#1A73E8', color: '#FFFFFF', fontSize: 9, fontWeight: 700,
                    padding: '1px 6px', borderRadius: 9999,
                  }}>{unreadCount}</span>
                </div>
                <button
                  onClick={() => setShowNotifications(false)}
                  style={{ fontSize: 10, color: '#80868B', cursor: 'pointer', background: 'none', border: 'none', fontWeight: 700, fontFamily: "'Inter', system-ui" }}
                >
                  {t('notifClose')}
                </button>
              </div>

              {/* Notification items */}
              <div style={{ maxHeight: 240, overflowY: 'auto' }}>
                {notifications.map(n => (
                  <div
                    key={n.id}
                    style={{
                      padding: '12px 16px', borderBottom: '1px solid #F8F9FA',
                      background: n.unread ? typeConfig[n.type]?.bg : '#FFFFFF',
                      cursor: 'pointer', transition: 'background 0.15s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#F8F9FA'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = n.unread ? typeConfig[n.type]?.bg : '#FFFFFF'; }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                      <span style={{
                        width: 7, height: 7, borderRadius: '50%', flexShrink: 0, marginTop: 4,
                        background: typeConfig[n.type]?.dot || '#DADCE0',
                      }} />
                      <div>
                        <p style={{ fontSize: 12, color: '#202124', fontWeight: n.unread ? 600 : 400, lineHeight: 1.5, margin: '0 0 3px' }}>
                          {n.text}
                        </p>
                        <span style={{ fontSize: 10, color: '#80868B' }}>{n.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div style={{ padding: '8px', background: '#F8F9FA', borderTop: '1px solid #DADCE0' }}>
                <button style={{
                  width: '100%', padding: '8px', fontSize: 11, fontWeight: 700,
                  color: '#1A73E8', background: 'none', border: 'none', cursor: 'pointer',
                  fontFamily: "'Inter', system-ui",
                }}>
                  {t('notifViewAll')}
                </button>
              </div>
            </div>
          )}

          {/* Profile Avatar */}
          <div style={{
            width: 34, height: 34, borderRadius: 8, overflow: 'hidden', cursor: 'pointer',
            border: '2px solid #DADCE0', flexShrink: 0, transition: 'border-color 0.15s',
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#1A73E8'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#DADCE0'; }}
          >
            <img
              alt="Foto Profil"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuA060ix0BOtM_OjHlJWECWqjYXCReISixvT1yv2l1mkpIWnlwZifzu6DII8zZKR-bNC8spJmEasZaiB2QYef9ZwSP3bxWgRQKd35XQdk4n2PsZaUCaWgk7Axnov-3Rg2ioxjQRiD8Qpcx8M1z3zj7x9_0MoHQp26kLRauDR5RRKw5LdUW7hiGi6DVgsvrOBxLaFYoD-jRy4q7ozZU7WYm4u2sKmPt0MWDJ4owGJeAdqHuYLRn0gvsnm-iagx6u9rxP12PvcSY8l-cw"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
