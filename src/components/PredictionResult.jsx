import React, { useState, useEffect } from 'react';
import logoRsj from '../assets/logo-vertikal-rsj.png';

export default function PredictionResult({ result, onReset }) {
  if (!result) return null;

  const [notes, setNotes] = useState(result.notes || '');
  const [verificationStatus, setVerificationStatus] = useState(result.status || 'Normal');
  const [doctorName, setDoctorName] = useState('Dr. Budi Santoso, Sp.Rad');
  const [isVerified, setIsVerified] = useState(false);
  const [showCTR, setShowCTR] = useState(true);

  // Sync state if result changes
  useEffect(() => {
    setNotes(result.notes || '');
    setVerificationStatus(result.status || 'Normal');
    setIsVerified(false);
  }, [result]);

  const isCardiomegaly = verificationStatus === 'Kardiomegali';
  const isReview = verificationStatus === 'Perlu Review';

  // Tentukan warna tema berdasarkan status hasil verifikasi
  let themeColor = 'text-secondary';
  let bgColor = 'bg-secondary-container/20 text-secondary border-secondary/30';
  let barColor = 'bg-secondary';
  
  if (isCardiomegaly) {
    themeColor = 'text-error';
    bgColor = 'bg-error-container/20 text-error border-error/30';
    barColor = 'bg-error';
  } else if (isReview) {
    themeColor = 'text-tertiary';
    bgColor = 'bg-tertiary-fixed/30 text-tertiary border-tertiary/30';
    barColor = 'bg-tertiary';
  }

  const handlePrint = () => {
    window.print();
  };

  const handleSaveVerification = (e) => {
    e.preventDefault();
    
    // Simpan hasil verifikasi ke localStorage database riwayat
    const history = JSON.parse(localStorage.getItem('cardiomegaly_history') || '[]');
    const updated = history.map(item => {
      if (item.id === result.id) {
        return {
          ...item,
          status: verificationStatus,
          notes: notes,
          verifiedBy: doctorName,
          isVerified: true,
          dateVerified: new Date().toISOString().split('T')[0]
        };
      }
      return item;
    });
    
    localStorage.setItem('cardiomegaly_history', JSON.stringify(updated));
    setIsVerified(true);
    
    // Tampilkan notifikasi singkat
    setTimeout(() => {
      setIsVerified(false);
    }, 4000);
  };

  // Format tanggal hari ini (Pekanbaru, Riau format)
  const getFormattedDate = () => {
    const months = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    const today = new Date();
    return `Pekanbaru, ${today.getDate()} ${months[today.getMonth()]} ${today.getFullYear()}`;
  };

  return (
    <section className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 shadow-sm print:shadow-none print:border-none print:bg-white print:p-0 animate-fade-in">
      
      {/* Action Header (Hidden when printing) */}
      <div className="flex justify-between items-center mb-6 print:hidden">
        <button 
          onClick={onReset}
          className="flex items-center gap-1.5 text-xs font-bold text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-base">arrow_back</span>
          Kembali ke Unggahan
        </button>
        <div className="flex gap-2">
          {/* Checkbox Toggle Pengukuran CTR */}
          <label className="flex items-center gap-2 px-3 py-1.5 border border-outline-variant/60 rounded-lg text-xs font-bold bg-surface-container-low cursor-pointer">
            <input 
              type="checkbox" 
              checked={showCTR}
              onChange={(e) => setShowCTR(e.target.checked)}
              className="w-4 h-4 text-primary bg-surface-container-low border-outline-variant rounded focus:ring-primary focus:ring-offset-0"
            />
            Tampilkan Garis CTR
          </label>
          
          <button 
            onClick={handlePrint}
            className="px-4 py-2 text-xs font-bold bg-primary text-white hover:bg-primary-container rounded-lg flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
          >
            <span className="material-symbols-outlined text-sm">print</span>
            Cetak Laporan Resmi
          </button>
        </div>
      </div>

      {/* Tampilan Lembar Kertas Laporan (Kop Surat RSJ Tampan Riau) */}
      <div className="bg-white border border-outline-variant/50 rounded-2xl p-8 max-w-5xl mx-auto print:border-none print:p-0 shadow-sm print:shadow-none">
        
        {/* Kop Surat Resmi Rumah Sakit Jiwa Tampan Provinsi Riau */}
        <div className="flex items-center justify-between border-b-4 border-double border-on-surface pb-4 mb-6">
          {/* Logo RSJ Tampan Riau */}
          <div className="w-20 h-20 overflow-hidden shrink-0">
            <img
              src={logoRsj}
              alt="Logo RSJ Tampan Riau"
              className="w-full h-full object-contain"
            />
          </div>
          
          <div className="text-center flex-1 px-4">
            <h3 className="text-sm font-bold tracking-widest text-on-surface uppercase">Pemerintah Provinsi Riau</h3>
            <h2 className="text-lg md:text-xl font-extrabold text-primary uppercase tracking-wide leading-tight">Rumah Sakit Jiwa Tampan</h2>
            <p className="text-[10px] text-on-surface-variant leading-relaxed">
              Jl. H.R. Soebrantas Km. 12.5 Pekanbaru | Telp. (0761) 63240 | Fax. (0761) 63239
            </p>
            <p className="text-[9px] text-on-surface-variant font-medium">
              Email: rsjtampan@riau.go.id | Website: rsjtampan.riau.go.id
            </p>
          </div>
          
          {/* Logo RSJ Tampan Riau (pengganti placeholder) */}
          <div className="w-20 h-20 overflow-hidden shrink-0">
            <img
              src={logoRsj}
              alt="Logo RSJ Tampan Riau"
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {/* Judul Dokumen Laporan */}
        <div className="text-center mb-6">
          <h4 className="text-sm font-extrabold text-on-surface uppercase tracking-wider underline">Laporan Pemeriksaan Radiologi Dada</h4>
          <span className="text-[10px] text-on-surface-variant uppercase font-bold tracking-widest block mt-1">Sistem Pendukung Keputusan AI-Assisted</span>
        </div>

        {/* Tabel Identitas & Informasi Pasien */}
        <div className="bg-surface-container-low/40 border border-outline-variant/60 rounded-xl p-4 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-xs mb-8">
          <div className="flex justify-between py-1 border-b border-outline-variant/20">
            <span className="text-on-surface-variant">Nama Pasien:</span>
            <span className="font-bold text-on-surface">{result.name}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-outline-variant/20">
            <span className="text-on-surface-variant">No. Rekam Medis (ID):</span>
            <span className="font-bold text-on-surface">{result.id}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-outline-variant/20">
            <span className="text-on-surface-variant">Umur / Gender:</span>
            <span className="font-bold text-on-surface">{result.age} Tahun / {result.gender}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-outline-variant/20">
            <span className="text-on-surface-variant">Tanggal Pemeriksaan:</span>
            <span className="font-bold text-on-surface">{result.date}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-outline-variant/20">
            <span className="text-on-surface-variant">Unit Pengirim:</span>
            <span className="font-bold text-on-surface">Instalasi Rehabilitasi Jiwa RSJT</span>
          </div>
          <div className="flex justify-between py-1 border-b border-outline-variant/20">
            <span className="text-on-surface-variant">Model Inferensi Deep Learning:</span>
            <span className="font-bold text-primary">{result.model}</span>
          </div>
        </div>

        {/* Bagian Utama Laporan: Kiri (Citra) & Kanan (Diagnosa) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Kolom Kiri: Citra Rontgen X-Ray dengan Overlay CTR */}
          <div className="lg:col-span-6 flex flex-col items-center">
            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-2 block self-start">Citra Chest X-Ray Pasien</span>
            
            <div className="relative w-full aspect-square max-w-sm rounded-xl overflow-hidden border border-outline-variant/80 bg-[#0e161b] flex items-center justify-center shadow-md">
              {result.filePreview ? (
                <img 
                  src={result.filePreview} 
                  alt="Chest X-Ray Pasien" 
                  className="w-full h-full object-contain"
                />
              ) : (
                /* Skema anatomi X-Ray Paru-Jantung jika tidak ada preview file */
                <svg className="w-full h-full opacity-30 p-4" viewBox="0 0 200 200" fill="none">
                  <path d="M40 30 C 50 10, 150 10, 160 30 M30 60 C 40 40, 160 40, 170 60 M25 90 C 35 70, 165 70, 175 90 M20 120 C 30 100, 170 100, 180 120 M20 150 C 30 130, 170 130, 180 150" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
                  <rect x="96" y="20" width="8" height="160" rx="2" fill="#475569" opacity="0.5" />
                  <path d="M85 35 C 65 35, 45 60, 45 110 C 45 150, 85 160, 85 160 C 85 160, 92 120, 92 80 C 92 50, 85 35, 85 35 Z" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
                  <path d="M115 35 C 135 35, 155 60, 155 110 C 155 150, 115 160, 115 160 C 115 160, 108 120, 108 80 C 108 50, 115 35, 115 35 Z" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
                  <path 
                    d={isCardiomegaly 
                      ? "M85 100 C 85 100, 90 155, 63 155 C 80 162, 120 162, 133 143 C 138 128, 115 100, 85 100 Z" 
                      : "M85 100 C 85 100, 92 145, 75 145 C 85 150, 115 150, 122 138 C 125 125, 115 100, 85 100 Z"
                    } 
                    fill="#475569" 
                    stroke="#64748b" 
                    strokeWidth="1.5" 
                    opacity="0.85" 
                  />
                </svg>
              )}
              
              {/* CTR Measurement Lines Overlay */}
              {showCTR && (
                <div className="absolute inset-0 pointer-events-none">
                  <svg className="w-full h-full" viewBox="0 0 300 300">
                    {isCardiomegaly ? (
                      <>
                        {/* Garis Lebar Jantung (A+B) */}
                        <line x1="85" y1="205" x2="215" y2="205" stroke="#ef4444" strokeWidth="2.5" strokeDasharray="3 3" />
                        <circle cx="85" cy="205" r="4.5" fill="#ef4444" />
                        <circle cx="215" cy="205" r="4.5" fill="#ef4444" />
                        <text x="150" y="196" fill="#ef4444" fontSize="9" fontWeight="bold" textAnchor="middle">Cardiac (A+B) = 15.2 cm</text>
                      </>
                    ) : (
                      <>
                        {/* Garis Normal Lebar Jantung */}
                        <line x1="105" y1="200" x2="190" y2="200" stroke="#10b981" strokeWidth="2.5" strokeDasharray="3 3" />
                        <circle cx="105" cy="200" r="4.5" fill="#10b981" />
                        <circle cx="190" cy="200" r="4.5" fill="#10b981" />
                        <text x="147" y="191" fill="#10b981" fontSize="9" fontWeight="bold" textAnchor="middle">Cardiac (A+B) = 11.5 cm</text>
                      </>
                    )}
                    
                    {/* Garis Rongga Dada (C) */}
                    <line x1="50" y1="240" x2="250" y2="240" stroke="#eab308" strokeWidth="2.5" strokeDasharray="3 3" />
                    <circle cx="50" cy="240" r="4.5" fill="#eab308" />
                    <circle cx="250" cy="240" r="4.5" fill="#eab308" />
                    <text x="150" y="232" fill="#eab308" fontSize="9" fontWeight="bold" textAnchor="middle">Thoracic Cavity (C) = 26.0 cm</text>
                    
                    {/* Panel Pojok Rasio */}
                    <rect x="10" y="10" width="120" height="34" rx="4" fill="rgba(14, 22, 27, 0.85)" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
                    <text x="18" y="22" fill="#94a3b8" fontSize="8" fontWeight="bold" uppercase="true">Rasio Kardiotoraks</text>
                    <text x="18" y="34" fill={isCardiomegaly ? "#ef4444" : "#10b981"} fontSize="11" fontWeight="bold">
                      CTR: {isCardiomegaly ? "58.4% (Abnormal)" : "44.2% (Normal)"}
                    </text>
                  </svg>
                </div>
              )}
            </div>
          </div>

          {/* Kolom Kanan: Detail Diagnosa & Verifikasi Dokter */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
            
            <div className="space-y-5">
              
              {/* Hasil Model AI Section */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block">1. Diagnosa Sistem AI</span>
                <div className="flex items-center justify-between p-3.5 bg-surface-container-low rounded-xl border border-outline-variant/60">
                  <div className="space-y-1">
                    <span className="text-xs text-on-surface-variant block">Hasil Klasifikasi:</span>
                    <span className={`inline-block px-3 py-0.5 rounded-full border text-xs font-bold ${bgColor}`}>
                      {verificationStatus}
                    </span>
                  </div>
                  
                  {/* Linear Kepercayaan Bar (Lebih Klinis daripada Donut Chart) */}
                  <div className="w-1/2 text-right space-y-1">
                    <span className="text-[10px] text-on-surface-variant font-bold block">Kepercayaan Model: {result.confidence}%</span>
                    <div className="h-2 w-full bg-outline-variant/40 rounded-full overflow-hidden">
                      <div className={`h-full ${barColor} transition-all duration-500`} style={{ width: `${result.confidence}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Verifikasi Medis Dokter (Interaktif) */}
              <form onSubmit={handleSaveVerification} className="space-y-4 print:hidden">
                <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block">2. Verifikasi Medis &amp; Tanda Tangan</span>
                
                <div className="space-y-3.5 p-4 border border-outline-variant/60 rounded-xl bg-surface-container-low/20">
                  
                  {/* Pilihan Koreksi Status */}
                  <div>
                    <label className="block text-[10px] font-bold text-on-surface-variant uppercase mb-1" htmlFor="verificationStatus">
                      Konfirmasi Diagnosis Dokter
                    </label>
                    <select
                      id="verificationStatus"
                      value={verificationStatus}
                      onChange={(e) => setVerificationStatus(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-surface-container-low border border-outline-variant rounded focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                      <option value="Normal">Normal (Setuju / Koreksi)</option>
                      <option value="Kardiomegali">Kardiomegali (Setuju / Koreksi)</option>
                      <option value="Perlu Review">Perlu Review / Ragu-ragu</option>
                    </select>
                  </div>

                  {/* Input Catatan Medis (Editable) */}
                  <div>
                    <label className="block text-[10px] font-bold text-on-surface-variant uppercase mb-1" htmlFor="notes">
                      Catatan Klinis Dokter Pemeriksa
                    </label>
                    <textarea
                      id="notes"
                      rows="3"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Masukkan catatan klinis radiologi..."
                      className="w-full px-3 py-2 text-xs bg-surface-container-low border border-outline-variant rounded focus:outline-none focus:ring-1 focus:ring-primary leading-normal resize-none"
                    />
                  </div>

                  {/* Input Nama Dokter */}
                  <div>
                    <label className="block text-[10px] font-bold text-on-surface-variant uppercase mb-1" htmlFor="doctorName">
                      Nama Dokter Radiolog (NIP)
                    </label>
                    <input
                      type="text"
                      id="doctorName"
                      value={doctorName}
                      onChange={(e) => setDoctorName(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs bg-surface-container-low border border-outline-variant rounded focus:outline-none focus:ring-1 focus:ring-primary font-medium"
                    />
                  </div>

                  {/* Tombol Simpan Verifikasi */}
                  <button
                    type="submit"
                    className="w-full py-2 bg-primary text-white hover:bg-primary-container text-xs font-bold rounded transition-all cursor-pointer shadow flex items-center justify-center gap-1"
                  >
                    <span className="material-symbols-outlined text-base">verified</span>
                    Simpan &amp; Verifikasi Rekam Medis
                  </button>

                  {/* Notifikasi Sukses */}
                  {isVerified && (
                    <div className="p-2 bg-secondary-container/30 text-secondary border border-secondary/20 rounded text-center text-[10px] font-bold animate-pulse">
                      Laporan radiologi berhasil diverifikasi dan disimpan ke rekam medis pasien!
                    </div>
                  )}

                </div>
              </form>

              {/* Tampilan Catatan Medis saat Print */}
              <div className="hidden print:block space-y-2 mt-4 text-xs">
                <span className="font-bold text-on-surface block">Catatan Medis Dokter Radiolog:</span>
                <p className="p-3 bg-surface-container-low rounded border border-outline-variant/60 leading-relaxed text-justify">
                  {notes || 'Tidak ada catatan klinis tambahan.'}
                </p>
              </div>

            </div>
          </div>

        </div>

        {/* Tanda Tangan Resmi Instansi RSJ Tampan (Format Laporan Resmi Riau) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mt-12 pt-6 border-t border-outline-variant/40">
          
          <div className="md:col-span-7 text-[10px] text-on-surface-variant leading-relaxed self-end">
            <span className="font-bold text-on-surface block mb-1">Catatan Keamanan Rekam Medis:</span>
            <span>
              Dokumen laporan ini diproses oleh sistem bantu kecerdasan buatan RSJ Tampan Riau untuk klasifikasi dini gangguan kardiomegali ODGJ imbas antipsikotik. Segala keputusan medis akhir tetap menjadi tanggung jawab dokter radiolog penanggung jawab.
            </span>
          </div>

          <div className="md:col-span-5 text-right text-xs space-y-12">
            <div>
              <p className="text-on-surface">{getFormattedDate()}</p>
              <p className="font-bold text-on-surface-variant">Dokter Spesialis Radiologi RSJT,</p>
            </div>
            
            <div>
              <p className="font-bold text-on-surface underline">{doctorName}</p>
              <p className="text-[10px] text-on-surface-variant">SIP/NIP. 19800412 200801 1 003</p>
            </div>
          </div>

        </div>

      </div>

      {/* Button Pasien Baru di paling bawah luar kertas print */}
      <div className="max-w-5xl mx-auto mt-6 flex justify-end print:hidden">
        <button 
          onClick={onReset}
          className="px-6 py-2.5 text-xs font-bold bg-surface-container-low hover:bg-surface-container-high border border-outline-variant/60 text-on-surface rounded-lg flex items-center gap-1.5 transition-all cursor-pointer shadow-sm active:scale-95"
        >
          <span className="material-symbols-outlined text-base font-bold">add_circle</span>
          Analisis Pasien Baru
        </button>
      </div>

    </section>
  );
}
