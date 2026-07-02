import React, { useState, useRef } from 'react';
import { uploadAndAnalyze } from '../services/api';

export default function UploadInterface({ onAnalysisComplete }) {
  const [patientData, setPatientData] = useState({
    name: '',
    age: '',
    gender: 'Laki-laki'
  });
  
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [fileType, setFileType] = useState('image'); // 'image' atau 'tabular' (CSV)
  const [dragActive, setDragActive] = useState(false);
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [analysisStatus, setAnalysisStatus] = useState('');
  
  const fileInputRef = useRef(null);

  // Daftar langkah analisis simulasi
  const analysisSteps = [
    { threshold: 0, text: 'Menghubungkan ke Python Backend API...' },
    { threshold: 20, text: 'Mengunggah file citra rontgen dada...' },
    { threshold: 45, text: 'Menjalankan pra-pemrosesan citra (Histogram Equalization)...' },
    { threshold: 65, text: 'Ekstraksi fitur menggunakan arsitektur deep learning...' },
    { threshold: 85, text: 'Melakukan segmentasi batas jantung dan rongga dada...' },
    { threshold: 95, text: 'Menghitung CTR (Cardiothoracic Ratio) & skor kepercayaan...' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPatientData(prev => ({ ...prev, [name]: value }));
  };

  // Drag handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFile = (file) => {
    if (!file) return;
    setSelectedFile(file);
    
    // Tentukan tipe file secara kasar
    if (file.type.startsWith('image/')) {
      setFileType('image');
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setFileType('tabular');
      setFilePreview(null); // Tampilkan ikon dokumen saja untuk CSV/Excel
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleDropzoneClick = () => {
    fileInputRef.current.click();
  };

  const handleRemoveFile = (e) => {
    e.stopPropagation();
    setSelectedFile(null);
    setFilePreview(null);
  };

  const startAnalysis = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    setIsAnalyzing(true);
    setProgress(0);
    setAnalysisStatus('Menghubungkan ke Python Backend API...');

    try {
      const result = await uploadAndAnalyze(
        selectedFile, 
        patientData, 
        (percent) => {
          setProgress(percent);
          // Update status teks berdasarkan persentase progress
          const currentStep = analysisSteps
            .filter(step => percent >= step.threshold)
            .pop();
          if (currentStep) {
            setAnalysisStatus(currentStep.text);
          }
        }
      );
      
      // Berikan sedikit jeda visual saat 100% sebelum render hasil
      setTimeout(() => {
        setIsAnalyzing(false);
        onAnalysisComplete({ ...result, filePreview: filePreview });
      }, 500);
      
    } catch (err) {
      console.error(err);
      alert('Gagal menganalisis data. Pastikan backend Python Anda berjalan atau periksa pengaturan API.');
      setIsAnalyzing(false);
    }
  };

  return (
    <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm">
      {!isAnalyzing ? (
        <form onSubmit={startAnalysis} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Sisi Kiri: Data Demografis Pasien */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <h4 className="font-title-lg text-title-lg text-on-surface">Data Demografis Pasien ODGJ</h4>
              <p className="text-xs text-on-surface-variant">Lengkapi data pasien untuk klasifikasi model penambangan data klinis</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-on-surface mb-1.5" htmlFor="name">
                  Nama Pasien
                </label>
                <input 
                  type="text" 
                  id="name"
                  name="name"
                  value={patientData.name}
                  onChange={handleInputChange}
                  placeholder="Misal: Budi Hermawan"
                  required
                  className="w-full px-4 py-2.5 text-sm bg-surface-container-low border border-outline-variant/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-on-surface mb-1.5" htmlFor="age">
                    Umur (Tahun)
                  </label>
                  <input 
                    type="number" 
                    id="age"
                    name="age"
                    value={patientData.age}
                    onChange={handleInputChange}
                    placeholder="Misal: 35"
                    required
                    min="1"
                    max="120"
                    className="w-full px-4 py-2.5 text-sm bg-surface-container-low border border-outline-variant/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-on-surface mb-1.5" htmlFor="gender">
                    Jenis Kelamin
                  </label>
                  <select 
                    id="gender"
                    name="gender"
                    value={patientData.gender}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 text-sm bg-surface-container-low border border-outline-variant/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  >
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                </div>
              </div>
              
              <div className="p-4 bg-primary-fixed/15 rounded-xl border border-primary-fixed/20">
                <span className="text-[10px] font-bold text-primary block uppercase tracking-wider mb-1">Catatan Penelitian:</span>
                <p className="text-[11px] text-on-surface-variant leading-relaxed">
                  Studi menunjukkan pasien ODGJ memiliki peningkatan risiko penyakit kardiovaskuler akibat efek samping terapi farmakologi antipsikotik jangka panjang. Klasifikasi ini dioptimalkan untuk menyaring risiko tersebut lebih dini.
                </p>
              </div>
            </div>
          </div>
          
          {/* Sisi Kanan: Dropzone Unggah Media */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
            <div>
              <h4 className="font-title-lg text-title-lg text-on-surface">Unggah Berkas Medis</h4>
              <p className="text-xs text-on-surface-variant">Unggah citra Chest X-Ray (PNG/JPG) atau berkas rekam medis klinis (CSV)</p>
            </div>
            
            {/* Dropzone Area */}
            <div 
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={handleDropzoneClick}
              className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 relative ${
                dragActive ? 'border-primary bg-primary-fixed/10 scale-[0.99]' : 'border-outline-variant/80 hover:border-primary/60 hover:bg-surface-container-low/30'
              } h-64`}
            >
              <input 
                ref={fileInputRef}
                type="file" 
                onChange={handleFileChange}
                accept="image/*,.csv"
                className="hidden" 
              />
              
              {!selectedFile ? (
                <div className="text-center space-y-3 pointer-events-none">
                  <div className="w-14 h-14 rounded-full bg-primary-fixed/30 text-primary flex items-center justify-center mx-auto">
                    <span className="material-symbols-outlined text-3xl">upload_file</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-on-surface">Tarik &amp; lepas berkas di sini</p>
                    <p className="text-xs text-on-surface-variant mt-1">atau klik untuk menelusuri folder komputer</p>
                  </div>
                  <div className="flex gap-4 justify-center text-[10px] text-on-surface-variant">
                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-xs">image</span> X-Ray (PNG, JPG)</span>
                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-xs">description</span> Tabular (CSV)</span>
                  </div>
                </div>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center relative">
                  {/* Preview file gambar */}
                  {fileType === 'image' && filePreview ? (
                    <div className="relative w-44 h-44 rounded-lg overflow-hidden border border-outline-variant shadow-sm bg-black flex items-center justify-center">
                      <img src={filePreview} alt="Preview Rontgen" className="max-h-full max-w-full object-contain" />
                      <button 
                        onClick={handleRemoveFile}
                        className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-error text-white flex items-center justify-center shadow-md hover:bg-error-container hover:text-on-error-container transition-colors"
                      >
                        <span className="material-symbols-outlined text-sm">close</span>
                      </button>
                    </div>
                  ) : (
                    /* Preview file CSV */
                    <div className="text-center space-y-3">
                      <div className="w-16 h-16 rounded-xl bg-secondary-container/40 text-secondary flex items-center justify-center mx-auto border border-secondary/20">
                        <span className="material-symbols-outlined text-4xl">description</span>
                      </div>
                      <div className="max-w-xs">
                        <p className="text-sm font-bold text-on-surface truncate">{selectedFile.name}</p>
                        <p className="text-xs text-on-surface-variant">{(selectedFile.size / 1024).toFixed(1)} KB • File Tabular</p>
                      </div>
                      <button 
                        onClick={handleRemoveFile}
                        className="px-3 py-1 text-xs font-bold text-error border border-error/20 bg-error-container/20 rounded-lg hover:bg-error hover:text-white transition-colors cursor-pointer"
                      >
                        Hapus Berkas
                      </button>
                    </div>
                  )}
                  {fileType === 'image' && (
                    <p className="text-xs font-bold text-on-surface truncate mt-2 max-w-sm">{selectedFile.name}</p>
                  )}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-2">
              <button 
                type="button" 
                onClick={() => {
                  setSelectedFile(null);
                  setFilePreview(null);
                  setPatientData({ name: '', age: '', gender: 'Laki-laki' });
                }}
                className="px-6 py-2.5 text-sm font-bold text-on-surface hover:bg-surface-container-high rounded-lg transition-colors cursor-pointer"
              >
                Reset Form
              </button>
              <button 
                type="submit"
                disabled={!selectedFile}
                className={`px-8 py-2.5 text-sm font-bold text-white rounded-lg flex items-center gap-2 shadow-md transition-all cursor-pointer ${
                  selectedFile 
                    ? 'bg-primary hover:bg-primary-container active:scale-95' 
                    : 'bg-outline-variant/60 cursor-not-allowed text-on-surface-variant/50'
                }`}
              >
                <span className="material-symbols-outlined text-lg">biotech</span>
                Mulai Analisis Model AI
              </button>
            </div>
          </div>
          
        </form>
      ) : (
        /* UI Progress Bar Simulasi Analisis */
        <div className="py-12 flex flex-col items-center justify-center text-center max-w-md mx-auto space-y-6">
          <div className="relative w-28 h-28 flex items-center justify-center">
            {/* Spinner outer */}
            <div className="absolute inset-0 rounded-full border-4 border-primary-fixed/20 border-t-primary animate-spin"></div>
            {/* Inner pulsing icon */}
            <div className="w-20 h-20 rounded-full bg-primary-fixed/15 flex items-center justify-center animate-pulse">
              <span className="material-symbols-outlined text-4xl text-primary">neuroscience</span>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-headline-md text-xl font-bold text-on-surface animate-pulse">Memproses Analisis AI...</h4>
            <p className="text-xs font-semibold text-primary h-6 transition-all duration-300">
              {analysisStatus}
            </p>
          </div>

          {/* Progress bar container */}
          <div className="w-full space-y-1.5">
            <div className="flex justify-between text-xs text-on-surface-variant">
              <span>Progress Klasifikasi</span>
              <span className="font-bold text-primary">{progress}%</span>
            </div>
            <div className="h-3 w-full bg-outline-variant/30 rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary rounded-full transition-all duration-300 ease-out" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          <div className="text-[10px] text-on-surface-variant bg-surface-container-low p-3 rounded-lg border border-outline-variant/50">
            Prediksi dilakukan oleh model deep learning di backend Python (FastAPI). Keamanan data medis terenkripsi penuh.
          </div>
        </div>
      )}
    </section>
  );
}
