import React, { useEffect, useRef, useState } from 'react';
import KarakteristikData from './KarakteristikData';
import SistemArsitektur from './SistemArsitektur';
import BiodataTim from './BiodataTim';
import logoRsj from '../assets/logo-vertikal-rsj.png';
import { useTranslation } from '../lib/TranslationContext';
import { LanguageSwitcherInline } from './LanguageSwitcher';

/* ─── Scroll Reveal Hook ─── */
function useReveal(threshold = 0.12) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, vis];
}

function Reveal({ children, className = '', delay = 0, y = 22, style: extra = {} }) {
  const [ref, vis] = useReveal();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: vis ? 1 : 0,
        transform: vis ? 'translateY(0)' : `translateY(${y}px)`,
        transition: `opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
        ...extra,
      }}
    >
      {children}
    </div>
  );
}

/* ─── Section Heading ─── */
function SectionHead({ label, title, subtitle }) {
  return (
    <div style={{ textAlign: 'center', marginBottom: 56 }}>
      <span style={{
        display: 'inline-block', padding: '5px 14px', borderRadius: 9999,
        background: '#E8F0FE', border: '1px solid #AECBFA',
        fontSize: 11, fontWeight: 700, color: '#1A73E8',
        textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 16,
      }}>
        {label}
      </span>
      <h2 style={{
        fontFamily: "'Hanken Grotesk', system-ui", fontWeight: 800,
        fontSize: 'clamp(26px,4vw,38px)', color: '#202124',
        letterSpacing: '-0.025em', lineHeight: 1.18, margin: '0 0 16px',
      }}>
        {title}
      </h2>
      {subtitle && (
        <p style={{ fontSize: 16, color: '#5F6368', maxWidth: 560, margin: '0 auto', lineHeight: 1.7 }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

/* ─── Feature Card ─── */
function FeatureCard({ icon, iconBg, iconColor, title, desc, highlight }) {
  return (
    <div
      className="pp-hover-lift"
      style={{
        background: '#FFFFFF', border: '1px solid #DADCE0',
        borderRadius: 16, padding: '28px 24px',
        boxShadow: '0 1px 4px rgba(60,64,67,0.08)',
        display: 'flex', flexDirection: 'column', gap: 16,
        position: 'relative', overflow: 'hidden',
      }}
    >
      {highlight && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 3,
          background: 'linear-gradient(90deg, #1A73E8, #34A8E0)',
          borderRadius: '16px 16px 0 0',
        }} />
      )}
      <div style={{
        width: 48, height: 48, borderRadius: 12,
        background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <span className="material-symbols-outlined" style={{ fontSize: 24, color: iconColor, fontVariationSettings: "'FILL' 1" }}>
          {icon}
        </span>
      </div>
      <div>
        <h3 style={{ fontFamily: "'Hanken Grotesk', system-ui", fontWeight: 700, fontSize: 16, color: '#202124', marginBottom: 8, lineHeight: 1.3 }}>
          {title}
        </h3>
        <p style={{ fontSize: 13, color: '#5F6368', lineHeight: 1.7, margin: 0 }}>{desc}</p>
      </div>
    </div>
  );
}

/* ─── Stat Pill ─── */
function StatPill({ value, label }) {
  return (
    <div style={{ textAlign: 'center', padding: '20px 32px' }}>
      <p style={{
        fontFamily: "'Hanken Grotesk', system-ui", fontWeight: 900,
        fontSize: 30, color: '#202124', lineHeight: 1, margin: '0 0 6px',
      }}>
        {value}
      </p>
      <p style={{ fontSize: 11, fontWeight: 600, color: '#80868B', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>
        {label}
      </p>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   MAIN — PublicPortal
   ═══════════════════════════════════════════════ */
export default function PublicPortal({ onEnterAdmin }) {
  const { t } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const navLinks = [
    ['home', t('pp_nav_home')],
    ['about', t('pp_nav_about')],
    ['characteristics', t('pp_nav_char')],
    ['flowchart', t('pp_nav_flow')],
    ['team', t('pp_nav_team')],
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#FFFFFF', color: '#202124', fontFamily: "'Inter', system-ui, sans-serif", overflowX: 'hidden' }}>

      {/* ══════ GLOBAL STYLES ══════ */}
      <style>{`
        .pp-nav-link { background: none; border: none; cursor: pointer; font-size: 14px; font-weight: 500; color: #5F6368; font-family: 'Inter', system-ui; transition: color 0.2s; padding: 4px 0; }
        .pp-nav-link:hover { color: #1A73E8; }
        .pp-footer-link { font-size: 13px; color: #80868B; cursor: pointer; transition: color 0.2s; background: none; border: none; font-family: 'Inter', system-ui; display: block; padding: 4px 0; }
        .pp-footer-link:hover { color: #1A73E8; }
        @keyframes pp-scan { 0%,100% { top: 14%; } 50% { top: 83%; } }
        .pp-scan-line { animation: pp-scan 2.8s ease-in-out infinite; }
        @keyframes float-badge { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
        .pp-float { animation: float-badge 3s ease-in-out infinite; }
        @keyframes hero-glow { 0%,100% { opacity: 0.5; } 50% { opacity: 0.8; } }
        .pp-glow { animation: hero-glow 4s ease-in-out infinite; }
      `}</style>

      {/* ══════ HEADER ══════ */}
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        background: scrolled ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.85)',
        backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        borderBottom: `1px solid ${scrolled ? '#DADCE0' : 'rgba(218,220,224,0.5)'}`,
        boxShadow: scrolled ? '0 1px 10px rgba(60,64,67,0.08)' : 'none',
        transition: 'all 0.3s ease',
      }}>
        <div style={{
          maxWidth: 1200, margin: '0 auto',
          padding: '0 28px',
          height: scrolled ? 60 : 72,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          transition: 'height 0.3s ease',
        }}>
          {/* Brand */}
          <button onClick={() => scrollTo('home')} style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'none', border: 'none', cursor: 'pointer' }}>
            <div style={{ width: 160, height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              <img src={logoRsj} alt="Logo RSJ Tampan Riau" style={{ width: '100%', height: '130%', objectFit: 'contain' }} />
            </div>
          </button>

          {/* Desktop Nav */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: 28 }} className="hidden md:flex">
            {navLinks.map(([id, label]) => (
              <button key={id} onClick={() => scrollTo(id)} className="pp-nav-link">{label}</button>
            ))}
          </nav>

          {/* CTA + Mobile toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button
              onClick={onEnterAdmin}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                background: '#1A73E8', color: '#FFFFFF',
                border: 'none', borderRadius: 8,
                padding: '8px 16px', cursor: 'pointer',
                fontSize: 13, fontWeight: 600,
                fontFamily: "'Inter', system-ui",
                boxShadow: '0 1px 4px rgba(26,115,232,0.3)',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#1558B0'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(26,115,232,0.4)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#1A73E8'; e.currentTarget.style.boxShadow = '0 1px 4px rgba(26,115,232,0.3)'; }}
              className="hidden md:flex"
            >
              <span className="material-symbols-outlined" style={{ fontSize: 15, fontVariationSettings: "'FILL' 1" }}>admin_panel_settings</span>
              {t('pp_admin')}
            </button>

            {/* Language switcher */}
            <div className="hidden md:flex">
              <LanguageSwitcherInline />
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMenuOpen(v => !v)}
              style={{ background: '#F1F3F4', border: '1px solid #DADCE0', borderRadius: 8, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              className="md:hidden"
            >
              <span className="material-symbols-outlined" style={{ fontSize: 18, color: '#5F6368' }}>{menuOpen ? 'close' : 'menu'}</span>
            </button>
          </div>
        </div>

        {/* Mobile Nav Dropdown */}
        {menuOpen && (
          <div style={{ borderTop: '1px solid #DADCE0', background: '#FFFFFF', padding: '12px 20px 16px' }}>
            {navLinks.map(([id, label]) => (
              <button key={id} onClick={() => scrollTo(id)} style={{
                display: 'block', width: '100%', textAlign: 'left', background: 'none', border: 'none',
                cursor: 'pointer', padding: '10px 0', fontSize: 15, fontWeight: 500, color: '#202124',
                borderBottom: '1px solid #F1F3F4', fontFamily: "'Inter', system-ui",
              }}>{label}</button>
            ))}
            <button onClick={onEnterAdmin} style={{ display: 'block', marginTop: 12, background: 'none', border: 'none', cursor: 'pointer', fontSize: 15, fontWeight: 700, color: '#1A73E8', fontFamily: "'Inter', system-ui" }}>
              {t('pp_admin')} →
            </button>
            <div style={{ marginTop: 12 }}>
              <LanguageSwitcherInline />
            </div>
          </div>
        )}
      </header>

      {/* ══════ HERO ══════ */}
      <section id="home" style={{ position: 'relative', paddingTop: 160, paddingBottom: 120, overflow: 'hidden', background: '#FFFFFF' }}>

        {/* Background pattern */}
        <div className="pattern-dots" style={{ position: 'absolute', inset: 0, opacity: 0.6, pointerEvents: 'none' }} />

        {/* Background glow */}
        <div className="pp-glow" style={{
          position: 'absolute', top: -120, left: '50%', transform: 'translateX(-50%)',
          width: 800, height: 600, borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(26,115,232,0.05) 0%, transparent 65%)',
          pointerEvents: 'none',
        }} />

        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 28px', textAlign: 'center', position: 'relative', zIndex: 1 }}>

          {/* Label badge */}
          <Reveal>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '7px 16px', borderRadius: 9999,
              background: '#E8F0FE', border: '1px solid #AECBFA',
              marginBottom: 28,
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: 14, color: '#1A73E8', fontVariationSettings: "'FILL' 1" }}>verified</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#1558B0', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                {t('pp_badge')}
              </span>
            </div>
          </Reveal>

          {/* Main headline */}
          <Reveal delay={80}>
            <h1 style={{
              fontFamily: "'Hanken Grotesk', system-ui", fontWeight: 900,
              fontSize: 'clamp(38px, 6.5vw, 68px)', lineHeight: 1.06,
              letterSpacing: '-0.03em', color: '#202124', margin: '0 0 24px',
            }}>
              {t('pp_hero_title1')}{' '}
              <span style={{ color: '#1A73E8' }}>{t('pp_hero_title2')}</span>
              <br />{t('pp_hero_title3')}
            </h1>
          </Reveal>

          {/* Subtitle */}
          <Reveal delay={150}>
            <p style={{ fontSize: 17, lineHeight: 1.75, color: '#5F6368', maxWidth: 560, margin: '0 auto 44px', fontWeight: 400 }}>
              {t('pp_hero_subtitle', { arch: 'Convolutional Neural Network (CNN)' })}
            </p>
          </Reveal>

          {/* CTA Buttons */}
          <Reveal delay={210}>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 60 }}>
              <button
                className="g-btn-primary"
                onClick={onEnterAdmin}
                style={{ padding: '13px 28px', fontSize: 14, borderRadius: 10 }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 18, fontVariationSettings: "'FILL' 1" }}>science</span>
                {t('pp_cta_analyze')}
              </button>
              <button
                onClick={() => scrollTo('about')}
                style={{
                  padding: '13px 28px', fontSize: 14, fontWeight: 600, borderRadius: 10,
                  background: '#FFFFFF', color: '#202124', border: '1.5px solid #DADCE0',
                  cursor: 'pointer', transition: 'all 0.2s ease',
                  fontFamily: "'Inter', system-ui",
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#1A73E8'; e.currentTarget.style.color = '#1A73E8'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#DADCE0'; e.currentTarget.style.color = '#202124'; }}
              >
                {t('pp_cta_learn')}
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_downward</span>
              </button>
            </div>
          </Reveal>

          {/* Stats strip */}
          <Reveal delay={280}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center',
              background: '#FFFFFF', border: '1px solid #DADCE0',
              borderRadius: 16, boxShadow: '0 1px 6px rgba(60,64,67,0.08)',
              overflow: 'hidden',
            }}>
              {[
                ['DenseNet121', t('pp_stat_arch')],
                ['< 0.5 dtk',  t('pp_stat_time')],
                ['86.5%',      t('pp_stat_acc')],
                ['256×256 px', t('pp_stat_res')],
              ].map(([v, l], i) => (
                <div key={l} style={{ display: 'flex', alignItems: 'center' }}>
                  {i > 0 && <div style={{ width: 1, height: 40, background: '#DADCE0' }} />}
                  <div style={{ padding: '18px 28px', textAlign: 'center' }}>
                    <p style={{
                      fontFamily: "'Hanken Grotesk', system-ui", fontWeight: 900,
                      fontSize: 22, color: i === 2 ? '#1A73E8' : '#202124', lineHeight: 1, margin: '0 0 4px',
                    }}>{v}</p>
                    <p style={{ fontSize: 10, fontWeight: 600, color: '#80868B', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>{l}</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>

          {/* Hero X-Ray mockup */}
          <Reveal delay={350} y={30}>
            <div style={{ marginTop: 64, position: 'relative', display: 'inline-block' }}>
              <div style={{
                width: 280, height: 280, borderRadius: 20,
                background: 'linear-gradient(145deg, #1a1a1a, #0d0d0d)',
                border: '1px solid #DADCE0',
                boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                position: 'relative', overflow: 'hidden', margin: '0 auto',
              }}>
                {/* Mock X-Ray ribs */}
                <svg width="200" height="200" viewBox="0 0 200 200" style={{ opacity: 0.7 }}>
                  <ellipse cx="100" cy="100" rx="55" ry="70" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
                  <ellipse cx="100" cy="100" rx="35" ry="48" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                  <path d="M60 60 Q50 100 60 140" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="3" />
                  <path d="M140 60 Q150 100 140 140" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="3" />
                  <path d="M65 75 Q50 80 40 90" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
                  <path d="M135 75 Q150 80 160 90" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
                  <path d="M65 95 Q50 100 38 108" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
                  <path d="M135 95 Q150 100 162 108" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
                  <path d="M67 115 Q52 120 42 128" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
                  <path d="M133 115 Q148 120 158 128" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
                  {/* Spine */}
                  <line x1="100" y1="40" x2="100" y2="160" stroke="rgba(255,255,255,0.2)" strokeWidth="3" />
                </svg>
                {/* Scanner line */}
                <div
                  className="pp-scan-line"
                  style={{
                    position: 'absolute', left: 0, right: 0, height: 2,
                    background: 'linear-gradient(90deg, transparent, #1A73E8, transparent)',
                    boxShadow: '0 0 12px 2px rgba(26,115,232,0.6)',
                  }}
                />
              </div>

              {/* Floating result badge */}
              <div
                className="pp-float"
                style={{
                  position: 'absolute', top: -16, right: -20,
                  background: '#FFFFFF', border: '1px solid #DADCE0',
                  borderRadius: 12, padding: '10px 14px',
                  boxShadow: '0 4px 16px rgba(60,64,67,0.12)',
                  display: 'flex', alignItems: 'center', gap: 8,
                }}
              >
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#1E8E3E' }} />
                <span style={{ fontSize: 12, fontWeight: 700, color: '#202124' }}>Normal</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#1E8E3E' }}>98.1%</span>
              </div>

              {/* Floating CTR badge */}
              <div
                style={{
                  position: 'absolute', bottom: -12, left: -20,
                  background: '#E8F0FE', border: '1px solid #AECBFA',
                  borderRadius: 12, padding: '10px 14px',
                  boxShadow: '0 4px 16px rgba(60,64,67,0.1)',
                  display: 'flex', alignItems: 'center', gap: 8,
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 14, color: '#1A73E8', fontVariationSettings: "'FILL' 1" }}>analytics</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#1558B0' }}>CTR: 0.46</span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══════ ABOUT / STATS ══════ */}
      <section id="about" style={{ background: '#F8F9FA', padding: '100px 28px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <Reveal>
            <SectionHead
              label={t('pp_about_label')}
              title={t('pp_about_title')}
              subtitle={t('pp_about_subtitle')}
            />
          </Reveal>

          {/* Big stats */}
          <Reveal delay={100}>
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 2, background: '#DADCE0', borderRadius: 16,
              border: '1px solid #DADCE0',
              overflow: 'hidden', marginBottom: 64,
              boxShadow: '0 1px 6px rgba(60,64,67,0.06)',
            }}>
              {[
                { value: '1.284+',    label: t('pp_stat_total'), bg: '#FFFFFF' },
                { value: '86.5%',     label: t('pp_stat_acc2'),  bg: '#E8F0FE', highlight: true },
                { value: '2 Kelas',   label: t('pp_stat_class'), bg: '#FFFFFF' },
                { value: '< 0.5 dtk', label: t('pp_stat_speed'), bg: '#FFFFFF' },
              ].map(({ value, label, bg, highlight }) => (
                <div key={label} style={{
                  background: bg, padding: '32px 24px', textAlign: 'center',
                }}>
                  <p style={{
                    fontFamily: "'Hanken Grotesk', system-ui", fontWeight: 900,
                    fontSize: 36, color: highlight ? '#1A73E8' : '#202124', lineHeight: 1, margin: '0 0 8px',
                  }}>{value}</p>
                  <p style={{ fontSize: 12, fontWeight: 600, color: '#80868B', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>{label}</p>
                </div>
              ))}
            </div>
          </Reveal>

          {/* Feature Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
            {[
              {
                icon: 'cardiology', iconBg: '#FCE8E6', iconColor: '#D93025',
                title: t('pp_feat1_title'), desc: t('pp_feat1_desc'),
              },
              {
                icon: 'monitoring', iconBg: '#E8F0FE', iconColor: '#1A73E8',
                title: t('pp_feat2_title'), desc: t('pp_feat2_desc'), highlight: true,
              },
              {
                icon: 'bolt', iconBg: '#FEF7E0', iconColor: '#F9AB00',
                title: t('pp_feat3_title'), desc: t('pp_feat3_desc'),
              },
              {
                icon: 'shield_lock', iconBg: '#E6F4EA', iconColor: '#1E8E3E',
                title: t('pp_feat4_title'), desc: t('pp_feat4_desc'),
              },
            ].map((card, i) => (
              <Reveal key={card.title} delay={i * 60}>
                <FeatureCard {...card} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ CHARACTERISTICS ══════ */}
      <section id="characteristics" style={{ background: '#FFFFFF', padding: '100px 28px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <Reveal>
            <SectionHead
              label={t('pp_char_label')}
              title={t('pp_char_title')}
              subtitle={t('pp_char_subtitle')}
            />
          </Reveal>
          <Reveal delay={100}>
            <KarakteristikData />
          </Reveal>
        </div>
      </section>

      {/* ══════ FLOWCHART ══════ */}
      <section id="flowchart" style={{ background: '#F8F9FA', padding: '100px 28px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <Reveal>
            <SectionHead
              label={t('pp_flow_label')}
              title={t('pp_flow_title')}
              subtitle={t('pp_flow_subtitle')}
            />
          </Reveal>
          <Reveal delay={100}>
            <SistemArsitektur />
          </Reveal>
        </div>
      </section>

      {/* ══════ TEAM ══════ */}
      <section id="team" style={{ background: '#FFFFFF', padding: '100px 28px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <Reveal>
            <SectionHead
              label={t('pp_team_label')}
              title={t('pp_team_title')}
              subtitle={t('pp_team_subtitle')}
            />
          </Reveal>
          <Reveal delay={100}>
            <BiodataTim />
          </Reveal>
        </div>
      </section>

      {/* ══════ CTA BAND ══════ */}
      <section style={{
        background: 'linear-gradient(135deg, #1A73E8 0%, #0D47A1 100%)',
        padding: '80px 28px', textAlign: 'center',
      }}>
        <Reveal>
          <p style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: 16 }}>
            {t('pp_cta_label')}
          </p>
          <h2 style={{
            fontFamily: "'Hanken Grotesk', system-ui", fontWeight: 800,
            fontSize: 'clamp(26px, 4vw, 38px)', color: '#FFFFFF',
            letterSpacing: '-0.025em', margin: '0 0 24px', lineHeight: 1.2,
          }}>
            {t('pp_cta_title')}
          </h2>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.8)', maxWidth: 480, margin: '0 auto 36px', lineHeight: 1.7 }}>
            {t('pp_cta_subtitle')}
          </p>
          <button
            onClick={onEnterAdmin}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '14px 32px', borderRadius: 10,
              background: '#FFFFFF', color: '#1A73E8',
              border: 'none', cursor: 'pointer',
              fontSize: 14, fontWeight: 700,
              fontFamily: "'Inter', system-ui",
              boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.2)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.15)'; }}
          >
              {t('pp_cta_btn')}
          </button>
        </Reveal>
      </section>

      {/* ══════ FOOTER ══════ */}
      <footer style={{ background: '#202124', color: '#FFFFFF', padding: '60px 28px 40px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 40, marginBottom: 48 }}>
            {/* Brand */}
            <div>
              <div style={{ width: 140, height: 48, marginBottom: 16, overflow: 'hidden' }}>
                <img src={logoRsj} alt="RSJ Tampan Riau" style={{ width: '100%', height: '100%', objectFit: 'contain', filter: 'brightness(0) invert(1)' }} />
              </div>
              <p style={{ fontSize: 13, color: '#80868B', lineHeight: 1.7, maxWidth: 220 }}>
                {t('pp_footer_brand')}
              </p>
            </div>

            {/* Navigation */}
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#9AA0A6', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>{t('pp_footer_nav')}</p>
              {navLinks.map(([id, label]) => (
                <button key={id} onClick={() => scrollTo(id)} className="pp-footer-link">{label}</button>
              ))}
            </div>

            {/* System */}
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#9AA0A6', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>{t('pp_footer_spec')}</p>
              {[
                ['Arsitektur', 'DenseNet-121 (CheXNet)'],
                ['Dataset', 'RSJ Tampan Riau'],
                ['Akurasi', '86.5%'],
                ['Framework', 'TensorFlow / Keras'],
              ].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: 12, color: '#80868B' }}>{k}</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#E8EAED' }}>{v}</span>
                </div>
              ))}
            </div>

            {/* Institution */}
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#9AA0A6', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>{t('pp_footer_inst')}</p>
              <p style={{ fontSize: 13, color: '#80868B', lineHeight: 1.7 }}>
                Politeknik Caltex Riau<br />
                Program Studi Sistem Informasi<br />
                Mata Kuliah Penambangan Data<br />
                <br />
                <span style={{ color: '#AECBFA' }}>{t('pp_footer_group')}</span>
              </p>
            </div>
          </div>

          {/* Bottom bar */}
          <div style={{ borderTop: '1px solid #3C4043', paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <p style={{ fontSize: 12, color: '#80868B', margin: 0 }}>
              {t('pp_footer_copy')}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 12, color: '#80868B' }}>{t('pp_footer_by')}</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#AECBFA' }}>Supabase</span>
              <span style={{ fontSize: 12, color: '#80868B' }}>+</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#AECBFA' }}>TensorFlow</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
