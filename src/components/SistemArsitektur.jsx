import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import foto1 from '../assets/Foto-Dokumentasi/Foto 1 (1).jpeg';
import foto2 from '../assets/Foto-Dokumentasi/Foto 1 (2).jpeg';
import foto3 from '../assets/Foto-Dokumentasi/Foto 1 (3).jpeg';
import foto4 from '../assets/Foto-Dokumentasi/Foto 1 (4).jpeg';
import ds1 from '../assets/Dataset/Ps1.JPG';
import ds2 from '../assets/Dataset/Ps2.JPG';
import ds3 from '../assets/Dataset/Ps3.JPG';

/* ─── Color helpers ─── */
const C = {
  blue:   { main: '#1A73E8', light: '#E8F0FE', border: '#AECBFA' },
  green:  { main: '#1E8E3E', light: '#E6F4EA', border: '#81C995' },
  purple: { main: '#7C3AED', light: '#F5F3FF', border: '#C4B5FD' },
  amber:  { main: '#B45309', light: '#FEF3C7', border: '#FCD34D' },
  red:    { main: '#DC2626', light: '#FEF2F2', border: '#FECACA' },
  teal:   { main: '#0D9488', light: '#F0FDFA', border: '#99F6E4' },
};

/* ─── Lightbox Modal Component (Portal-based) ─── */
function Lightbox({ src, alt, onClose }) {
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  return createPortal(
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        background: 'rgba(0,0,0,0.92)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'zoom-out',
        padding: 20,
      }}
    >
      <div style={{ position: 'relative', maxWidth: '90vw', maxHeight: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <img
          src={src}
          alt={alt || "Citra Detail"}
          onClick={(e) => e.stopPropagation()}
          style={{
            maxWidth: '100%',
            maxHeight: '85vh',
            borderRadius: 12,
            objectFit: 'contain',
            boxShadow: '0 20px 60px rgba(0,0,0,0.75)',
            display: 'block',
            border: '2px solid rgba(255,255,255,0.1)',
          }}
        />
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: -45,
            right: 0,
            background: 'rgba(255,255,255,0.15)',
            border: '1.5px solid rgba(255,255,255,0.4)',
            borderRadius: '50%',
            width: 36,
            height: 36,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#fff',
            transition: 'background 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.35)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 20 }}>close</span>
        </button>
      </div>
    </div>,
    document.body
  );
}

