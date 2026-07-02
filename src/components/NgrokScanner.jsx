import { useEffect, useMemo, useRef, useState } from 'react';
import { BASE_URL, getApiConfig, scanThorax } from '../services/api';
import {
  insertClassificationLogAfterReview,
  uploadClassificationImage,
} from '../services/supabaseService';
import { GButton as Button, GModal as MedicalModal, GBadge as StatusBadge } from './medical/ClinicalUI';

const CONFIDENCE_THRESHOLD = 70;
const DIAGNOSIS_OPTIONS = ['Normal', 'Kardiomegali'];

const normalizeResult = (response, fallbackPatientId) => {
  const data = response?.data || response || {};
  const prediction =
    data.ai_prediction ||
    data.prediction ||
    (Number(data.label_kardiomegali) === 1 ? 'Kardiomegali' : 'Normal');

  const rawConfidence = data.confidence_score ?? data.confidence ?? data.nilai_probabilitas ?? 0;
  const confidence = Number(rawConfidence) <= 1 ? Number(rawConfidence) * 100 : Number(rawConfidence);

  return {
    patient_identifier: data.patient_identifier || data.id_pasien || fallbackPatientId,
    image_url: data.image_url || null,
    gradcam_url: data.gradcam_url || data.url_visualisasi_gradcam || null,
    ai_prediction: prediction,
    confidence_score: Number(confidence.toFixed(2)),
    normal_percentage:
      data.normal_percentage ??
      (prediction === 'Normal' ? Number(confidence.toFixed(2)) : Number((100 - confidence).toFixed(2))),
    cardiomegaly_percentage:
      data.cardiomegaly_percentage ??
      (prediction === 'Kardiomegali' ? Number(confidence.toFixed(2)) : Number((100 - confidence).toFixed(2))),
  };
};

const buildClinicalKnowledge = (result, finalDiagnosis) => {
  if (!result) return '';

  const diagnosis = finalDiagnosis || result.ai_prediction;
  if (diagnosis === 'Kardiomegali') {
    return `Pasien dengan ID ${result.patient_identifier} terdeteksi memiliki status Kardiomegali (Pembesaran Jantung). Rasio Jantung (Cardiothoracic Ratio/CTR) terindikasi melebihi batas normal. Disarankan untuk segera menjadwalkan pemeriksaan Ekokardiografi (ECHO) dan konsultasi lanjutan dengan spesialis kardiologi guna penanganan lebih lanjut.`;
  }

  return `Pasien dengan ID ${result.patient_identifier} menunjukkan status Normal. Struktur dan ukuran jantung berada dalam batas fisiologis yang wajar. Tidak diperlukan tindakan darurat saat ini.`;
};

