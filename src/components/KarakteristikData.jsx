import React from 'react';
import { useTranslation } from '../lib/TranslationContext';

const glass = {
  background: '#FFFFFF',
  border: '1px solid #DADCE0',
  borderRadius: 16,
  boxShadow: '0 1px 4px rgba(60,64,67,0.08)',
};

export default function KarakteristikData() {
  const { t } = useTranslation();

  const categoryConfig = [
    {
      title: t('kd0_title'),
      badge: t('kd_label0'),
      accent: '#1E8E3E', bgAccent: '#E6F4EA', borderAccent: '#A8D5B5',
      iconBg: '#E6F4EA', iconColor: '#1E8E3E', icon: 'check_circle',
      characteristics: [t('kd0_c1'), t('kd0_c2'), t('kd0_c3'), t('kd0_c4'), t('kd0_c5')],
      details: [
        { label: t('kd_detail_ctr'),    value: t('kd0_d1') },
        { label: t('kd_detail_label'),  value: t('kd0_d2') },
        { label: t('kd_detail_risk'),   value: t('kd0_d3') },
        { label: t('kd_detail_action'), value: t('kd0_d4') },
      ],
    },
    {
      title: t('kd1_title'),
      badge: t('kd_label1'),
      accent: '#D93025', bgAccent: '#FCE8E6', borderAccent: '#F5C6C3',
      iconBg: '#FCE8E6', iconColor: '#D93025', icon: 'report',
      characteristics: [t('kd1_c1'), t('kd1_c2'), t('kd1_c3'), t('kd1_c4'), t('kd1_c5')],
      details: [
        { label: t('kd_detail_ctr'),    value: t('kd1_d1') },
        { label: t('kd_detail_label'),  value: t('kd1_d2') },
        { label: t('kd_detail_risk'),   value: t('kd1_d3') },
        { label: t('kd_detail_action'), value: t('kd1_d4') },
      ],
    },
    {
      title: t('kd2_title'),
      badge: t('kd_label_data'),
      accent: '#1A73E8', bgAccent: '#E8F0FE', borderAccent: '#AECBFA',
      iconBg: '#E8F0FE', iconColor: '#1A73E8', icon: 'database',
      characteristics: [t('kd2_c1'), t('kd2_c2'), t('kd2_c3'), t('kd2_c4'), t('kd2_c5')],
      details: [
        { label: t('kd_detail_label'),  value: t('kd2_d1') },
        { label: t('kd_detail_feat'),   value: t('kd2_d2') },
        { label: t('kd_detail_acc'),    value: t('kd2_d3') },
        { label: t('kd_detail_source'), value: t('kd2_d4') },
      ],
    },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
      {categoryConfig.map((cat) => (
        <div
          key={cat.title}
          style={{
            ...glass,
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            transition: 'transform 0.3s cubic-bezier(0.16,1,0.3,1), box-shadow 0.3s cubic-bezier(0.16,1,0.3,1)',
            position: 'relative',
            overflow: 'hidden',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(60,64,67,0.12)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 1px 4px rgba(60,64,67,0.08)';
          }}
        >
          {/* Top accent bar */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 3,
            background: cat.accent, borderRadius: '16px 16px 0 0',
          }} />

          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16, marginTop: 8 }}>
            <div style={{
              width: 44, height: 44, background: cat.iconBg,
              borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: 22, color: cat.iconColor, fontVariationSettings: "'FILL' 1" }}>
                {cat.icon}
              </span>
            </div>
            <span style={{
              padding: '4px 12px',
              background: cat.bgAccent, border: `1px solid ${cat.borderAccent}`,
              borderRadius: 9999, fontSize: 10, fontWeight: 700, color: cat.accent,
              textTransform: 'uppercase', letterSpacing: '0.06em',
            }}>
              {cat.badge}
            </span>
          </div>

          {/* Title */}
          <h4 style={{
            fontFamily: "'Hanken Grotesk', system-ui", fontWeight: 700, fontSize: 15,
            color: '#202124', marginBottom: 16, lineHeight: 1.3,
          }}>
            {cat.title}
          </h4>

          {/* Characteristics */}
          <div style={{ marginBottom: 20, flex: 1 }}>
            <p style={{ fontSize: 9, fontWeight: 700, color: '#80868B', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>
              {t('kd_radiologi')}
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 7 }}>
              {cat.characteristics.map((c, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 12, color: '#3C4043', lineHeight: 1.55 }}>
                  <span style={{ color: cat.accent, fontSize: 14, marginTop: 1, flexShrink: 0, fontWeight: 800 }}>✓</span>
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Details */}
          <div style={{ borderTop: '1px solid #F1F3F4', paddingTop: 14 }}>
            <p style={{ fontSize: 9, fontWeight: 700, color: '#80868B', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>
              {t('kd_handling')}
            </p>
            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8,
              background: '#F8F9FA', borderRadius: 10, padding: '10px 12px',
              border: '1px solid #DADCE0',
            }}>
              {cat.details.map((d) => (
                <div key={d.label}>
                  <p style={{ fontSize: 9, color: '#80868B', fontWeight: 600, marginBottom: 2, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{d.label}</p>
                  <p style={{ fontSize: 11, fontWeight: 700, color: '#202124', margin: 0 }}>{d.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
