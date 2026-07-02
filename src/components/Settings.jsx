import React, { useState, useEffect } from 'react';
import { useTranslation } from '../lib/TranslationContext';
import { getApiConfig, saveApiConfig } from '../services/api';

export default function Settings() {
  const { t } = useTranslation();
  const [config, setConfig] = useState({
    backendUrl: 'http://localhost:5000',
    useMock: true,
    selectedModel: 'densenet121',
  });
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => { setConfig(getApiConfig()); }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setConfig(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    saveApiConfig(config);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const modelOptions = [
    { value: 'densenet121', label: t('set_model_densenet'), badge: t('set_badge_rec'), badgeClass: 'bg-emerald-100 text-emerald-700' },
    { value: 'vgg16',       label: t('set_model_vgg'),      badge: t('set_badge_std'), badgeClass: 'bg-blue-100 text-blue-700' },
    { value: 'mobilenet',   label: t('set_model_mobile'),   badge: t('set_badge_light'), badgeClass: 'bg-amber-100 text-amber-700' },
  ];

  return (
    <div className="space-y-5 animate-fade-in max-w-3xl">

      {/* Page Header */}
      <div className="flex items-center gap-3 p-5 bg-white border border-[#DADCE0] rounded-2xl shadow-[0_1px_4px_rgba(60,64,67,0.08)]">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: '#E8F0FE' }}>
          <span className="material-symbols-outlined text-[#1A73E8] text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
            tune
          </span>
        </div>
        <div>
          <h3 className="font-headline-md text-base font-extrabold text-[#202124]">{t('set_title')}</h3>
          <p className="text-xs text-[#80868B] mt-0.5">{t('set_subtitle')}</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-4">

        {/* ── Mock Mode Toggle ── */}
        <div className="bg-white border border-[#DADCE0] rounded-2xl p-5 shadow-[0_1px_4px_rgba(60,64,67,0.08)]">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: config.useMock ? 'linear-gradient(135deg, #fef3c7, #fde68a)' : 'linear-gradient(135deg, #ccfbf1, #99f6e4)' }}>
                <span className={`material-symbols-outlined text-lg ${config.useMock ? 'text-amber-500' : 'text-emerald-500'}`}
                  style={{ fontVariationSettings: "'FILL' 1" }}>
                  {config.useMock ? 'code_blocks' : 'cloud_done'}
                </span>
              </div>
              <div>
                <label className="text-sm font-bold text-slate-700 block cursor-pointer" htmlFor="useMock">
                  {t('set_mock_title')}
                </label>
                <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                  {t('set_mock_desc')}
                </p>
                <div className="text-center mt-1">
                  <span className="text-[8px] font-bold" style={{ color: config.useMock ? '#F9AB00' : '#1E8E3E' }}>
                    {config.useMock ? t('set_mock_on') : t('set_mock_off')}
                  </span>
                </div>
              </div>
            </div>

            {/* Toggle Switch */}
            <button
              type="button"
              onClick={() => setConfig(p => ({ ...p, useMock: !p.useMock }))}
              className={`relative w-12 h-6 rounded-full transition-all duration-300 cursor-pointer shrink-0 focus:outline-none ${config.useMock ? 'bg-[#F9AB00]' : 'bg-[#1E8E3E]'}`}
            >
              <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-300 ${config.useMock ? 'left-0.5' : 'left-6'}`} />
            </button>
          </div>
        </div>

        {/* ── Backend URL ── */}
        <div className={`bg-white border border-[#DADCE0] rounded-2xl p-5 shadow-[0_1px_4px_rgba(60,64,67,0.08)] transition-opacity duration-300 ${config.useMock ? 'opacity-40 pointer-events-none' : ''}`}>
          <div className="flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-[#1A73E8] text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>link</span>
            <h4 className="text-sm font-bold text-[#202124]">{t('set_url_title')}</h4>
            {!config.useMock && (
              <span className="ml-auto text-[9px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">{t('set_status_active')}</span>
            )}
          </div>

          <label className="block text-xs font-bold text-[#5F6368] mb-1.5" htmlFor="backendUrl">
            {t('set_url_label')}
          </label>
          <input
            type="url"
            id="backendUrl"
            name="backendUrl"
            value={config.backendUrl}
            onChange={handleChange}
            placeholder={t('set_url_ph')}
            disabled={config.useMock}
            required={!config.useMock}
            className="w-full px-4 py-2.5 text-sm bg-[#F8F9FA] border-2 border-[#DADCE0] rounded-xl focus:outline-none focus:border-[#1A73E8] focus:shadow-[0_0_0_3px_rgba(26,115,232,0.1)] transition-all font-mono text-[#202124]"
          />
          <p className="text-[10px] text-slate-400 mt-2 flex items-start gap-1.5">
            <span className="material-symbols-outlined text-xs text-slate-400 shrink-0 mt-0.5">info</span>
            {t('set_url_note')}
          </p>
        </div>

        {/* ── Model Selection ── */}
        <div className="bg-white border border-[#DADCE0] rounded-2xl p-5 shadow-[0_1px_4px_rgba(60,64,67,0.08)]">
          <div className="flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-[#1A73E8] text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>model_training</span>
            <h4 className="text-sm font-bold text-[#202124]">{t('set_model_title')}</h4>
          </div>

          <div className="space-y-2.5">
            {modelOptions.map(opt => (
              <label
                key={opt.value}
                className={`flex items-center gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                  config.selectedModel === opt.value
                  ? 'border-[#1A73E8] bg-[#E8F0FE]'
                    : 'border-[#DADCE0] hover:border-[#80868B] bg-[#F8F9FA]'
                }`}
              >
                <input
                  type="radio"
                  name="selectedModel"
                  value={opt.value}
                  checked={config.selectedModel === opt.value}
                  onChange={handleChange}
                  className="accent-primary"
                />
                <div className="flex-1">
                  <p className={`text-xs font-bold ${config.selectedModel === opt.value ? 'text-[#1A73E8]' : 'text-[#3C4043]'}`}>
                    {opt.label}
                  </p>
                </div>
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${opt.badgeClass}`}>
                  {opt.badge}
                </span>
              </label>
            ))}
          </div>
          <p className="text-[10px] text-[#80868B] mt-3">
            {t('set_model_note')}
          </p>
        </div>

        {/* ── Save Button ── */}
        <div className="flex items-center justify-between pt-1">
          <div className="h-9">
            {saveSuccess && (
              <div className="flex items-center gap-2 px-3 py-2 bg-[#E6F4EA] border border-[#A8D5B5] rounded-xl animate-fade-in">
                <span className="material-symbols-outlined text-[#1E8E3E] text-base" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                <span className="text-xs font-bold text-[#1E7E34]">{t('set_saved')}</span>
              </div>
            )}
          </div>
          <button
            type="submit"
            className="px-7 py-2.5 text-sm font-bold text-white rounded-xl shadow-lg cursor-pointer active:scale-95 flex items-center gap-2 transition-all"
            style={{ background: 'linear-gradient(135deg, #1A73E8, #1558B0)', borderRadius: 10 }}
          >
            <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>save</span>
            {t('set_save')}
          </button>
        </div>

      </form>
    </div>
  );
}
