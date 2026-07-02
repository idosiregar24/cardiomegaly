/**
 * ClinicalUI.jsx — Google White Medical Design System Components
 * Reusable building blocks styled as shadcn/ui-quality components
 * using Tailwind CSS (no external component library required).
 */

import React from 'react';

/* ─── Status badge styles ─── */
const statusStyles = {
  Normal:       'bg-[#E6F4EA] text-[#1E7E34] border-[#A8D5B5]',
  Kardiomegali: 'bg-[#FCE8E6] text-[#C5221F] border-[#F5C6C3]',
  Review:       'bg-[#FEF7E0] text-[#9B6D00] border-[#FDE68A]',
};

/* ─── Metric card icon backgrounds ─── */
const iconBgMap = {
  assignment:     { bg: '#E8F0FE', color: '#1A73E8' },
  verified_user:  { bg: '#E6F4EA', color: '#1E8E3E' },
  cardiology:     { bg: '#FCE8E6', color: '#D93025' },
  clinical_notes: { bg: '#FEF7E0', color: '#F9AB00' },
  heart_plus:     { bg: '#FCE8E6', color: '#D93025' },
  monitoring:     { bg: '#E8F0FE', color: '#1A73E8' },
  default:        { bg: '#F1F3F4', color: '#5F6368' },
};

/* ─────────────────────────────────────────
   GCard — Google-style Card wrapper
   ───────────────────────────────────────── */
export function GCard({ children, className = '', hover = false, style = {} }) {
  return (
    <div
      className={`bg-white border border-[#DADCE0] rounded-xl shadow-[0_1px_3px_rgba(60,64,67,0.08),0_1px_2px_rgba(60,64,67,0.04)] transition-shadow duration-250 ${
        hover ? 'hover:shadow-[0_4px_12px_rgba(60,64,67,0.12)] hover:-translate-y-0.5 transition-transform duration-250' : ''
      } ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}

/* ─────────────────────────────────────────
   GBadge — Status Badge
   ───────────────────────────────────────── */
export function GBadge({ status }) {
  const key = status === 'Kardiomegali' ? 'Kardiomegali'
            : status === 'Normal' ? 'Normal'
            : 'Review';
  const cls = statusStyles[key];
  const icons = { Normal: 'check_circle', Kardiomegali: 'report', Review: 'pending' };

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-bold tracking-wide ${cls}`}>
      <span
        className="material-symbols-outlined text-[13px]"
        style={{ fontVariationSettings: "'FILL' 1" }}
      >
        {icons[key] || 'circle'}
      </span>
      {status}
    </span>
  );
}

/* Legacy alias */
export { GBadge as StatusBadge };

/* ─────────────────────────────────────────
   GButton — Google-style Button
   ───────────────────────────────────────── */
const buttonVariants = {
  primary:   'bg-[#1A73E8] text-white hover:bg-[#1558B0] shadow-[0_1px_3px_rgba(26,115,232,0.3)] hover:shadow-[0_2px_8px_rgba(26,115,232,0.4)] hover:-translate-y-px',
  secondary: 'bg-white text-[#1A73E8] border border-[#DADCE0] hover:bg-[#F8F9FA] hover:border-[#1A73E8]',
  danger:    'bg-[#D93025] text-white hover:bg-[#B52D22] shadow-[0_1px_3px_rgba(217,48,37,0.3)]',
  ghost:     'bg-transparent text-[#5F6368] hover:bg-[#F1F3F4]',
};

export function GButton({ variant = 'primary', className = '', children, ...props }) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold
        transition-all duration-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50
        ${buttonVariants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

/* Legacy alias */
export { GButton as Button };

/* ─────────────────────────────────────────
   GMetricCard — Dashboard Metric Card
   ───────────────────────────────────────── */
export function GMetricCard({ title, value, description, icon, trend }) {
  const iconStyle = iconBgMap[icon] || iconBgMap.default;

  return (
    <article className="bg-white border border-[#DADCE0] rounded-xl p-5 shadow-[0_1px_3px_rgba(60,64,67,0.08)] hover:shadow-[0_4px_12px_rgba(60,64,67,0.1)] transition-all duration-250 hover:-translate-y-0.5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#5F6368]">{title}</p>
          <h3 className="mt-2 text-3xl font-extrabold tracking-tight text-[#202124] tabular-nums">
            {value}
          </h3>
          {trend && (
            <p className="mt-1 text-[11px] font-semibold text-[#1E8E3E] flex items-center gap-1">
              <span className="material-symbols-outlined text-[13px]" style={{ fontVariationSettings: "'FILL' 1" }}>trending_up</span>
              {trend}
            </p>
          )}
        </div>
        <div
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
          style={{ background: iconStyle.bg }}
        >
          <span
            className="material-symbols-outlined text-[22px]"
            style={{ fontVariationSettings: "'FILL' 1", color: iconStyle.color }}
          >
            {icon}
          </span>
        </div>
      </div>
      {description && (
        <p className="mt-3 text-xs leading-relaxed text-[#80868B] border-t border-[#F1F3F4] pt-3">{description}</p>
      )}
    </article>
  );
}

/* Legacy alias */
export { GMetricCard as MetricCard };

/* ─────────────────────────────────────────
   GModal — Low-Confidence Warning Dialog
   (shadcn/ui Dialog equivalent)
   ───────────────────────────────────────── */
export function GModal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center p-4"
      style={{ background: 'rgba(32,33,36,0.5)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-[0_8px_40px_rgba(60,64,67,0.2)] border border-[#DADCE0] animate-scale-in">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#DADCE0]">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FEF7E0]">
              <span
                className="material-symbols-outlined text-[20px] text-[#F9AB00]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                warning
              </span>
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#202124]">Konfirmasi Manual Diperlukan</h3>
              <p className="text-xs text-[#5F6368]">Tinjauan dokter dibutuhkan sebelum pencatatan.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[#80868B] hover:bg-[#F1F3F4] hover:text-[#202124] transition-colors"
            aria-label="Tutup modal"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>
        {/* Modal Body */}
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}

/* Legacy alias */
export { GModal as MedicalModal };