/* ─── Pipeline Step ─── */
function PipelineStep({ no, icon, title, desc, color = 'blue', last = false }) {
  const c = C[color] ?? C.blue;
  return (
    <div style={{
      display: 'flex', gap: 14, alignItems: 'flex-start',
      padding: '13px 0',
      borderBottom: last ? 'none' : '1px solid #F1F3F4',
    }}>
      <div style={{
        width: 34, height: 34, borderRadius: 9, background: c.light,
        border: `1px solid ${c.border}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        <span className="material-symbols-outlined" style={{ fontSize: 16, color: c.main, fontVariationSettings: "'FILL' 1" }}>{icon}</span>
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
          <span style={{ fontSize: 9, fontWeight: 800, color: c.main, letterSpacing: '0.06em' }}>{no}</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#202124', fontFamily: "'Hanken Grotesk', system-ui" }}>{title}</span>
        </div>
        <p style={{ fontSize: 12.5, color: '#5F6368', margin: 0, lineHeight: 1.65 }}>{desc}</p>
      </div>
    </div>
  );
}

/* ─── Section Card ─── */
function SectionCard({ icon, iconColor, iconBg, title, children }) {
  return (
    <div style={{
      background: '#FFFFFF', border: '1px solid #DADCE0', borderRadius: 16,
      overflow: 'hidden', boxShadow: '0 1px 4px rgba(60,64,67,0.07)',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '16px 22px', borderBottom: '1px solid #F1F3F4',
        background: '#FAFAFA',
      }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span className="material-symbols-outlined" style={{ fontSize: 17, color: iconColor, fontVariationSettings: "'FILL' 1" }}>{icon}</span>
        </div>
        <span style={{ fontSize: 14, fontWeight: 700, color: '#202124', fontFamily: "'Hanken Grotesk', system-ui" }}>{title}</span>
      </div>
      <div style={{ padding: '4px 22px 20px' }}>{children}</div>
    </div>
  );
}

/* ─── Vertical Flowchart ─── */
function FlowchartMetodologi() {
  const steps = [
    {
      id: 'start', type: 'terminal', label: 'Mulai',
      color: '#1E8E3E', bg: '#E6F4EA', border: '#81C995',
      icon: 'play_circle',
    },
    {
      id: 'collect', type: 'process', label: 'Pengumpulan Data',
      color: '#1A73E8', bg: '#E8F0FE', border: '#AECBFA',
      icon: 'database',
      detail: 'Pengambilan citra thorax dari RSJ Tampan Riau & dataset eksternal (Kaggle)',
    },
    {
      id: 'preprocess', type: 'process', label: 'Preprocessing Data',
      color: '#0D9488', bg: '#F0FDFA', border: '#99F6E4',
      icon: 'tune',
      subs: ['Resize citra ke 256×256 piksel', 'Standardisasi kontras (CLAHE)', 'Konversi Grayscale ke RGB'],
    },
    {
      id: 'imbalance', type: 'process', label: 'Penanganan Imbalanced Data',
      color: '#B45309', bg: '#FEF3C7', border: '#FCD34D',
      icon: 'balance',
      detail: 'Double Protection: Class Weighting (loss function) & Oversampling kelas Kardiomegali',
    },
    {
      id: 'train', type: 'process', label: 'Pelatihan Model (Two-Phase)',
      color: '#7C3AED', bg: '#F5F3FF', border: '#C4B5FD',
      icon: 'model_training',
      subs: [
        'Fase A — Warm-Up: hanya lapisan Dense/Head (15 epoch, LR 1e-3)',
        'Fase B — Full Fine-Tuning: seluruh lapisan DenseNet121 (50 epoch, LR 1e-5)',
      ],
    },
    {
      id: 'eval', type: 'process', label: 'Evaluasi Model',
      color: '#DC2626', bg: '#FEF2F2', border: '#FECACA',
      icon: 'analytics',
      detail: 'Pengujian data validasi: Accuracy, Precision, Recall, F1-Score, ROC-AUC & Confusion Matrix',
    },
    {
      id: 'integrate', type: 'process', label: 'Integrasi Sistem',
      color: '#1A73E8', bg: '#E8F0FE', border: '#AECBFA',
      icon: 'integration_instructions',
      detail: 'Pengemasan model ke dalam Backend Flask (API) & Frontend Web (React)',
    },
    {
      id: 'end', type: 'terminal', label: 'Selesai',
      color: '#1E8E3E', bg: '#E6F4EA', border: '#81C995',
      icon: 'check_circle',
    },
  ];

  return (
    <div style={{
      background: '#FFFFFF', border: '1px solid #DADCE0', borderRadius: 16,
      overflow: 'hidden', boxShadow: '0 1px 4px rgba(60,64,67,0.07)',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '16px 22px', borderBottom: '1px solid #F1F3F4', background: '#FAFAFA',
      }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: '#E8F0FE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span className="material-symbols-outlined" style={{ fontSize: 17, color: '#1A73E8', fontVariationSettings: "'FILL' 1" }}>account_tree</span>
        </div>
        <div>
          <span style={{ fontSize: 14, fontWeight: 700, color: '#202124', fontFamily: "'Hanken Grotesk', system-ui", display: 'block' }}>
            Flowchart Metodologi Pengembangan
          </span>
          <span style={{ fontSize: 11, color: '#80868B' }}>Alur teknis pembangunan model dari awal hingga siap digunakan</span>
        </div>
      </div>

      {/* Flowchart body */}
      <div style={{ padding: '28px 32px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
        {steps.map((step, i) => (
          <div key={step.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: 560 }}>
            {/* Node */}
            <div style={{
              width: '100%',
              border: `1.5px solid ${step.border}`,
              borderRadius: step.type === 'terminal' ? 9999 : 12,
              background: step.bg,
              padding: step.type === 'terminal' ? '10px 24px' : '14px 18px',
              display: 'flex', flexDirection: 'column', alignItems: step.type === 'terminal' ? 'center' : 'flex-start',
              position: 'relative',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', justifyContent: step.type === 'terminal' ? 'center' : 'flex-start' }}>
                <div style={{
                  width: 30, height: 30, borderRadius: 8, background: step.color + '20',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 16, color: step.color, fontVariationSettings: "'FILL' 1" }}>{step.icon}</span>
                </div>
                <span style={{
                  fontSize: step.type === 'terminal' ? 13 : 13.5,
                  fontWeight: 800, color: step.color,
                  fontFamily: "'Hanken Grotesk', system-ui",
                }}>{step.label}</span>
                {/* Step number badge */}
                {step.type !== 'terminal' && (
                  <span style={{
                    marginLeft: 'auto', fontSize: 9, fontWeight: 800,
                    color: step.color, background: step.color + '15',
                    border: `1px solid ${step.border}`,
                    borderRadius: 9999, padding: '2px 7px',
                    letterSpacing: '0.06em',
                  }}>{String(i).padStart(2, '0')}</span>
                )}
              </div>
              {/* Detail text */}
              {step.detail && (
                <p style={{ fontSize: 11.5, color: '#5F6368', margin: '8px 0 0 40px', lineHeight: 1.6 }}>{step.detail}</p>
              )}
              {/* Sub-steps */}
              {step.subs && (
                <ul style={{ margin: '8px 0 0 40px', padding: 0, listStyle: 'none' }}>
                  {step.subs.map((s, si) => (
                    <li key={si} style={{ display: 'flex', alignItems: 'flex-start', gap: 6, marginBottom: 4 }}>
                      <span style={{ width: 5, height: 5, borderRadius: '50%', background: step.color, marginTop: 5, flexShrink: 0 }} />
                      <span style={{ fontSize: 11.5, color: '#5F6368', lineHeight: 1.6 }}>{s}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Arrow connector */}
            {i < steps.length - 1 && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '0', padding: '2px 0' }}>
                <div style={{ width: 2, height: 18, background: 'linear-gradient(to bottom, #DADCE0, #AECBFA)' }} />
                <svg width="14" height="8" viewBox="0 0 14 8" style={{ display: 'block' }}>
                  <path d="M7 8 L0 0 L14 0 Z" fill="#AECBFA" />
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Contoh Dataset ─── */
function ContohDataset() {
  const [lightbox, setLightbox] = useState(null);

  const samples = [
    {
      src: ds1,
      id: 'Citra Thorax 01',
      source: 'RSJ Tampan Riau',
    },
    {
      src: ds2,
      id: 'Citra Thorax 02',
      source: 'RSJ Tampan Riau',
    },
    {
      src: ds3,
      id: 'Citra Thorax 03',
      source: 'RSJ Tampan Riau',
    },
  ];

  return (
    <div style={{
      background: '#FFFFFF', border: '1px solid #DADCE0', borderRadius: 16,
      overflow: 'hidden', boxShadow: '0 1px 4px rgba(60,64,67,0.07)',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '16px 22px', borderBottom: '1px solid #F1F3F4', background: '#FAFAFA',
      }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: '#F5F3FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span className="material-symbols-outlined" style={{ fontSize: 17, color: '#7C3AED', fontVariationSettings: "'FILL' 1" }}>radiology</span>
        </div>
        <div>
          <span style={{ fontSize: 14, fontWeight: 700, color: '#202124', fontFamily: "'Hanken Grotesk', system-ui", display: 'block' }}>
            Contoh Citra Dataset
          </span>
          <span style={{ fontSize: 11, color: '#80868B' }}>Sampel citra rontgen thorax anonim yang digunakan dalam pelatihan model</span>
        </div>
      </div>

      {/* Grid */}
      <div style={{ padding: '20px 22px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 20 }}>
          {samples.map((s, idx) => (
            <div key={idx} style={{
              borderRadius: 14,
              border: '1px solid #DADCE0',
              overflow: 'hidden',
              background: '#FFFFFF',
              boxShadow: '0 2px 8px rgba(60,64,67,0.06)',
              display: 'flex',
              flexDirection: 'column',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(60,64,67,0.12)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(60,64,67,0.06)';
              }}
            >
              {/* DICOM Viewer Box */}
              <div style={{
                position: 'relative',
                aspectRatio: '3/4',
                cursor: 'zoom-in',
                overflow: 'hidden',
                background: '#090A0F', // Dark clinical background
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
                onClick={() => setLightbox(s.src)}
              >
                {/* Simulated DICOM Grid Background */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundImage: 'radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px)',
                  backgroundSize: '16px 16px',
                  pointerEvents: 'none',
                }} />

                {/* Corner Crosshairs */}
                <div style={{ position: 'absolute', top: 12, left: 12, width: 8, height: 8, borderLeft: '1px solid rgba(255,255,255,0.3)', borderTop: '1px solid rgba(255,255,255,0.3)', pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', top: 12, right: 12, width: 8, height: 8, borderRight: '1px solid rgba(255,255,255,0.3)', borderTop: '1px solid rgba(255,255,255,0.3)', pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', bottom: 12, left: 12, width: 8, height: 8, borderLeft: '1px solid rgba(255,255,255,0.3)', borderBottom: '1px solid rgba(255,255,255,0.3)', pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', bottom: 12, right: 12, width: 8, height: 8, borderRight: '1px solid rgba(255,255,255,0.3)', borderBottom: '1px solid rgba(255,255,255,0.3)', pointerEvents: 'none' }} />

                {/* DICOM Corner Text Overlay (Monospace info) */}
                <div style={{
                  position: 'absolute',
                  top: 10,
                  left: 12,
                  fontFamily: 'monospace',
                  fontSize: 8,
                  color: 'rgba(255,255,255,0.45)',
                  lineHeight: 1.3,
                  pointerEvents: 'none',
                  textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
                }}>
                  {s.id}<br />
                  F: CXR PA<br />
                  W/L: 256/128
                </div>

                <div style={{
                  position: 'absolute',
                  top: 10,
                  right: 12,
                  fontFamily: 'monospace',
                  fontSize: 10,
                  fontWeight: 'bold',
                  color: 'rgba(255,255,255,0.3)',
                  pointerEvents: 'none',
                  textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
                }}>
                  R
                </div>

                {/* Actual X-Ray Image (untruncated contain mode) */}
                <img
                  src={s.src}
                  alt={`Citra rontgen - ${s.id}`}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    display: 'block',
                    transition: 'opacity 0.2s',
                    opacity: 0.9,
                  }}
                />

                {/* Medical Graticule lines / Calibration rulers on the right side */}
                <div style={{
                  position: 'absolute',
                  right: 4,
                  top: '25%',
                  bottom: '25%',
                  width: 4,
                  borderRight: '1px solid rgba(255,255,255,0.25)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  pointerEvents: 'none',
                }}>
                  {[...Array(6)].map((_, i) => (
                    <div key={i} style={{ width: 4, height: 1, background: 'rgba(255,255,255,0.3)' }} />
                  ))}
                </div>

                {/* Zoom Icon Overlay (Lower Right) */}
                <div style={{
                  position: 'absolute',
                  bottom: 10,
                  right: 10,
                  width: 24,
                  height: 24,
                  borderRadius: 6,
                  background: 'rgba(255,255,255,0.15)',
                  border: '1px solid rgba(255,255,255,0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backdropFilter: 'blur(4px)',
                }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 13, color: '#fff' }}>zoom_in</span>
                </div>
              </div>

              {/* Meta Panel (Under the X-Ray) */}
              <div style={{ padding: '12px 14px', background: '#FAFAFA', borderTop: '1px solid #F1F3F4' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#202124', fontFamily: "'Hanken Grotesk', system-ui" }}>{s.id}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 12, color: '#80868B' }}>location_on</span>
                  <span style={{ fontSize: 11, color: '#80868B', fontWeight: 500 }}>{s.source}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Info bar */}
        <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 10 }}>
          {[
            { icon: 'straighten', label: 'Resolusi', value: '256 × 256 px', color: '#7C3AED' },
            { icon: 'call_split', label: 'Pembagian Data', value: '80% Train / 20% Validasi', color: '#1A73E8' },
            { icon: 'monitor_heart', label: 'Threshold CTR', value: '> 0.50 = Kardiomegali', color: '#DC2626' },
            { icon: 'layers', label: 'Format', value: 'JPEG / JPG · Grayscale → RGB', color: '#0D9488' },
          ].map(chip => (
            <div key={chip.label} style={{ display: 'flex', gap: 8, alignItems: 'center', background: '#F8F9FA', border: '1px solid #DADCE0', borderRadius: 8, padding: '8px 10px' }}>
              <span className="material-symbols-outlined" style={{ fontSize: 14, color: chip.color, fontVariationSettings: "'FILL' 1" }}>{chip.icon}</span>
              <div>
                <p style={{ fontSize: 9.5, fontWeight: 700, color: '#80868B', margin: 0, textTransform: 'uppercase', letterSpacing: '0.07em' }}>{chip.label}</p>
                <p style={{ fontSize: 11, fontWeight: 600, color: '#202124', margin: 0 }}>{chip.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <Lightbox src={lightbox} alt="Citra Rontgen Dataset" onClose={() => setLightbox(null)} />
      )}
    </div>
  );
}

/* ─── Documentation Gallery ─── */

function DocumentasiGaleri() {
  const [lightbox, setLightbox] = useState(null);

  const photos = [
    { src: foto1, caption: 'Koordinasi dengan staf RSJ Tampan Riau' },
    { src: foto2, caption: 'Kunjungan ke lokasi RSJ Tampan Riau' },
    { src: foto3, caption: 'Diskusi dengan petugas radiologi' },
    { src: foto4, caption: 'Tim bersama petugas unit radiologi' },
  ];

  return (
    <div style={{
      background: '#FFFFFF', border: '1px solid #DADCE0', borderRadius: 16,
      overflow: 'hidden', boxShadow: '0 1px 4px rgba(60,64,67,0.07)',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '16px 22px', borderBottom: '1px solid #F1F3F4', background: '#FAFAFA',
      }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span className="material-symbols-outlined" style={{ fontSize: 17, color: '#B45309', fontVariationSettings: "'FILL' 1" }}>photo_library</span>
        </div>
        <div>
          <span style={{ fontSize: 14, fontWeight: 700, color: '#202124', fontFamily: "'Hanken Grotesk', system-ui", display: 'block' }}>
            Dokumentasi Pengumpulan Data
          </span>
          <span style={{ fontSize: 11, color: '#80868B' }}>Kunjungan langsung ke RSJ Tampan Riau untuk pengambilan data citra thorax</span>
        </div>
        <span style={{
          marginLeft: 'auto', fontSize: 10, fontWeight: 700, color: '#1E8E3E',
          background: '#E6F4EA', border: '1px solid #81C995',
          borderRadius: 9999, padding: '2px 8px', textTransform: 'uppercase', letterSpacing: '0.07em',
        }}>4 Foto</span>
      </div>

      {/* Grid */}
      <div style={{ padding: '20px 22px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
          {photos.map((photo, idx) => (
            <div key={idx} style={{ position: 'relative', borderRadius: 12, overflow: 'hidden', border: '1px solid #DADCE0', aspectRatio: '4/3', background: '#F8F9FA', cursor: 'zoom-in' }}
              onClick={() => setLightbox(photo.src)}
              className="pp-hover-lift"
            >
              <img
                src={photo.src}
                alt={photo.caption}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.35s ease' }}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.04)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
              />
              {/* Caption overlay */}
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.68), transparent)',
                padding: '24px 12px 10px',
              }}>
                <p style={{ fontSize: 11.5, fontWeight: 600, color: '#fff', margin: 0, lineHeight: 1.4 }}>{photo.caption}</p>
              </div>
              {/* Zoom hint */}
              <div style={{
                position: 'absolute', top: 8, right: 8,
                width: 26, height: 26, borderRadius: '50%',
                background: 'rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: 14, color: '#fff' }}>zoom_in</span>
              </div>
            </div>
          ))}
        </div>

        {/* Source note */}
        <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', background: '#F8F9FA', borderRadius: 8, border: '1px solid #DADCE0' }}>
          <span className="material-symbols-outlined" style={{ fontSize: 14, color: '#1A73E8', fontVariationSettings: "'FILL' 1" }}>location_on</span>
          <p style={{ fontSize: 11.5, color: '#5F6368', margin: 0 }}>
            <strong style={{ color: '#202124' }}>Sumber Data Primer:</strong> Citra rontgen thorax diperoleh langsung dari Unit Radiologi RSJ Prof. Dr. M. Ildrem (RSJ Tampan) Riau atas izin resmi pihak rumah sakit.
          </p>
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <Lightbox src={lightbox} alt="Dokumentasi Pengumpulan Data" onClose={() => setLightbox(null)} />
      )}
    </div>
  );
}

/* ════════════════════════════════════════════
   MAIN EXPORT
   ════════════════════════════════════════════ */
export default function SistemArsitektur() {
  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif", display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Overview Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #E8F0FE 0%, #F5F3FF 100%)',
        border: '1px solid #AECBFA', borderRadius: 16, padding: '20px 24px',
        display: 'flex', gap: 16, alignItems: 'flex-start',
      }}>
        <div style={{
          width: 44, height: 44, borderRadius: 12, background: '#1A73E8',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <span className="material-symbols-outlined" style={{ fontSize: 22, color: '#fff', fontVariationSettings: "'FILL' 1" }}>model_training</span>
        </div>
        <div>
          <p style={{ fontSize: 11, fontWeight: 700, color: '#1558B0', margin: '0 0 6px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Deep Convolutional Neural Network
          </p>
          <p style={{ fontSize: 13.5, color: '#3C4043', lineHeight: 1.72, margin: 0 }}>
            Sistem menggunakan arsitektur <strong>DenseNet121</strong> dengan metode <strong>Transfer Learning</strong> &amp; Full Fine-Tuning,
            dilengkapi augmentasi medis dinamis dan strategi <strong>Double Protection</strong> untuk mengatasi imbalanced data —
            memastikan model mampu menggeneralisasi kondisi klinis tanpa overfitting.
          </p>
        </div>
      </div>

      {/* Row 1: Pipeline + Model Architecture */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>

        <SectionCard icon="dataset" iconColor="#1A73E8" iconBg="#E8F0FE" title="Pipeline Persiapan Data">
          <PipelineStep no="01" icon="cleaning_services" color="blue" title="Pembersihan &amp; Sinkronisasi Metadata"
            desc="Metadata CSV disinkronisasi dengan file fisik di Google Drive. File liar otomatis dihapus, label dikunci sebagai integer (0 = Normal, 1 = Kardiomegali)." />
          <PipelineStep no="02" icon="photo_size_select_large" color="teal" title="Resize 256×256 px — cv2.INTER_AREA"
            desc="Interpolasi INTER_AREA menjaga ketajaman batas siluet jantung (CTR) tanpa blur saat downscaling dari berbagai mesin rontgen." />
          <PipelineStep no="03" icon="contrast" color="blue" title="Standardisasi Kontras — CLAHE"
            desc="clipLimit=2.0, tileGridSize=(8,8) — meratakan histogram lokal agar batas anatomi jantung dan paru-paru tampil tegas." />
          <PipelineStep no="04" icon="palette" color="purple" title="Konversi Grayscale ke RGB"
            desc="Kanal tunggal rontgen diduplikasi menjadi 3 kanal agar kompatibel dengan pretrained weights ImageNet pada DenseNet121." />
          <PipelineStep no="05" icon="call_split" color="green" title="Stratified Split 80:20"
            desc="random_state=42 menjamin rasio kelas Normal:Kardiomegali proporsional di set train dan validasi." last={true} />
          <div style={{ paddingTop: 12 }}>
            <div style={{ background: '#FEF3C7', border: '1px solid #FCD34D', borderRadius: 8, padding: '9px 12px' }}>
              <p style={{ fontSize: 12, color: '#92400E', margin: 0 }}>
                <strong>Double Protection:</strong> Oversampling kelas Kardiomegali + Class Weighting pada loss function
                (Kardiomegali ~1.480, Normal ~0.755) untuk mencegah bias pada kelas mayoritas.
              </p>
            </div>
          </div>
        </SectionCard>

        <SectionCard icon="hub" iconColor="#7C3AED" iconBg="#F5F3FF" title="Arsitektur Model DenseNet121">
          <div style={{ paddingTop: 14 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#7C3AED', textTransform: 'uppercase', letterSpacing: '0.07em', margin: '0 0 8px' }}>
              Augmentasi Medis Dinamis
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 18 }}>
              {[
                ['RandomBrightness ±15%', false],
                ['RandomContrast ±20%', false],
                ['RandomRotation ~5°', false],
                ['RandomTranslation ±5%', false],
                ['❌ No Horizontal Flip', true],
              ].map(([t, isRed]) => (
                <span key={t} style={{
                  fontSize: 11, padding: '3px 10px', borderRadius: 9999,
                  background: isRed ? '#FEF2F2' : '#F5F3FF',
                  border: `1px solid ${isRed ? '#FECACA' : '#C4B5FD'}`,
                  color: isRed ? '#DC2626' : '#7C3AED', fontWeight: 600,
                }}>{t}</span>
              ))}
            </div>

            <p style={{ fontSize: 11, fontWeight: 700, color: '#1A73E8', textTransform: 'uppercase', letterSpacing: '0.07em', margin: '0 0 8px' }}>
              Susunan Lapisan (Keras Functional API)
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 18 }}>
              {[
                { label: 'DenseNet121 Backbone', sub: 'weights=ImageNet · include_top=False · trainable=True', color: '#1A73E8', bg: '#E8F0FE' },
                { label: 'GlobalAveragePooling2D', sub: 'Merangkum fitur, mencegah overfitting', color: '#0D9488', bg: '#F0FDFA' },
                { label: 'Dense 128 · ReLU · L2 · Dropout 0.4', sub: 'Regularisasi + seleksi fitur penting', color: '#7C3AED', bg: '#F5F3FF' },
                { label: 'Dense 64 · ReLU · Dropout 0.3', sub: 'Penyaringan ulang sebelum keputusan akhir', color: '#7C3AED', bg: '#F5F3FF' },
                { label: 'Output: 2 Neuron · Softmax', sub: 'Normal / Kardiomegali + Grad-CAM ready', color: '#1E8E3E', bg: '#E6F4EA' },
              ].map((l, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                  <div style={{ width: 3, alignSelf: 'stretch', background: l.color, borderRadius: 4, flexShrink: 0 }} />
                  <div style={{ background: l.bg, borderRadius: 7, padding: '7px 10px', flex: 1 }}>
                    <p style={{ fontSize: 11.5, fontWeight: 700, color: l.color, margin: '0 0 1px' }}>{l.label}</p>
                    <p style={{ fontSize: 11, color: '#5F6368', margin: 0 }}>{l.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            <p style={{ fontSize: 11, fontWeight: 700, color: '#1E8E3E', textTransform: 'uppercase', letterSpacing: '0.07em', margin: '0 0 8px' }}>
              Pelatihan — Progressive Unfreezing
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {[
                { phase: 'Fase A — Warm-Up', desc: '15 epoch · DenseNet freeze · LR 1e-3', color: '#1E8E3E', bg: '#E6F4EA', border: '#81C995' },
                { phase: 'Fase B — Fine-Tuning', desc: '50 epoch · Full unfreeze · LR 1e-5', color: '#1A73E8', bg: '#E8F0FE', border: '#AECBFA' },
              ].map(p => (
                <div key={p.phase} style={{ background: p.bg, border: `1px solid ${p.border}`, borderRadius: 8, padding: '10px' }}>
                  <p style={{ fontSize: 11.5, fontWeight: 800, color: p.color, margin: '0 0 3px' }}>{p.phase}</p>
                  <p style={{ fontSize: 11, color: '#3C4043', margin: 0, lineHeight: 1.5 }}>{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </SectionCard>

      </div>

      {/* Row 2: Testing + Integration */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>

        <SectionCard icon="analytics" iconColor="#B45309" iconBg="#FEF3C7" title="Pengujian &amp; Evaluasi Model">
          <div style={{ paddingTop: 14, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              {
                icon: 'fact_check', color: 'blue', title: 'Evaluasi Validation Set',
                desc: 'Accuracy, Precision, Recall, F1-Score, ROC-AUC, dan Confusion Matrix. Interpretasi otomatis mendeteksi False Negative & False Positive dengan standar minimum 85%.',
              },
              {
                icon: 'upload', color: 'purple', title: 'Uji Prediksi Manual',
                desc: 'Upload foto rontgen langsung di Google Colab. Label hijau (Normal) atau merah (Kardiomegali) tampil beserta confidence score secara instan.',
              },
              {
                icon: 'heat_map', color: 'red', title: 'Grad-CAM — Explainable AI',
                desc: 'Heatmap merah/kuning menandai area jantung yang memengaruhi keputusan model. Tampilan 3 panel: Asli · Heatmap · Overlay — membantu dokter memvalidasi hasil secara klinis.',
              },
            ].map((item, idx, arr) => {
              const c = C[item.color] ?? C.blue;
              return (
                <div key={item.title} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '10px 0', borderBottom: idx < arr.length - 1 ? '1px solid #F1F3F4' : 'none' }}>
                  <div style={{ width: 30, height: 30, borderRadius: 8, background: c.light, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 15, color: c.main, fontVariationSettings: "'FILL' 1" }}>{item.icon}</span>
                  </div>
                  <div>
                    <p style={{ fontSize: 12.5, fontWeight: 700, color: '#202124', margin: '0 0 3px', fontFamily: "'Hanken Grotesk', system-ui" }}>{item.title}</p>
                    <p style={{ fontSize: 12, color: '#5F6368', margin: 0, lineHeight: 1.6 }}>{item.desc}</p>
                  </div>
                </div>
              );
            })}
            <div style={{ background: '#F0FDFA', border: '1px solid #99F6E4', borderRadius: 8, padding: '9px 12px' }}>
              <p style={{ fontSize: 12, color: '#0D9488', margin: 0 }}>
                <strong>Auto-Recovery:</strong> Model dimuat dari RAM Colab jika tersedia, atau otomatis dari file cnn_kardiomegali_256px.keras di Google Drive.
              </p>
            </div>
          </div>
        </SectionCard>

        <SectionCard icon="integration_instructions" iconColor="#1E8E3E" iconBg="#E6F4EA" title="Integrasi Backend &amp; Frontend">
          <div style={{ paddingTop: 14, display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ border: '1px solid #81C995', borderRadius: 10, overflow: 'hidden' }}>
              <div style={{ background: '#1E8E3E', padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 14, color: '#fff', fontVariationSettings: "'FILL' 1" }}>terminal</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>Backend — Flask REST API · Python 3.11</span>
              </div>
              <div style={{ padding: '10px 12px', background: '#F0FDF4' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
                  {['Flask ≥3.0', 'TensorFlow ≥2.16', 'OpenCV ≥4.9', 'Docker', 'Gunicorn'].map(t => (
                    <span key={t} style={{ fontSize: 10.5, padding: '2px 8px', borderRadius: 9999, background: '#E6F4EA', border: '1px solid #81C995', color: '#1E8E3E', fontWeight: 600 }}>{t}</span>
                  ))}
                </div>
                <p style={{ fontSize: 11.5, color: '#3C4043', margin: '0 0 3px' }}>
                  <code style={{ fontSize: 10.5, background: '#fff', padding: '1px 5px', borderRadius: 4 }}>POST /api/v1/scan-thorax</code> — Analisis citra rontgen
                </p>
                <p style={{ fontSize: 11.5, color: '#3C4043', margin: 0 }}>
                  <code style={{ fontSize: 10.5, background: '#fff', padding: '1px 5px', borderRadius: 4 }}>GET /api/v1/model-info</code> — Info model aktif
                </p>
              </div>
            </div>
            <div style={{ border: '1px solid #C4B5FD', borderRadius: 10, overflow: 'hidden' }}>
              <div style={{ background: '#7C3AED', padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 14, color: '#fff', fontVariationSettings: "'FILL' 1" }}>web</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>Frontend — React 19 + Vite 8 · Vercel</span>
              </div>
              <div style={{ padding: '10px 12px', background: '#F5F3FF' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
                  {['TailwindCSS 4', 'Supabase JS 2', 'Axios 1.17', 'Vite Build'].map(t => (
                    <span key={t} style={{ fontSize: 10.5, padding: '2px 8px', borderRadius: 9999, background: '#F5F3FF', border: '1px solid #C4B5FD', color: '#7C3AED', fontWeight: 600 }}>{t}</span>
                  ))}
                </div>
                <p style={{ fontSize: 11.5, color: '#3C4043', margin: 0 }}>
                  Supabase menyimpan log klasifikasi (classification_logs) &amp; hasil scan (scan_results) secara persisten.
                </p>
              </div>
            </div>
            <div style={{ background: '#F8F9FA', borderRadius: 8, padding: '10px 12px', border: '1px solid #DADCE0' }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: '#80868B', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 8px' }}>Alur End-to-End</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
                {[
                  { l: 'Upload X-Ray', ic: 'upload', c: '#7C3AED' },
                  { l: 'API Backend', ic: 'send', c: '#1A73E8' },
                  { l: 'Preprocessing', ic: 'tune', c: '#0D9488' },
                  { l: 'DenseNet121', ic: 'psychology', c: '#1E8E3E' },
                  { l: 'Grad-CAM + Hasil', ic: 'heat_map', c: '#DC2626' },
                ].map((s, i, arr) => (
                  <React.Fragment key={i}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: '#fff', border: `1px solid ${s.c}28`, borderRadius: 6, padding: '4px 8px' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 12, color: s.c, fontVariationSettings: "'FILL' 1" }}>{s.ic}</span>
                      <span style={{ fontSize: 11, fontWeight: 600, color: '#202124' }}>{s.l}</span>
                    </div>
                    {i < arr.length - 1 && (
                      <span className="material-symbols-outlined" style={{ fontSize: 14, color: '#DADCE0' }}>chevron_right</span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </SectionCard>

      </div>

      {/* Flowchart Metodologi */}
      <FlowchartMetodologi />

      {/* Contoh Dataset */}
      <ContohDataset />

      {/* Galeri Dokumentasi */}
      <DocumentasiGaleri />

    </div>
  );
}
