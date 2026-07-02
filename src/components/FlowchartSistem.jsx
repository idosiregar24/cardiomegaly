import React, { useState } from 'react';
import { useTranslation } from '../lib/TranslationContext';

const glass = {
  background: '#FFFFFF',
  border: '1px solid #DADCE0',
  borderRadius: 16,
  boxShadow: '0 1px 4px rgba(60,64,67,0.08)',
};

export default function FlowchartSistem() {
  const { t } = useTranslation();
  const [activeStage, setActiveStage] = useState(null);

  const stages = [
    {
      id: 1,
      title: 'Frontend (Sisi Pengguna)',
      icon: 'desktop_windows',
      color: '#7c3aed',
      bg: '#f5f3ff',
      substeps: ['Unggah Citra Thorax', 'Antarmuka Web React', 'Kirim ke Backend API'],
      description: 'Dokter atau tenaga medis mengunggah citra rontgen dada (X-Ray Thorax) pasien melalui antarmuka web interaktif.',
    },
    {
      id: 2,
      title: 'Backend (Proses API)',
      icon: 'terminal',
      color: '#059669',
      bg: '#f0fdf4',
      substeps: ['Menerima Citra Rontgen', 'Preprocessing Otomatis', 'Resize & Normalisasi Piksel'],
      description: 'Backend menerima unggahan citra rontgen, lalu secara otomatis melakukan preprocessing (resize, ekspansi dimensi, dan normalisasi nilai piksel) agar sesuai dengan kebutuhan model.',
    },
    {
      id: 3,
      title: 'Core AI Engine (Deep Learning CNN)',
      icon: 'psychology',
      color: '#0066cc',
      bg: '#e8f0fb',
      substeps: ['TensorFlow/Keras Model (.h5)', 'Ekstraksi Fitur Morfometri', 'Analisis Struktur Spasial'],
      description: 'Model CNN (.h5) yang telah dilatih mengekstrak fitur morfometri rongga dada secara hierarkis (tepi, tekstur, visual kompleks) untuk mendeteksi tanda kardiomegali.',
    },
    {
      id: 4,
      title: 'Output Hasil',
      icon: 'check_circle',
      color: '#dc2626',
      bg: '#fef2f2',
      substeps: ['Klasifikasi Biner', 'Normal / Kardiomegali', 'Confidence Score (%)'],
      description: 'Hasil klasifikasi biner (Normal / Kardiomegali) beserta confidence score dikembalikan dari backend dan disajikan kembali secara instan ke Frontend.',
    },
  ];

  return (
    <div style={{ ...glass, borderRadius: 16, padding: '28px', overflow: 'hidden' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28, flexWrap: 'wrap', gap: 8 }}>
        <div>
          <h4 style={{ fontFamily: "'Hanken Grotesk', system-ui, sans-serif", fontWeight: 700, fontSize: 17, color: '#202124', marginBottom: 4 }}>
            {t('fc_title')}
          </h4>
          <p style={{ fontSize: 12, color: '#80868B' }}>{t('fc_subtitle')}</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#8e8e93', fontWeight: 600 }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#34c759', display: 'inline-block' }} />
          Sistem Terintegrasi Python & React
        </div>
      </div>

      {/* Stage cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }} className="xl:flex-row xl:items-stretch xl:gap-3">
        {stages.map((stage, index) => {
          const isActive = activeStage === stage.id;
          return (
            <React.Fragment key={stage.id}>
              <div
                onMouseEnter={() => setActiveStage(stage.id)}
                onMouseLeave={() => setActiveStage(null)}
                style={{
                  flex: 1,
                  border: isActive ? `1.5px solid ${stage.color}` : '1.5px solid #DADCE0',
                  borderRadius: 16,
                  padding: '20px',
                  background: isActive ? stage.bg : '#FAFAFA',
                  transition: 'all 0.35s cubic-bezier(0.16,1,0.3,1)',
                  cursor: 'default',
                  transform: isActive ? 'translateY(-2px)' : 'translateY(0)',
                  boxShadow: isActive ? `0 8px 24px rgba(0,0,0,0.07)` : 'none',
                  position: 'relative',
                  zIndex: isActive ? 1 : 0,
                }}
              >
                {/* Step number */}
                <div style={{ fontSize: 10, fontWeight: 800, color: stage.color, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10, opacity: 0.7 }}>
                  {String(index + 1).padStart(2, '0')}
                </div>

                {/* Icon */}
                <div style={{ width: 36, height: 36, background: `${stage.color}14`, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 18, color: stage.color, fontVariationSettings: "'FILL' 1" }}>{stage.icon}</span>
                </div>

                <h5 style={{ fontFamily: "'Hanken Grotesk', system-ui, sans-serif", fontWeight: 700, fontSize: 13, color: '#202124', marginBottom: 10, lineHeight: 1.3 }}>
                  {stage.title}
                </h5>

                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {stage.substeps.slice(0, 2).map((sub, i) => (
                    <li key={i} style={{ fontSize: 11, color: '#5F6368', marginBottom: 5, display: 'flex', alignItems: 'flex-start', gap: 6 }}>
                      <span style={{ color: stage.color, fontSize: 10, marginTop: 2 }}>•</span>
                      <span style={{ lineHeight: 1.4 }}>{sub}</span>
                    </li>
                  ))}
                  {stage.substeps.length > 2 && (
                    <li style={{ fontSize: 10, color: stage.color, fontWeight: 700, paddingLeft: 16 }}>+{stage.substeps.length - 2} {t('fc_more')}</li>
                  )}
                </ul>

                {/* Expanded description */}
                <div style={{
                  overflow: 'hidden',
                  maxHeight: isActive ? 120 : 0,
                  opacity: isActive ? 1 : 0,
                  transition: 'all 0.35s cubic-bezier(0.16,1,0.3,1)',
                  marginTop: isActive ? 14 : 0,
                  paddingTop: isActive ? 14 : 0,
                  borderTop: isActive ? '1px solid rgba(0,0,0,0.06)' : '1px solid transparent',
                }}>
                  <p style={{ fontSize: 11, color: '#3C4043', lineHeight: 1.6, margin: 0 }}>{stage.description}</p>
                </div>
              </div>

              {/* Arrow */}
              {index < stages.length - 1 && (
                <div className="hidden xl:flex" style={{ alignItems: 'center', justifyContent: 'center', width: 24, flexShrink: 0 }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke={isActive ? stages[index].color : '#DADCE0'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