function FileDropzone({ filePreview, selectedFile, dragActive, inputRef, onDrop, onDrag, onFile, onRemove }) {
  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragEnter={onDrag}
      onDragOver={onDrag}
      onDragLeave={onDrag}
      onDrop={onDrop}
      className={`flex min-h-[320px] cursor-pointer items-center justify-center rounded-xl border-2 border-dashed p-6 transition-all ${
        dragActive ? 'border-[#1A73E8] bg-[#E8F0FE]' : 'border-[#DADCE0] bg-[#F8F9FA] hover:border-[#1A73E8] hover:bg-white'
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg"
        onChange={(event) => onFile(event.target.files?.[0])}
        className="hidden"
      />

      {!selectedFile ? (
        <div className="pointer-events-none text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-xl bg-white text-[#1A73E8] shadow-sm border border-[#DADCE0]">
            <span className="material-symbols-outlined text-3xl">upload_file</span>
          </div>
          <h3 className="mt-4 text-sm font-extrabold text-[#202124]">Unggah Citra X-Ray Thorax</h3>
          <p className="mt-1 text-xs text-[#80868B]">Gunakan format PNG, JPG, atau JPEG.</p>
        </div>
      ) : (
        <div className="text-center">
          <div className="mx-auto flex h-48 w-48 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-950">
            {filePreview && <img src={filePreview} alt="Preview X-Ray" className="max-h-full max-w-full object-contain" />}
          </div>
          <p className="mt-3 max-w-sm truncate text-xs font-bold text-[#202124]">{selectedFile.name}</p>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onRemove();
            }}
            className="mt-2 rounded-lg border border-[#F5C6C3] bg-[#FCE8E6] px-3 py-1.5 text-xs font-bold text-[#D93025] hover:bg-[#F5C6C3] transition-colors"
          >
            Hapus Berkas
          </button>
        </div>
      )}
    </div>
  );
}

function ResultPanel({
  result,
  filePreview,
  finalDiagnosis,
  setFinalDiagnosis,
  validatedBy,
  setValidatedBy,
  isSaving,
  onSaveAndReset,
  error,
}) {
  const isLowConfidence = result.confidence_score < CONFIDENCE_THRESHOLD;
  const doctorValidation = finalDiagnosis === result.ai_prediction;
  const knowledge = buildClinicalKnowledge(result, finalDiagnosis);

  const patientName = result.patient_name || '-';
  const patientAge = result.patient_age ?? '-';

  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-12 animate-fade-in">
      <section className="rounded-xl border border-[#DADCE0] bg-white p-5 shadow-[0_1px_4px_rgba(60,64,67,0.08)] xl:col-span-5">
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#5F6368]">Citra Pemeriksaan</p>
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <p className="mb-2 text-xs font-bold text-[#3C4043]">X-Ray Thorax</p>
            <div className="flex aspect-square items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-950">
              {filePreview && <img src={filePreview} alt="X-Ray pasien" className="max-h-full max-w-full object-contain" />}
            </div>
          </div>
          <div>
            <p className="mb-2 text-xs font-bold text-[#3C4043]">Peta Atensi Klinis (Grad-CAM)</p>
            <div className="flex aspect-square items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-950">
              {result.gradcam_url ? (
                <img src={result.gradcam_url} alt="Peta atensi klinis" className="max-h-full max-w-full object-contain" />
              ) : (
                <p className="px-4 text-center text-xs text-[#80868B]">Visualisasi belum tersedia dari sistem komputasi.</p>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-5 xl:col-span-7">
        <div className="rounded-xl border border-[#DADCE0] bg-white p-5 shadow-[0_1px_4px_rgba(60,64,67,0.08)]">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#5F6368]">Hasil Analisis Digital</p>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <StatusBadge status={result.ai_prediction} />
                <span className="text-2xl font-extrabold text-[#202124]">{result.confidence_score.toFixed(2)}%</span>
              </div>
              <p className="mt-2 text-xs text-[#5F6368]">
                Nama Pasien: <span className="font-bold text-[#202124]">{patientName}</span>
              </p>
              <p className="mt-1 text-xs text-[#5F6368]">
                Umur: <span className="font-bold text-[#202124]">{patientAge === '-' ? '-' : `${patientAge} Tahun`}</span>
              </p>
              <p className="mt-2 text-xs text-[#5F6368]">
                ID Pasien: <span className="font-mono font-bold text-[#202124]">{result.patient_identifier}</span>
              </p>
            </div>
            {isLowConfidence && (
              <span className="rounded-full border border-[#FDE68A] bg-[#FEF7E0] px-3 py-1 text-[11px] font-bold text-[#9B6D00] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[13px]" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
                Perlu tinjauan manual
              </span>
            )}
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-lg border border-[#A8D5B5] bg-[#E6F4EA] p-4">
              <p className="text-[10px] font-bold uppercase tracking-wide text-[#1E7E34]">Normal</p>
              <p className="mt-1 text-xl font-extrabold text-[#1E8E3E]">{Number(result.normal_percentage).toFixed(2)}%</p>
              <div className="mt-2 h-1.5 rounded-full bg-[#A8D5B5] overflow-hidden">
                <div className="h-full rounded-full bg-[#1E8E3E]" style={{ width: `${result.normal_percentage}%` }} />
              </div>
            </div>
            <div className="rounded-lg border border-[#F5C6C3] bg-[#FCE8E6] p-4">
              <p className="text-[10px] font-bold uppercase tracking-wide text-[#C5221F]">Kardiomegali</p>
              <p className="mt-1 text-xl font-extrabold text-[#D93025]">{Number(result.cardiomegaly_percentage).toFixed(2)}%</p>
              <div className="mt-2 h-1.5 rounded-full bg-[#F5C6C3] overflow-hidden">
                <div className="h-full rounded-full bg-[#D93025]" style={{ width: `${result.cardiomegaly_percentage}%` }} />
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-[#DADCE0] bg-white p-5 shadow-[0_1px_4px_rgba(60,64,67,0.08)]">
          <div className="flex items-center gap-2 mb-3">
            <span className="material-symbols-outlined text-[16px] text-[#1A73E8]" style={{ fontVariationSettings: "'FILL' 1" }}>psychology</span>
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#5F6368]">Sistem Pengetahuan & Rekomendasi Klinis</p>
          </div>
          <div className="border-l-4 border-[#1A73E8] pl-4 bg-[#F8F9FA] rounded-r-lg py-3 pr-3">
            <p className="text-sm leading-7 text-[#3C4043]">{knowledge}</p>
          </div>
        </div>

        <div className="rounded-xl border border-[#DADCE0] bg-white p-5 shadow-[0_1px_4px_rgba(60,64,67,0.08)]">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#5F6368]">Validasi Dokter</p>
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-bold text-[#3C4043]" htmlFor="finalDiagnosis">Hasil validasi</label>
              <select
                id="finalDiagnosis"
                value={finalDiagnosis}
                onChange={(event) => setFinalDiagnosis(event.target.value)}
                className="w-full rounded-lg border border-[#DADCE0] bg-[#F8F9FA] px-3 py-2.5 text-sm font-bold text-[#202124] outline-none focus:border-[#1A73E8] focus:bg-white focus:shadow-[0_0_0_3px_rgba(26,115,232,0.1)] transition-all"
              >
                {DIAGNOSIS_OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold text-[#3C4043]" htmlFor="validatedBy">Dokter pemeriksa</label>
              <input
                id="validatedBy"
                type="text"
                value={validatedBy}
                onChange={(event) => setValidatedBy(event.target.value)}
                className="w-full rounded-lg border border-[#DADCE0] bg-[#F8F9FA] px-3 py-2.5 text-sm font-semibold text-[#202124] outline-none focus:border-[#1A73E8] focus:bg-white focus:shadow-[0_0_0_3px_rgba(26,115,232,0.1)] transition-all"
              />
            </div>
          </div>
          <div className={`mt-4 rounded-lg border p-3 text-xs font-semibold flex items-center gap-2 ${
            doctorValidation
              ? 'border-[#A8D5B5] bg-[#E6F4EA] text-[#1E7E34]'
              : 'border-[#FDE68A] bg-[#FEF7E0] text-[#9B6D00]'
          }`}>
            <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              {doctorValidation ? 'check_circle' : 'edit_note'}
            </span>
            Status validasi: <span className="font-bold">
              {doctorValidation ? 'Sesuai dengan hasil analisis digital' : 'Dikoreksi oleh dokter'}
            </span>
          </div>
          {error && <div className="mt-4 rounded-lg border border-[#F5C6C3] bg-[#FCE8E6] p-3 text-xs font-bold text-[#D93025] flex items-center gap-2">
            <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>error</span>
            {error}
          </div>}
          <Button onClick={onSaveAndReset} disabled={isSaving} className="mt-5 w-full">
            {isSaving ? 'Menyimpan pemeriksaan...' : 'Lakukan Analisis Baru'}
          </Button>
        </div>
      </section>
    </div>
  );
}

export default function NgrokScanner({ initialResult = null, onClearInitialResult }) {
  const apiConfig = useMemo(() => getApiConfig(), []);
  const activeBackendUrl = apiConfig.backendUrl || BASE_URL;
  const fileInputRef = useRef(null);

  const [patientIdentifier, setPatientIdentifier] = useState('');
  const [patientName, setPatientName] = useState('');
  const [patientAge, setPatientAge] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [result, setResult] = useState(null);
  const [finalDiagnosis, setFinalDiagnosis] = useState('Normal');
  const [validatedBy, setValidatedBy] = useState('Dr. Budi Santoso, Sp.Rad');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [showLowConfidenceModal, setShowLowConfidenceModal] = useState(false);

  useEffect(() => () => {
    if (filePreview) URL.revokeObjectURL(filePreview);
  }, [filePreview]);

  const resetWorkflow = () => {
    if (filePreview) URL.revokeObjectURL(filePreview);
    setPatientIdentifier('');
    setPatientName('');
    setPatientAge('');
    setSelectedFile(null);
    setFilePreview(null);
    setDragActive(false);
    setResult(null);
    setFinalDiagnosis('Normal');
    setError('');
    setShowLowConfidenceModal(false);
  };

  const handleFile = (file) => {
    if (!file) return;
    const extension = file.name.split('.').pop()?.toLowerCase();
    const valid = file.type.startsWith('image/') || ['png', 'jpg', 'jpeg'].includes(extension);

    if (!valid) {
      setError('Berkas harus berupa citra PNG, JPG, atau JPEG.');
      return;
    }

    if (filePreview) URL.revokeObjectURL(filePreview);
    setSelectedFile(file);
    setFilePreview(URL.createObjectURL(file));
    setError('');
  };

  const handleDrag = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(event.type === 'dragenter' || event.type === 'dragover');
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(false);
    handleFile(event.dataTransfer.files?.[0]);
  };

  const handleAnalyze = async (event) => {
    event.preventDefault();
    setError('');

    if (!patientIdentifier.trim()) {
      setError('ID pasien wajib diisi.');
      return;
    }

    if (!patientName.trim()) {
      setError('Nama pasien wajib diisi.');
      return;
    }

    const parsedAge = Number(patientAge);
    if (!Number.isFinite(parsedAge) || parsedAge < 0 || parsedAge > 120) {
      setError('Umur harus berupa angka antara 0-120.');
      return;
    }

    if (!selectedFile) {
      setError('Unggah citra X-Ray terlebih dahulu.');
      return;
    }

    setIsAnalyzing(true);

    try {
      const response = await scanThorax(selectedFile, patientIdentifier.trim());
      const normalized = normalizeResult(response, patientIdentifier.trim());

      setResult({
        ...normalized,
        patient_name: patientName.trim(),
        patient_age: parsedAge,
      });
      setFinalDiagnosis(normalized.ai_prediction);

      if (normalized.confidence_score < CONFIDENCE_THRESHOLD) {
        setShowLowConfidenceModal(true);
      }
    } catch (err) {
      console.error(err);
      setError('Analisis radiologi belum berhasil. Periksa koneksi backend dan endpoint pemeriksaan.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSaveAndReset = async () => {
    if (!result || !selectedFile) return;

    setError('');
    if (!validatedBy.trim()) {
      setError('Nama dokter pemeriksa wajib diisi.');
      return;
    }

    setIsSaving(true);
    try {
      const imageUrl = result.image_url || await uploadClassificationImage(selectedFile, result.patient_identifier);

      await insertClassificationLogAfterReview({
        patient_identifier: result.patient_identifier,
        patient_name: result.patient_name || patientName.trim() || null,
        patient_age: result.patient_age ?? (patientAge === '' ? null : Number(patientAge)),
        image_url: imageUrl,
        ai_prediction: result.ai_prediction,
        confidence_score: result.confidence_score,
        doctor_validation: finalDiagnosis === result.ai_prediction,
        validated_by: validatedBy.trim(),
        validated_at: new Date().toISOString(),
      });

      resetWorkflow();
    } catch (err) {
      console.error(err);
      setError(err.message || 'Pencatatan ke Supabase belum berhasil.');
    } finally {
      setIsSaving(false);
    }
  };

  if (initialResult && !result && !isAnalyzing) {
    return (
      <section className="space-y-5 animate-fade-in">
        <Button variant="secondary" onClick={onClearInitialResult}>
          <span className="material-symbols-outlined text-base">arrow_back</span>
          Kembali ke Form Pemeriksaan
        </Button>
        <div className="rounded-2xl border border-[#DADCE0] bg-white p-6 shadow-[0_1px_4px_rgba(60,64,67,0.08)]">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#5F6368]">Detail Pemeriksaan</p>
              <h2 className="mt-2 text-3xl font-extrabold text-[#202124]" style={{ fontFamily: "'Hanken Grotesk', system-ui" }}>{initialResult.patientId}</h2>
              <p className="mt-2 text-sm leading-7 text-[#5F6368]">{buildClinicalKnowledge({
                patient_identifier: initialResult.patientId,
                ai_prediction: initialResult.status,
              }, initialResult.status)}</p>
            </div>
          <StatusBadge status={initialResult.status} />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
          <div className="rounded-xl border border-[#DADCE0] bg-white p-5 shadow-[0_1px_4px_rgba(60,64,67,0.08)] lg:col-span-5">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#5F6368]">Validasi</p>
            <dl className="mt-4 space-y-3 text-xs">
              <div className="flex justify-between gap-4"><dt className="text-slate-500">Keyakinan</dt><dd className="font-bold text-[#102235]">{Number(initialResult.confidence).toFixed(2)}%</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-slate-500">Status Validasi</dt><dd className="font-bold text-[#102235]">{initialResult.doctorValidation ? 'Sesuai' : 'Dikoreksi'}</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-slate-500">Dokter</dt><dd className="font-bold text-[#102235]">{initialResult.validatedBy || '-'}</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-slate-500">Waktu</dt><dd className="font-bold text-[#102235]">{initialResult.validatedAt ? new Date(initialResult.validatedAt).toLocaleString('id-ID') : '-'}</dd></div>
            </dl>
          </div>
          <div className="rounded-xl border border-[#DADCE0] bg-white p-5 shadow-[0_1px_4px_rgba(60,64,67,0.08)] lg:col-span-7">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#5F6368]">Citra Tersimpan</p>
            <div className="mt-4 flex aspect-video items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-950">
              {initialResult.imageUrl ? (
                <img src={initialResult.imageUrl} alt="X-Ray tersimpan" className="max-h-full max-w-full object-contain" />
              ) : (
                <p className="text-xs text-slate-400">Citra belum tersedia.</p>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-6 animate-fade-in">
      <MedicalModal isOpen={showLowConfidenceModal} onClose={() => setShowLowConfidenceModal(false)}>
        <p className="text-sm leading-7 text-slate-700">
          Konfirmasi Manual Diperlukan: Tingkat keyakinan sistem berada di bawah ambang batas standar.
          Mohon lakukan tinjauan manual dan pilih hasil validasi yang benar.
        </p>
        <Button className="mt-5 w-full" onClick={() => setShowLowConfidenceModal(false)}>
          Lanjutkan Validasi
        </Button>
      </MedicalModal>

      {!result ? (
        <>
          <div className="overflow-hidden rounded-2xl text-white" style={{ background: 'linear-gradient(135deg, #1A73E8 0%, #0D47A1 100%)', boxShadow: '0 4px 20px rgba(26,115,232,0.25)' }}>
            <div className="p-7 md:p-8">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em]" style={{ color: 'rgba(255,255,255,0.7)' }}>Alur Pemeriksaan Radiologi · Sistem Komputasi CNN</p>
              <h2 className="mt-3 max-w-3xl text-3xl font-extrabold tracking-tight md:text-4xl" style={{ fontFamily: "'Hanken Grotesk', system-ui" }}>
                Unggah X-Ray Thorax & Dapatkan Ringkasan Klinis Terstruktur
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-7" style={{ color: 'rgba(255,255,255,0.8)' }}>
                Sistem Analisis Digital membantu dokter membaca status kardiomegali, menampilkan tingkat keyakinan, dan menyusun rekomendasi klinis awal secara otomatis.
              </p>
            </div>
          </div>

          <form onSubmit={handleAnalyze} className="grid grid-cols-1 gap-5 xl:grid-cols-12">
            <section className="rounded-xl border border-[#DADCE0] bg-white p-5 shadow-[0_1px_4px_rgba(60,64,67,0.08)] xl:col-span-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#5F6368]">Data Pasien</p>

              <label className="mt-5 block text-xs font-bold text-[#3C4043]" htmlFor="patientIdentifier">
                ID Pasien / No. Rekam Medis
              </label>
              <input
                id="patientIdentifier"
                value={patientIdentifier}
                onChange={(event) => setPatientIdentifier(event.target.value)}
                placeholder="Contoh: RM-2026-001"
                className="mt-1.5 w-full rounded-lg border border-[#DADCE0] bg-[#F8F9FA] px-4 py-3 text-sm font-semibold text-[#202124] outline-none focus:border-[#1A73E8] focus:bg-white focus:shadow-[0_0_0_3px_rgba(26,115,232,0.1)] transition-all"
              />

              <label className="mt-5 block text-xs font-bold text-[#3C4043]" htmlFor="patientName">
                Nama Pasien
              </label>
              <input
                id="patientName"
                value={patientName}
                onChange={(event) => setPatientName(event.target.value)}
                placeholder="Contoh: Budi Hermawan"
                className="mt-1.5 w-full rounded-lg border border-[#DADCE0] bg-[#F8F9FA] px-4 py-3 text-sm font-semibold text-[#202124] outline-none focus:border-[#1A73E8] focus:bg-white focus:shadow-[0_0_0_3px_rgba(26,115,232,0.1)] transition-all"
              />

              <label className="mt-5 block text-xs font-bold text-[#3C4043]" htmlFor="patientAge">
                Umur
              </label>
              <input
                id="patientAge"
                type="number"
                inputMode="numeric"
                value={patientAge}
                onChange={(event) => setPatientAge(event.target.value)}
                placeholder="0 - 120"
                className="mt-1.5 w-full rounded-lg border border-[#DADCE0] bg-[#F8F9FA] px-4 py-3 text-sm font-semibold text-[#202124] outline-none focus:border-[#1A73E8] focus:bg-white focus:shadow-[0_0_0_3px_rgba(26,115,232,0.1)] transition-all"
                min="0"
                max="120"
              />
              <div className="mt-5 rounded-lg border border-[#DADCE0] bg-[#F8F9FA] p-4">
                <p className="text-[10px] font-bold uppercase tracking-wide text-[#5F6368] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[12px] text-[#80868B]">link</span>
                  Endpoint Analisis
                </p>
                <p className="mt-2 break-all font-mono text-[10px] text-[#5F6368]">{activeBackendUrl}/api/v1/scan-thorax</p>
              </div>
              {error && <div className="mt-4 rounded-lg border border-[#F5C6C3] bg-[#FCE8E6] p-3 text-xs font-bold text-[#D93025] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[13px]" style={{ fontVariationSettings: "'FILL' 1" }}>error</span>{error}
              </div>}
              <div className="mt-6 flex gap-3">
                <Button type="button" variant="secondary" onClick={resetWorkflow}>Reset</Button>
                <Button type="submit" disabled={isAnalyzing || !selectedFile || !patientIdentifier.trim()}>
                  {isAnalyzing ? 'Memproses...' : 'Lakukan Analisis'}
                </Button>
              </div>
            </section>

            <section className="xl:col-span-8">
              <FileDropzone
                filePreview={filePreview}
                selectedFile={selectedFile}
                dragActive={dragActive}
                inputRef={fileInputRef}
                onDrop={handleDrop}
                onDrag={handleDrag}
                onFile={handleFile}
                onRemove={() => {
                  if (filePreview) URL.revokeObjectURL(filePreview);
                  setSelectedFile(null);
                  setFilePreview(null);
                }}
              />
            </section>
          </form>
        </>
      ) : (
        <ResultPanel
          result={result}
          filePreview={filePreview}
          finalDiagnosis={finalDiagnosis}
          setFinalDiagnosis={setFinalDiagnosis}
          validatedBy={validatedBy}
          setValidatedBy={setValidatedBy}
          isSaving={isSaving}
          onSaveAndReset={handleSaveAndReset}
          error={error}
        />
      )}
    </section>
  );
}
