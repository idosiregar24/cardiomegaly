import { useEffect, useMemo, useState } from 'react';
import { Area, AreaChart, Bar, BarChart,
  CartesianGrid, Cell, Pie, PieChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';
import { fetchHistoryFromSupabase } from '../services/supabaseService';
import { GButton as Button, GMetricCard as MetricCard, GBadge as StatusBadge } from './medical/ClinicalUI';
import { useTranslation } from '../lib/TranslationContext';

const chartColors = {
  blue:    '#1A73E8',
  emerald: '#1E8E3E',
  rose:    '#D93025',
  amber:   '#F9AB00',
  slate:   '#80868B',
  lightBlue: '#4285F4',
};

const monthLabel = (value) =>
  new Date(value).toLocaleDateString('id-ID', { month: 'short', year: '2-digit' });

const buildDashboardData = (logs) => {
  const total        = logs.length;
  const normal       = logs.filter(item => item.status === 'Normal').length;
  const cardiomegaly = logs.filter(item => item.status === 'Kardiomegali').length;
  const validated    = logs.filter(item => item.doctorValidation !== null);
  const agreement    = validated.filter(item => item.doctorValidation === true).length;
  const validationRate = validated.length ? Math.round((agreement / validated.length) * 100) : 0;
  const manualReview   = logs.filter(item => item.doctorValidation === false || item.confidence < 70).length;

  const monthlyMap = logs.reduce((acc, item) => {
    const date  = new Date(item.createdAt || item.date);
    const key   = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const entry = acc.get(key) || { key, label: monthLabel(date), total: 0, Normal: 0, Kardiomegali: 0 };
    entry.total += 1;
    entry[item.status] = (entry[item.status] || 0) + 1;
    acc.set(key, entry);
    return acc;
  }, new Map());

  const validationMap = logs.reduce((acc, item) => {
    const date  = new Date(item.createdAt || item.date);
    const key   = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const entry = acc.get(key) || { key, label: monthLabel(date), sesuai: 0, koreksi: 0 };
    if (item.doctorValidation === true)  entry.sesuai  += 1;
    if (item.doctorValidation === false) entry.koreksi += 1;
    acc.set(key, entry);
    return acc;
  }, new Map());

  return {
    total, normal, cardiomegaly, validationRate, manualReview,
    monthly:      [...monthlyMap.values()].sort((a, b) => a.key.localeCompare(b.key)).slice(-8),
    distribution: [
      { name: 'Normal',       value: normal,       color: chartColors.emerald },
      { name: 'Kardiomegali', value: cardiomegaly, color: chartColors.rose },
    ],
    validation: [...validationMap.values()].sort((a, b) => a.key.localeCompare(b.key)).slice(-8),
  };
};

/* ─── Custom Tooltip ─── */
function GTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: '#FFFFFF', border: '1px solid #DADCE0', borderRadius: 10,
      padding: '10px 14px', boxShadow: '0 4px 16px rgba(60,64,67,0.12)',
      fontSize: 12, fontFamily: "'Inter', system-ui",
    }}>
      <p style={{ fontWeight: 700, color: '#202124', marginBottom: 6 }}>{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{ color: p.color, margin: '2px 0' }}>
          <span style={{ fontWeight: 600 }}>{p.name}:</span> {p.value}
        </p>
      ))}
    </div>
  );
}

