import React, { useState, useRef, useCallback } from 'react';

/* ─── Color helpers ─── */
const C = {
  blue:   { main: '#1A73E8', light: '#E8F0FE', border: '#AECBFA' },
  green:  { main: '#1E8E3E', light: '#E6F4EA', border: '#81C995' },
  purple: { main: '#7C3AED', light: '#F5F3FF', border: '#C4B5FD' },
  amber:  { main: '#B45309', light: '#FEF3C7', border: '#FCD34D' },
  red:    { main: '#DC2626', light: '#FEF2F2', border: '#FECACA' },
  teal:   { main: '#0D9488', light: '#F0FDFA', border: '#99F6E4' },
};

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
        <div style={{
          width: 32, height: 32, borderRadius: 8, background: iconBg,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <span className="material-symbols-outlined" style={{ fontSize: 17, color: iconColor, fontVariationSettings: "'FILL' 1" }}>{icon}</span>
        </div>
        <span style={{ fontSize: 14, fontWeight: 700, color: '#202124', fontFamily: "'Hanken Grotesk', system-ui" }}>{title}</span>
      </div>
      <div style={{ padding: '4px 22px 20px' }}>{children}</div>
    </div>
  );
}

function FlowchartUpload() {
  const [imgSrc, setImgSrc] = useState(null);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef(null);

  const handleFile = useCallback((file) => {
    if (!file || !file.type.startsWith('image/')) return;
    const url = URL.createObjectURL(file);
    setImgSrc(prev => { if (prev) URL.revokeObjectURL(prev); return url; });
  }, []);

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files?.[0]);
  }, [handleFile]);

  return (
    <div style={{
      background: '#FFFFFF', border: '1px solid #DADCE0', borderRadius: 16,
      overflow: 'hidden', boxShadow: '0 1px 4px rgba(60,64,67,0.07)',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '16px 22px', borderBottom: '1px solid #F1F3F4', background: '#FAFAFA',
      }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: '#F5F3FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span className="material-symbols-outlined" style={{ fontSize: 17, color: '#7C3AED', fontVariationSettings: "'FILL' 1" }}>schema</span>
        </div>
        <span style={{ fontSize: 14, fontWeight: 700, color: '#202124', fontFamily: "'Hanken Grotesk', system-ui" }}>
          Diagram Alur Sistem (Flowchart)
        </span>
        <span style={{
          marginLeft: 'auto', fontSize: 10, fontWeight: 700, color: '#7C3AED',
          background: '#F5F3FF', border: '1px solid #C4B5FD',
          borderRadius: 9999, padding: '2px 8px', textTransform: 'uppercase', letterSpacing: '0.07em',
        }}>PNG / JPG</span>
      </div>
      <div style={{ padding: '20px 22px' }}>
        {imgSrc ? (
          <div style={{ position: 'relative', borderRadius: 12, overflow: 'hidden', border: '1px solid #C4B5FD' }}>
            <img src={imgSrc} alt="Flowchart Sistem Kardiomegali"
              style={{ width: '100%', height: 'auto', display: 'block', maxHeight: 900, objectFit: 'contain', background: '#F5F3FF' }} />
            <button
              onClick={() => { URL.revokeObjectURL(imgSrc); setImgSrc(null); }}
              style={{
                position: 'absolute', top: 10, right: 10,
                background: 'rgba(255,255,255,0.96)', border: '1px solid #DADCE0',
                borderRadius: 7, padding: '5px 10px', cursor: 'pointer',
                fontSize: 11, fontWeight: 600, color: '#5F6368',
                display: 'flex', alignItems: 'center', gap: 4,
              }}>
              <span className="material-symbols-outlined" style={{ fontSize: 13 }}>close</span>
              Hapus
            </button>
          </div>
        ) : (
          <div
            onDragOver={e => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            onClick={() => inputRef.current?.click()}
            style={{
              border: `2px dashed ${dragging ? '#7C3AED' : '#C4B5FD'}`,
              borderRadius: 12, padding: '40px 20px', textAlign: 'center',
              background: dragging ? '#F5F3FF' : '#FAFAFF',
              cursor: 'pointer', transition: 'all 0.2s',
            }}>
            <div style={{
              width: 48, height: 48, borderRadius: 12, background: '#F5F3FF',
              border: '1.5px solid #C4B5FD',
              display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px',
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: 24, color: '#7C3AED' }}>upload_file</span>
            </div>
            <p style={{ fontSize: 14, fontWeight: 700, color: '#202124', margin: '0 0 6px', fontFamily: "'Hanken Grotesk', system-ui" }}>
              Unggah Flowchart Sistem
            </p>
            <p style={{ fontSize: 12, color: '#80868B', margin: '0 0 14px', lineHeight: 1.6 }}>
              Seret &amp; lepas, atau klik untuk pilih file
            </p>
            <span style={{
              fontSize: 10, fontWeight: 700, color: '#7C3AED',
              background: '#F5F3FF', border: '1px solid #C4B5FD',
              borderRadius: 9999, padding: '3px 10px',
            }}>PNG · JPG · JPEG</span>
            <input ref={inputRef} type="file" accept="image/png,image/jpeg,image/jpg"
              onChange={e => handleFile(e.target.files?.[0])} style={{ display: 'none' }} />
          </div>
        )}
      </div>
    </div>
  );
}

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

      {/* Flowchart Upload */}
      <FlowchartUpload />

    </div>
  );
}
