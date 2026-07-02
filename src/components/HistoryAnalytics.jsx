import { useCallback, useEffect, useState } from 'react';
import { fetchHistoryFromSupabase, deleteLogFromSupabase } from '../services/supabaseService';

export default function HistoryAnalytics({ onViewDetail }) {
  const [history, setHistory]         = useState([]);
  const [search, setSearch]           = useState('');
  const [statusFilter, setStatusFilter] = useState('Semua');
  const [genderFilter, setGenderFilter] = useState('Semua');
  const [sortKey, setSortKey]         = useState('date');
  const [sortOrder, setSortOrder]     = useState('desc');
  const [loading, setLoading]         = useState(true);

  const loadHistory = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchHistoryFromSupabase();
      setHistory(data);
    } catch (e) {
      console.error('Gagal memuat rekam medis dari Supabase:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(loadHistory, 0);
    return () => clearTimeout(timer);
  }, [loadHistory]);

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (window.confirm('Apakah Anda yakin ingin menghapus rekam medis ini dari database Supabase?')) {
      try {
        await deleteLogFromSupabase(id);
        await loadHistory();
      } catch {
        alert('Gagal menghapus rekam medis.');
      }
    }
  };

  const filteredData = history.filter(item => {
    const q  = search.toLowerCase();
    const ms = item.name.toLowerCase().includes(q) || item.patientId.toLowerCase().includes(q);
    const mt = statusFilter === 'Semua' || 
               item.status === statusFilter || 
               (statusFilter === 'Normal' && item.status === 'Jantung Normal') ||
               (statusFilter === 'Kardiomegali' && (item.status === 'Kardiomegali Ringan' || item.status === 'Kardiomegali Berat'));
    const mg = genderFilter === 'Semua' || item.gender === genderFilter;
    return ms && mt && mg;
  });

  const sortedData = [...filteredData].sort((a, b) => {
    let av = a[sortKey], bv = b[sortKey];
    if (['confidence','age'].includes(sortKey)) { av = parseFloat(av); bv = parseFloat(bv); }
    if (av < bv) return sortOrder === 'asc' ? -1 : 1;
    if (av > bv) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const toggleSort = (key) => {
    if (sortKey === key) setSortOrder(o => o === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortOrder('desc'); }
  };

  const SortIcon = ({ k }) => sortKey === k
    ? <span className="material-symbols-outlined text-[11px] text-primary">{sortOrder === 'asc' ? 'arrow_upward' : 'arrow_downward'}</span>
    : <span className="material-symbols-outlined text-[11px] text-slate-300">unfold_more</span>;

  /* SVG Line Chart */
  const lineChartPoints = [
    { month: 'Jan', count: 12 },
    { month: 'Feb', count: 19 },
    { month: 'Mar', count: 15 },
    { month: 'Apr', count: 28 },
    { month: 'Mei', count: 22 },
    { month: 'Jun', count: 32 },
  ];

  const W = 500, H = 100, PX = 40, PY = 15;
  const UW = W - PX * 2, UH = H - PY * 2;
  const maxCount = 40;

  const pts = lineChartPoints.map((p, i) => ({
    x: PX + (i / (lineChartPoints.length - 1)) * UW,
    y: H - PY - (p.count / maxCount) * UH,
    ...p,
  }));

  const lineD = pts.reduce((acc, p, i) => i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`, '');
  const areaD = lineD
    ? `${lineD} L ${pts[pts.length-1].x} ${H - PY} L ${pts[0].x} ${H - PY} Z`
    : '';

  const statusChip = (s) => {
    const m = {
      Normal: 'badge-success',
      'Jantung Normal': 'badge-success',
      Kardiomegali: 'badge-danger',
      'Kardiomegali Berat': 'badge-danger',
      'Kardiomegali Ringan': 'bg-amber-100 text-amber-700 border border-amber-200',
      'Perlu Review': 'badge-warning'
    };
    return m[s] || 'badge-info';
  };

  const cardioCases = history.filter(h => 
    h.status === 'Kardiomegali' || 
    h.status === 'Kardiomegali Ringan' || 
    h.status === 'Kardiomegali Berat'
  ).length;

  return (
    <div className="space-y-6 animate-fade-in">

      {/* ── Trend Chart Section ── */}
      <section className="bg-white border border-slate-200/70 rounded-2xl p-6 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

          {/* Left: Stats */}
          <div className="lg:col-span-5 space-y-5">
            <div>
              <span className="inline-block text-[10px] font-bold text-primary px-3 py-1 rounded-full bg-blue-50 border border-blue-200 uppercase tracking-widest mb-2">
                Tren Analisis AI
              </span>
              <h4 className="font-headline-md text-lg font-extrabold text-slate-800">Kurva Perkembangan Kasus</h4>
              <p className="text-xs text-slate-400 leading-relaxed mt-1">
                Kumulatif kasus kardiomegali baru terdeteksi pada pasien ODGJ per bulan. Deteksi dini membantu pencegahan risiko kardiovaskuler akibat antipsikotik.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-red-100 bg-red-50">
                <p className="text-[10px] text-red-400 font-semibold uppercase tracking-wide">Kasus Kardiomegali</p>
                <p className="text-2xl font-extrabold text-red-600 mt-1">{cardioCases} <span className="text-sm font-bold">Pasien</span></p>
              </div>
              <div className="p-4 rounded-xl border border-emerald-100 bg-emerald-50">
                <p className="text-[10px] text-emerald-500 font-semibold uppercase tracking-wide">Rata-rata Akurasi</p>
                <p className="text-2xl font-extrabold text-emerald-600 mt-1">94.8<span className="text-sm font-bold">%</span></p>
              </div>
            </div>
          </div>

          {/* Right: SVG Chart */}
          <div className="lg:col-span-7 bg-slate-50 p-5 rounded-2xl border border-slate-100">
            <div className="w-full">
              <svg className="w-full h-auto overflow-visible" viewBox={`0 0 ${W} ${H}`} fill="none">
                <defs>
                  <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#dc2626" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#dc2626" stopOpacity="0" />
                  </linearGradient>
                </defs>

                {/* Grid lines */}
                {[0, 0.5, 1].map((r, i) => (
                  <line key={i}
                    x1={PX} y1={PY + r * UH} x2={W - PX} y2={PY + r * UH}
                    stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4 4" />
                ))}

                {areaD && <path d={areaD} fill="url(#chartGrad)" />}
                {lineD && <path d={lineD} stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />}

                {pts.map((p, i) => (
                  <g key={i} className="group cursor-pointer">
                    <circle cx={p.x} cy={p.y} r="5" fill="#dc2626" stroke="white" strokeWidth="2" />
                    <circle cx={p.x} cy={p.y} r="10" fill="rgba(220,38,38,0.15)" className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    <text x={p.x} y={p.y - 10} textAnchor="middle" fontSize="9" fill="#dc2626" fontWeight="bold"
                      className="opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      {p.count}
                    </text>
                    <text x={p.x} y={H - 2} textAnchor="middle" fontSize="9" fill="#94a3b8" fontWeight="600">
                      {p.month}
                    </text>
                  </g>
                ))}
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* ── History Table ── */}
      <section className="bg-white border border-slate-200/70 rounded-2xl shadow-sm overflow-hidden">

        {/* Table Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h4 className="font-title-lg text-sm font-bold text-slate-800">Data Rekam Medis Histori</h4>
            <p className="text-[10px] text-slate-400 mt-0.5">Database prediksi klasifikasi kardiomegali pasien ODGJ</p>
          </div>

          <div className="flex flex-wrap w-full md:w-auto gap-2.5">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px]">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-base">search</span>
              <input
                type="text" placeholder="Cari nama atau ID..."
                value={search} onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              />
            </div>

            {/* Status Filter */}
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
              className="text-xs border border-slate-200 bg-slate-50 rounded-xl px-2.5 py-2 focus:outline-none focus:ring-2 focus:ring-primary/30 cursor-pointer">
              <option value="Semua">Semua Status</option>
              <option value="Normal">Jantung Normal / Normal</option>
              <option value="Kardiomegali Ringan">Kardiomegali Ringan</option>
              <option value="Kardiomegali Berat">Kardiomegali Berat</option>
              <option value="Kardiomegali">Kardiomegali (Lama)</option>
              <option value="Perlu Review">Perlu Review</option>
            </select>

            {/* Gender Filter */}
            <select value={genderFilter} onChange={e => setGenderFilter(e.target.value)}
              className="text-xs border border-slate-200 bg-slate-50 rounded-xl px-2.5 py-2 focus:outline-none focus:ring-2 focus:ring-primary/30 cursor-pointer">
              <option value="Semua">Semua Gender</option>
              <option value="Laki-laki">Laki-laki</option>
              <option value="Perempuan">Perempuan</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {[
                  { key: 'name',       label: 'Nama Pasien' },
                  { key: 'id',         label: 'ID Pasien' },
                  { key: 'age',        label: 'Umur' },
                  { key: 'date',       label: 'Tanggal Analisis' },
                  { key: 'confidence', label: 'Skor Kepercayaan' },
                  { key: null,         label: 'Status' },
                  { key: null,         label: 'Aksi', right: true },
                ].map((col, i) => (
                  <th key={i}
                    onClick={col.key ? () => toggleSort(col.key) : undefined}
                    className={`px-5 py-3 text-[11px] text-slate-500 font-bold uppercase tracking-wider ${col.key ? 'cursor-pointer hover:text-primary transition-colors' : ''} ${col.right ? 'text-right' : ''}`}
                  >
                    <span className="flex items-center gap-1">
                      {col.label}
                      {col.key && <SortIcon k={col.key} />}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-8 h-8 rounded-full border-4 border-slate-200 border-t-primary animate-spin" />
                      <p className="text-xs text-slate-400 font-semibold">Memuat rekam medis dari Supabase...</p>
                    </div>
                  </td>
                </tr>
              ) : sortedData.length > 0 ? sortedData.map(item => (
                <tr key={item.id} className="table-row-hover transition-colors group">
                  <td className="px-5 py-3.5">
                    <p className="text-xs font-bold text-slate-700">{item.name}</p>
                    <p className="text-[10px] text-slate-400">{item.gender}</p>
                  </td>
                  <td className="px-5 py-3.5 text-xs text-slate-400 font-mono">{item.patientId}</td>
                  <td className="px-5 py-3.5 text-xs text-slate-500">{item.age === '-' ? '-' : `${item.age} Th`}</td>
                  <td className="px-5 py-3.5 text-xs text-slate-400">{item.date}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-16 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-gradient-to-r from-primary to-emerald-400"
                          style={{ width: `${item.confidence}%` }} />
                      </div>
                      <span className="text-xs font-bold text-primary">{item.confidence}%</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${statusChip(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => onViewDetail(item)}
                        className="px-3 py-1.5 rounded-lg text-[11px] font-bold text-primary bg-blue-50 hover:bg-primary hover:text-white transition-all cursor-pointer border border-blue-200/60 hover:border-transparent">
                        Detail
                      </button>
                      <button onClick={e => handleDelete(item.id, e)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-red-400 hover:bg-red-50 hover:text-red-500 transition-all cursor-pointer border border-transparent hover:border-red-200"
                        title="Hapus Rekaman">
                        <span className="material-symbols-outlined text-sm">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <span className="material-symbols-outlined text-5xl text-slate-200">search_off</span>
                      <p className="text-xs text-slate-400 font-semibold">Tidak ditemukan data pasien yang cocok.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        {sortedData.length > 0 && (
          <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 flex justify-between items-center">
            <p className="text-[11px] text-slate-400">
              Menampilkan <span className="font-bold text-slate-600">{sortedData.length}</span> dari <span className="font-bold text-slate-600">{history.length}</span> rekam medis
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
