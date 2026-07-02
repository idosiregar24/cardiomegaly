import React, { useState } from 'react';
import idoAvatar from '../assets/Ido Refael Siregar.jpeg';
import { useTranslation } from '../lib/TranslationContext';

const glass = {
  background: '#FFFFFF',
  border: '1px solid #DADCE0',
  borderRadius: 16,
  boxShadow: '0 1px 4px rgba(60,64,67,0.08)',
};

export default function BiodataTim() {
  const { t } = useTranslation();
  const teamMembers = [
    {
      name: 'Ido Refael Siregar',
      nim: '2457301067',
      role: 'Ketua Kelompok / Full-Stack Developer',
      desc: 'Mahasiswa Sistem Informasi di Politeknik Caltex Riau, spesialisasi dalam Full-Stack Development & AI. Berhasil menjadi Finalis GEMASTIK 2025.',
      skills: ['React', 'Tailwind CSS', 'Laravel', 'Python Data Mining'],
      avatar: idoAvatar,
      initials: 'IS',
    },
    {
      name: 'Wilhelm Samto Tamba',
      nim: '2457301068',
      role: 'Co-Developer / Data Analyst',
      desc: 'Mahasiswa Sistem Informasi di Politeknik Caltex Riau, berkontribusi dalam analisis data hasil eksplorasi visualisasi citra thorax dan pendukung evaluasi performa model CNN.',
      skills: ['Data Analytics', 'Python Data Mining', 'SQL', 'Statistical Modeling'],
      avatar: idoAvatar,
      initials: 'RK',
    },
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const current = teamMembers[activeIndex];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* Overview */}
      <div style={{ ...glass, borderRadius: 20, padding: '28px 32px' }}>
        <h4 style={{ fontFamily: "'Hanken Grotesk', system-ui, sans-serif", fontWeight: 700, fontSize: 16, color: '#202124', marginBottom: 8 }}>
          {t('bio_title')}
        </h4>
        <p style={{ fontSize: 13, color: '#5F6368', lineHeight: 1.7, margin: 0, maxWidth: 700 }}>
          {t('bio_subtitle')}
        </p>
      </div>

      {/* Main card */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16 }} className="lg:grid-cols-12">

        {/* Left — profile */}
        <div style={{ ...glass, borderRadius: 20, padding: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, minHeight: 340 }} className="lg:col-span-5">
          <p style={{ fontSize: 10, fontWeight: 700, color: '#80868B', textTransform: 'uppercase', letterSpacing: '0.12em', alignSelf: 'flex-start' }}>{t('bio_profile')}</p>

          {/* Avatar */}
          <div style={{ position: 'relative' }}>
            <div style={{ width: 120, height: 120, borderRadius: '50%', overflow: 'hidden', border: '2px solid #DADCE0', boxShadow: '0 4px 16px rgba(60,64,67,0.1)' }}>
              <img src={current.avatar} alt={current.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{ position: 'absolute', bottom: 4, right: 4, width: 18, height: 18, borderRadius: '50%', background: '#34A853', border: '2.5px solid white' }} />
          </div>

          <div style={{ textAlign: 'center' }}>
            <h5 style={{ fontFamily: "'Hanken Grotesk', system-ui, sans-serif", fontWeight: 800, fontSize: 18, color: '#202124', margin: '0 0 4px' }}>{current.name}</h5>
            <p style={{ fontSize: 12, color: '#80868B', fontWeight: 500, margin: '0 0 10px' }}>NIM. {current.nim}</p>
            <span style={{ padding: '5px 14px', background: '#E8F0FE', border: '1px solid #AECBFA', borderRadius: 9999, fontSize: 11, fontWeight: 700, color: '#1A73E8' }}>
              {current.role}
            </span>
          </div>

          {/* Dots nav */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginTop: 'auto' }}>
            <button
              onClick={() => setActiveIndex(p => (p - 1 + teamMembers.length) % teamMembers.length)}
              style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.8)', border: '1px solid rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 1px 6px rgba(0,0,0,0.06)' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#1d1d1f'; e.currentTarget.querySelector('span').style.color = '#fff'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.8)'; e.currentTarget.querySelector('span').style.color = '#1d1d1f'; }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 16, color: '#1d1d1f' }}>chevron_left</span>
            </button>
            <div style={{ display: 'flex', gap: 6 }}>
              {teamMembers.map((_, i) => (
                <button key={i} onClick={() => setActiveIndex(i)}
                  style={{ width: i === activeIndex ? 20 : 7, height: 7, borderRadius: 9999, background: i === activeIndex ? '#1d1d1f' : 'rgba(0,0,0,0.15)', border: 'none', cursor: 'pointer', transition: 'all 0.3s ease', padding: 0 }}
                />
              ))}
            </div>
            <button
              onClick={() => setActiveIndex(p => (p + 1) % teamMembers.length)}
              style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.8)', border: '1px solid rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 1px 6px rgba(0,0,0,0.06)' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#1d1d1f'; e.currentTarget.querySelector('span').style.color = '#fff'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.8)'; e.currentTarget.querySelector('span').style.color = '#1d1d1f'; }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 16, color: '#1d1d1f' }}>chevron_right</span>
            </button>
          </div>
        </div>

        {/* Right — detail */}
        <div style={{ ...glass, borderRadius: 20, padding: '32px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }} className="lg:col-span-7">
          <div>
            <p style={{ fontSize: 10, fontWeight: 700, color: '#80868B', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 6 }}>{t('bio_focus')}</p>
            <h4 style={{ fontFamily: "'Hanken Grotesk', system-ui, sans-serif", fontWeight: 700, fontSize: 18, color: '#202124', marginBottom: 12 }}>{current.role}</h4>
            <p style={{ fontSize: 13, color: '#5F6368', lineHeight: 1.75, marginBottom: 24 }}>{current.desc}</p>

            <p style={{ fontSize: 10, fontWeight: 700, color: '#80868B', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 10 }}>{t('bio_skills')}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {current.skills.map(skill => (
                <span key={skill} style={{ padding: '6px 14px', background: '#F8F9FA', border: '1px solid #DADCE0', borderRadius: 9999, fontSize: 12, fontWeight: 600, color: '#3C4043' }}>
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div style={{ borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: 20, marginTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ fontSize: 10, fontWeight: 700, color: '#80868B', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 3 }}>{t('bio_category')}</p>
              <p style={{ fontSize: 13, fontWeight: 800, color: '#1A73E8' }}>{t('bio_course')}</p>
            </div>
            <div style={{ padding: '6px 16px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 9999, fontSize: 11, fontWeight: 800, color: '#15803d', letterSpacing: '0.08em' }}>
              GO TEAM!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
