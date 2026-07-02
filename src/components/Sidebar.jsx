import React from 'react';
import logoRsj from '../assets/logo-vertikal-rsj.png';
import { useTranslation } from '../lib/TranslationContext';
import { LanguageSwitcherInline } from './LanguageSwitcher';

export default function Sidebar({ currentTab, setCurrentTab, onExit }) {
  const { t } = useTranslation();
  const navItems = [
    { id: 'dashboard', label: t('nav_dashboard'), icon: 'dashboard',     desc: t('nav_dashboard_desc') },
    { id: 'upload',    label: t('nav_upload'),    icon: 'biotech',       desc: t('nav_upload_desc') },
    { id: 'history',   label: t('nav_history'),   icon: 'folder_shared', desc: t('nav_history_desc') },
    { id: 'settings',  label: t('nav_settings'),  icon: 'tune',          desc: t('nav_settings_desc') },
  ];

  return (
    <>
      {/* ─── Desktop Sidebar ─── */}
      <aside className="hidden md:flex h-screen w-64 fixed left-0 top-0 flex-col z-50 bg-white border-r border-[#DADCE0]">

        {/* Logo */}
        <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid #F1F3F4' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10, overflow: 'hidden',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'linear-gradient(135deg, #1A73E8, #0D47A1)',
              flexShrink: 0,
            }}>
              <img src={logoRsj} alt="Logo RSJ Tampan Riau" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>
            <div>
              <h1 style={{ fontSize: 13, fontWeight: 800, color: '#202124', lineHeight: 1.3, margin: 0, fontFamily: "'Hanken Grotesk', system-ui" }}>
                RSJ Tampan Riau
              </h1>
              <p style={{ fontSize: 9, color: '#80868B', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 600, margin: '2px 0 0' }}>
                Kardiomegali ODGJ
              </p>
            </div>
          </div>
        </div>

        {/* Doctor Profile */}
        <div style={{
          margin: '14px 12px 8px',
          padding: '10px 12px',
          borderRadius: 10,
          background: '#F8F9FA',
          border: '1px solid #DADCE0',
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <div style={{ width: 34, height: 34, borderRadius: '50%', overflow: 'hidden', flexShrink: 0, border: '2px solid #DADCE0' }}>
            <img
              alt="Dr. Budi Santoso"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCT2X5pKjMpSgoZAfcBs0VWgUKPwIH0mjCuWWWOZpMlxo0VPeNfM1-sOb46EbFt2dbRHX0MXJYpczY9g0KCJ0C6yWEPwHn1seZNcBMVSkveHFZCAqBP6dE3GiJvvKWvv5sqcS8BQZMiFGBb61KfHiIZPhpoglGWffd91rjjJdwluSD7Ofp1Sq3zLpZoh4zrCMTLPYyvfMBn5OhWWpKMJ83tWFB_SK3w8HIHpxsTw1509UHagisI1pL7EdeQw7GSlUtxgoi-Y_CmXSk"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: '#202124', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              Dr. Budi Santoso
            </p>
            <p style={{ fontSize: 10, color: '#80868B', margin: '1px 0 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              Spesialis Radiologi
            </p>
          </div>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#1E8E3E', flexShrink: 0, boxShadow: '0 0 0 2px rgba(30,142,62,0.2)' }} title="Online" />
        </div>

        {/* Section Label */}
        <p style={{ padding: '6px 20px 4px', fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#80868B' }}>
          Menu Utama
        </p>

        {/* Nav Items */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 2, padding: '0 8px' }}>
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '9px 12px',
                  borderRadius: isActive ? '0 8px 8px 0' : 8,
                  textAlign: 'left', width: '100%', cursor: 'pointer',
                  border: 'none',
                  borderLeft: isActive ? '3px solid #1A73E8' : '3px solid transparent',
                  background: isActive ? '#E8F0FE' : 'transparent',
                  transition: 'all 0.15s ease',
                  marginLeft: isActive ? 0 : 0,
                }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = '#F1F3F4'; }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
              >
                <div style={{
                  width: 32, height: 32, borderRadius: 8,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: isActive ? '#FFFFFF' : '#F1F3F4',
                  border: isActive ? '1px solid #AECBFA' : '1px solid transparent',
                  flexShrink: 0,
                  transition: 'all 0.15s ease',
                }}>
                  <span
                    className="material-symbols-outlined"
                    style={{
                      fontSize: 17,
                      color: isActive ? '#1A73E8' : '#5F6368',
                      fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0",
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {item.icon}
                  </span>
                </div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <p style={{
                    fontSize: 13, fontWeight: isActive ? 700 : 500,
                    color: isActive ? '#1A73E8' : '#3C4043',
                    margin: 0, lineHeight: 1.3,
                  }}>
                    {item.label}
                  </p>
                  {isActive && (
                    <p style={{ fontSize: 9, color: '#1A73E8', margin: '2px 0 0', opacity: 0.8 }}>{item.desc}</p>
                  )}
                </div>
                {isActive && (
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#1A73E8', flexShrink: 0 }} />
                )}
              </button>
            );
          })}
        </nav>

        <div style={{ flex: 1 }} />

        {/* Storage indicator */}
        <div style={{
          margin: '0 12px 12px',
          padding: '12px 14px',
          background: '#F8F9FA', border: '1px solid #DADCE0', borderRadius: 10,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <p style={{ fontSize: 10, fontWeight: 700, color: '#5F6368', display: 'flex', alignItems: 'center', gap: 5, margin: 0 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 12, color: '#80868B' }}>database</span>
                        {t('storage')}
            </p>
            <span style={{ fontSize: 10, fontWeight: 700, color: '#1A73E8' }}>75%</span>
          </div>
          <div style={{ height: 5, width: '100%', borderRadius: 9999, overflow: 'hidden', background: '#DADCE0' }}>
            <div style={{ height: '100%', width: '75%', borderRadius: 9999, background: 'linear-gradient(90deg, #1A73E8, #4285F4)' }} />
          </div>
          <p style={{ fontSize: 9, color: '#80868B', margin: '6px 0 0' }}>{t('storageUsed')}</p>
        </div>

        {/* Logout */}
        <div style={{ padding: '0 8px 16px', borderTop: '1px solid #F1F3F4', paddingTop: 8 }}>
          <button
            onClick={onExit}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '9px 12px', borderRadius: 8, width: '100%',
              cursor: 'pointer', border: 'none', background: 'transparent',
              transition: 'all 0.15s ease',
              color: '#80868B',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#FCE8E6'; e.currentTarget.style.color = '#D93025'; e.currentTarget.querySelector('.sidebar-logout-icon').style.color = '#D93025'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#80868B'; e.currentTarget.querySelector('.sidebar-logout-icon').style.color = '#80868B'; }}
          >
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: '#F1F3F4', flexShrink: 0,
            }}>
              <span className="material-symbols-outlined sidebar-logout-icon" style={{ fontSize: 17, color: '#80868B', transition: 'color 0.15s' }}>logout</span>
            </div>
            <span style={{ fontSize: 13, fontWeight: 600 }}>{t('nav_exit')}</span>
          </button>
        </div>
      </aside>

      {/* ─── Mobile Bottom Nav ─── */}
      <nav className="fixed bottom-0 left-0 w-full md:hidden z-50 bg-white border-t border-[#DADCE0]" style={{ boxShadow: '0 -1px 8px rgba(60,64,67,0.08)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', padding: '6px 4px 10px' }}>
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
              const shortLabel = {
              [t('nav_upload')]:   t('nav_upload_desc').split(' ')[0],
              [t('nav_history')]:  t('nav_history_desc').split(' ')[0],
              [t('nav_settings')]: t('nav_settings_desc').split(' ')[0],
              [t('nav_dashboard')]: t('nav_dashboard'),
            }[item.label] || item.label;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
                  padding: '6px 12px', borderRadius: 12,
                  border: 'none', cursor: 'pointer', background: 'transparent',
                  color: isActive ? '#1A73E8' : '#80868B',
                  transition: 'all 0.15s ease',
                  minWidth: 52,
                }}
              >
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: 22, fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
                >
                  {item.icon}
                </span>
                <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.04em' }}>{shortLabel}</span>
                {isActive && <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#1A73E8' }} />}
              </button>
            );
          })}
          <button
            onClick={onExit}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
              padding: '6px 12px', borderRadius: 12,
              border: 'none', cursor: 'pointer', background: 'transparent',
              color: '#80868B', minWidth: 52,
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 22 }}>logout</span>
            <span style={{ fontSize: 9, fontWeight: 700 }}>{t('nav_exit')}</span>
          </button>
        </div>
      </nav>
    </>
  );
}