export default function DashboardOverview({ onViewDetail, setCurrentTab }) {
  const { t } = useTranslation();
  const [logs,    setLogs]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  useEffect(() => {
    let active = true;
    const loadDashboard = async () => {
      try {
        setLoading(true);
        const rows = await fetchHistoryFromSupabase();
        if (active) setLogs(rows);
      } catch (err) {
        console.error(err);
        if (active) setError('Data dashboard belum dapat dimuat dari Supabase.');
      } finally {
        if (active) setLoading(false);
      }
    };
    loadDashboard();
    return () => { active = false; };
  }, []);

  const analytics  = useMemo(() => buildDashboardData(logs), [logs]);
  const recentLogs = logs.slice(0, 8);

  if (loading) {
    return (
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        minHeight: 420, borderRadius: 12, border: '1px solid #DADCE0', background: '#FFFFFF',
      }}>
        <div style={{
          width: 40, height: 40, borderRadius: '50%',
          border: '3px solid #DADCE0', borderTopColor: '#1A73E8',
          animation: 'spin 0.8s linear infinite',
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <p style={{ marginTop: 16, fontSize: 13, fontWeight: 500, color: '#80868B', fontFamily: "'Inter', system-ui" }}>
          {t('loading')}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">

      {/* ── Hero Banner ── */}
      <section style={{
        borderRadius: 16, overflow: 'hidden',
        background: 'linear-gradient(135deg, #1A73E8 0%, #0D47A1 100%)',
        color: '#FFFFFF', boxShadow: '0 4px 20px rgba(26,115,232,0.25)',
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 24, padding: '28px 32px' }} className="lg:grid-cols-12 lg:p-8">
          <div className="lg:col-span-7">
            <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.18em', color: 'rgba(255,255,255,0.7)', marginBottom: 12 }}>
              {t('db_hero_label')}
            </p>
            <h2 style={{ fontFamily: "'Hanken Grotesk', system-ui", fontWeight: 800, fontSize: 'clamp(22px,3vw,30px)', margin: '0 0 12px', lineHeight: 1.2 }}>
              {t('db_hero_title')}
            </h2>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', lineHeight: 1.7, maxWidth: 480, margin: 0 }}>
              {t('db_hero_subtitle')}
            </p>
          </div>
          <div className="lg:col-span-5">
            <div style={{
              borderRadius: 12, border: '1px solid rgba(255,255,255,0.15)',
              background: 'rgba(255,255,255,0.08)', padding: '18px 20px',
            }}>
              <p style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.75)', marginBottom: 12 }}>
                {t('db_readiness')}
              </p>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, marginBottom: 12 }}>
                <span style={{ fontFamily: "'Hanken Grotesk', system-ui", fontSize: 48, fontWeight: 900, lineHeight: 1 }}>
                  {analytics.validationRate}%
                </span>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)', paddingBottom: 8 }}>{t('db_validated')}</span>
              </div>
              <div style={{ height: 6, borderRadius: 9999, background: 'rgba(255,255,255,0.12)', overflow: 'hidden' }}>
                <div style={{
                  height: '100%', borderRadius: 9999,
                  background: '#34D399', width: `${analytics.validationRate}%`,
                  transition: 'width 1s ease',
                }} />
              </div>
              <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)', marginTop: 8 }}>
                {t('db_total', { n: analytics.total })}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Error Banner ── */}
      {error && (
        <div style={{
          borderRadius: 10, border: '1px solid #FDE68A', background: '#FEF7E0',
          padding: '12px 16px', fontSize: 13, fontWeight: 600, color: '#9B6D00',
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <span className="material-symbols-outlined" style={{ fontSize: 16, fontVariationSettings: "'FILL' 1" }}>warning</span>
          {error}
        </div>
      )}

      {/* ── Metric Cards ── */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
        <MetricCard title={t('db_metric_total')}  value={analytics.total}          description={t('db_metric_total_desc')} icon="assignment" />
        <MetricCard title={t('db_metric_normal')}  value={analytics.normal}         description={t('db_metric_normal_desc')} icon="verified_user" />
        <MetricCard title={t('db_metric_cardi')}   value={analytics.cardiomegaly}   description={t('db_metric_cardi_desc')}  icon="cardiology" />
        <MetricCard title={t('db_metric_review')}  value={analytics.manualReview}   description={t('db_metric_review_desc')} icon="clinical_notes" />
      </section>

      {/* ── Charts Row 1 ── */}
      <section style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16 }} className="xl:grid-cols-12">

        {/* Area chart */}
        <article className="xl:col-span-7" style={{
          borderRadius: 12, border: '1px solid #DADCE0', background: '#FFFFFF',
          padding: 20, boxShadow: '0 1px 4px rgba(60,64,67,0.06)',
          minWidth: 0, overflow: 'hidden',
        }}>
          <div style={{ marginBottom: 16 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: '#202124', margin: '0 0 4px', fontFamily: "'Hanken Grotesk', system-ui" }}>
              {t('db_chart_time')}
            </h3>
            <p style={{ fontSize: 11, color: '#80868B', margin: 0 }}>{t('db_chart_time_sub')}</p>
          </div>
          <div style={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analytics.monthly}>
                <defs>
                  <linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={chartColors.blue} stopOpacity={0.18} />
                    <stop offset="95%" stopColor={chartColors.blue} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F3F4" />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: chartColors.slate }} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: chartColors.slate }} axisLine={false} tickLine={false} />
                <Tooltip content={<GTooltip />} />
                <Area type="monotone" dataKey="total" stroke={chartColors.blue} strokeWidth={2.5} fill="url(#blueGrad)" name={t('db_chart_exam')} dot={{ fill: chartColors.blue, r: 3 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </article>

        {/* Pie chart */}
        <article className="xl:col-span-5" style={{
          borderRadius: 12, border: '1px solid #DADCE0', background: '#FFFFFF',
          padding: 20, boxShadow: '0 1px 4px rgba(60,64,67,0.06)',
          minWidth: 0, overflow: 'hidden',
        }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#202124', margin: '0 0 4px', fontFamily: "'Hanken Grotesk', system-ui" }}>
            {t('db_chart_dist')}
          </h3>
          <p style={{ fontSize: 11, color: '#80868B', margin: '0 0 12px' }}>{t('db_chart_dist_sub')}</p>
          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={analytics.distribution} dataKey="value" nameKey="name" innerRadius={60} outerRadius={90} paddingAngle={4} strokeWidth={0}>
                  {analytics.distribution.map(entry => <Cell key={entry.name} fill={entry.color} />)}
                </Pie>
                <Tooltip content={<GTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {analytics.distribution.map(item => (
              <div key={item.name} style={{
                borderRadius: 10, border: '1px solid #DADCE0', padding: '10px 12px',
                borderLeft: `3px solid ${item.color}`,
              }}>
                <p style={{ fontSize: 11, fontWeight: 600, color: '#80868B', margin: '0 0 4px' }}>{item.name}</p>
                <p style={{ fontSize: 22, fontWeight: 800, color: '#202124', margin: 0, fontFamily: "'Hanken Grotesk', system-ui" }}>{item.value}</p>
              </div>
            ))}
          </div>
        </article>
      </section>

      {/* ── Charts Row 2 ── */}
      <section style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16 }} className="xl:grid-cols-12">

        {/* Bar chart */}
        <article className="xl:col-span-5" style={{
          borderRadius: 12, border: '1px solid #DADCE0', background: '#FFFFFF',
          padding: 20, boxShadow: '0 1px 4px rgba(60,64,67,0.06)',
          minWidth: 0, overflow: 'hidden',
        }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#202124', margin: '0 0 4px', fontFamily: "'Hanken Grotesk', system-ui" }}>
            {t('db_chart_valid')}
          </h3>
          <p style={{ fontSize: 11, color: '#80868B', margin: '0 0 12px' }}>{t('db_chart_valid_sub')}</p>
          <div style={{ height: 240 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.validation} barSize={14}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F3F4" />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: chartColors.slate }} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: chartColors.slate }} axisLine={false} tickLine={false} />
                <Tooltip content={<GTooltip />} />
                <Bar dataKey="sesuai"  name={t('db_chart_agree')}   fill={chartColors.emerald} radius={[4, 4, 0, 0]} />
                <Bar dataKey="koreksi" name={t('db_chart_correct')} fill={chartColors.amber}   radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>

        {/* Recent logs table */}
        <article className="xl:col-span-7" style={{
          borderRadius: 12, border: '1px solid #DADCE0', background: '#FFFFFF',
          overflow: 'hidden', boxShadow: '0 1px 4px rgba(60,64,67,0.06)',
          minWidth: 0,
        }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '14px 20px', borderBottom: '1px solid #F1F3F4',
          }}>
            <div>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: '#202124', margin: '0 0 2px', fontFamily: "'Hanken Grotesk', system-ui" }}>
                {t('db_recent_title')}
              </h3>
              <p style={{ fontSize: 11, color: '#80868B', margin: 0 }}>{t('db_recent_sub')}</p>
            </div>
            <Button variant="secondary" onClick={() => setCurrentTab('history')}
              style={{ fontSize: 12, padding: '6px 12px' }}>
              {t('viewAll')}
            </Button>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead style={{ background: '#F8F9FA' }}>
                <tr>
                  {[t('db_col_id'), t('db_col_date'), t('db_col_conf'), t('db_col_status'), t('db_col_action')].map((h, i) => (
                    <th key={h} style={{
                      padding: '10px 16px', fontSize: 10, fontWeight: 700,
                      textTransform: 'uppercase', letterSpacing: '0.12em', color: '#5F6368',
                      textAlign: i === 4 ? 'right' : 'left',
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentLogs.map(item => (
                  <tr key={item.id} style={{ borderBottom: '1px solid #F8F9FA', transition: 'background 0.12s' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#F8F9FA'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <td style={{ padding: '10px 16px', fontSize: 12, fontWeight: 700, color: '#202124', fontFamily: 'monospace' }}>{item.patientId}</td>
                    <td style={{ padding: '10px 16px', fontSize: 12, color: '#5F6368' }}>{item.date}</td>
                    <td style={{ padding: '10px 16px', fontSize: 12, fontWeight: 600, color: '#3C4043' }}>{Number(item.confidence).toFixed(1)}%</td>
                    <td style={{ padding: '10px 16px' }}><StatusBadge status={item.status} /></td>
                    <td style={{ padding: '10px 16px', textAlign: 'right' }}>
                      <button
                        onClick={() => onViewDetail(item)}
                        style={{
                          fontSize: 11, fontWeight: 700, color: '#1A73E8', background: 'none',
                          border: 'none', cursor: 'pointer', padding: '4px 8px', borderRadius: 6,
                          transition: 'background 0.12s',
                          fontFamily: "'Inter', system-ui",
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#E8F0FE'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'none'; }}
                      >
                        {t('detail')}
                      </button>
                    </td>
                  </tr>
                ))}
                {!recentLogs.length && (
                  <tr>
                    <td colSpan="5" style={{ padding: '40px', textAlign: 'center', fontSize: 13, color: '#80868B' }}>
                      {t('noData')}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </article>
      </section>
    </div>
  );
}
