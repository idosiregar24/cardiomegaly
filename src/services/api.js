/**
 * API Service untuk Sistem Klasifikasi Kardiomegali pada ODGJ
 * 
 * File ini berfungsi sebagai jembatan antara Frontend React dengan Backend Python (FastAPI / Flask).
 * Anda dapat mengonfigurasi BASE_URL ke alamat server backend Anda.
 */

// URL backend Hugging Face Spaces (production)
export const BASE_URL = 'https://idosiregar2-cardiomegaly-backend.hf.space';


/**
 * Mengirim gambar rontgen thorax dan ID pasien ke backend Flask (ngrok) untuk dianalisis.
 * @param {File} imageFile - File gambar rontgen (.png / .jpg)
 * @param {string} idPasien - ID Pasien
 * @returns {Promise<object>} Respons JSON dari backend
 */
export const scanThorax = async (imageFile, idPasien) => {
  const formData = new FormData();
  formData.append('image', imageFile);
  formData.append('id_pasien', idPasien);

  const config = getApiConfig();
  const activeUrl = config.backendUrl || BASE_URL;

  try {
    const response = await fetch(`${activeUrl}/api/v1/scan-thorax`, {
      method: 'POST',
      headers: {
        'ngrok-skip-browser-warning': 'true' // Menghindari halaman peringatan ngrok
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Server returned status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error in scanThorax API:', error);
    throw error;
  }
};

// Simpan konfigurasi API di localStorage agar persisten
const DEFAULT_CONFIG = {
  backendUrl: 'https://idosiregar2-cardiomegaly-backend.hf.space',
  useMock: false,                       // false = gunakan backend riil HF Spaces
  selectedModel: 'DenseNet-121-CheXNet'
};

export const getApiConfig = () => {
  const saved = localStorage.getItem('cardiomegaly_config');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (parsed.selectedModel && parsed.selectedModel.includes('Maturation')) {
        localStorage.removeItem('cardiomegaly_config');
        return DEFAULT_CONFIG;
      }
      return parsed;
    } catch (e) {
      return DEFAULT_CONFIG;
    }
  }
  return DEFAULT_CONFIG;
};

export const saveApiConfig = (config) => {
  localStorage.setItem('cardiomegaly_config', JSON.stringify(config));
};

// Histori data pasien simulasi (disimpan di localStorage untuk demo)
const INITIAL_HISTORY = [
  { id: 'HK-2901', name: 'Hendra Kusuma', age: 34, gender: 'Laki-laki', date: '2026-06-02', status: 'Kardiomegali', confidence: 92.4, notes: 'ODGJ dengan riwayat pengobatan antipsikotik klorpromazin jangka panjang. Rasio Kardiotoraks (CTR) sebesar 0.58.', model: 'DenseNet-121-CheXNet' },
  { id: 'RS-1822', name: 'Ratna Sari', age: 41, gender: 'Perempuan', date: '2026-06-02', status: 'Normal', confidence: 98.1, notes: 'Hasil penambangan data klinis dan rontgen dada berada dalam rentang fisiologis normal. CTR = 0.46.', model: 'DenseNet-121-CheXNet' },
  { id: 'EP-9910', name: 'Eko Prasetyo', age: 28, gender: 'Laki-laki', date: '2026-06-01', status: 'Perlu Review', confidence: 54.8, notes: 'Kualitas gambar X-ray sedikit kabur di area apeks jantung. Disarankan pengambilan ulang gambar atau review manual oleh radiolog.', model: 'DenseNet-121-CheXNet' },
  { id: 'DL-7201', name: 'Dewi Lestari', age: 49, gender: 'Perempuan', date: '2026-05-28', status: 'Normal', confidence: 94.6, notes: 'Fungsi jantung normal, tidak ada tanda-tanda hipertrofi ventrikel kiri.', model: 'ResNet50' },
  { id: 'AS-8812', name: 'Ahmad Subarjo', age: 52, gender: 'Laki-laki', date: '2026-05-15', status: 'Normal', confidence: 89.2, notes: 'CTR = 0.48. Tidak ada kardiomegali terdeteksi.', model: 'DenseNet-121-CheXNet' },
  { id: 'SA-4011', name: 'Siti Aminah', age: 45, gender: 'Perempuan', date: '2026-05-12', status: 'Kardiomegali', confidence: 87.5, notes: 'Pasien ODGJ Schizophrenia. CTR = 0.56. Ada kecenderungan kardiomegali imbas efek samping obat antipsikotik atipikal.', model: 'DenseNet-121-CheXNet' },
  { id: 'BW-1130', name: 'Bambang Wijaya', age: 39, gender: 'Laki-laki', date: '2026-05-09', status: 'Perlu Review', confidence: 61.2, notes: 'Gejala klinis sesak nafas ringan, rontgen dada menunjukkan CTR perbatasan (0.50). Perlu review klinis tambahan.', model: 'ResNet50' }
];

export const getHistoryData = () => {
  const saved = localStorage.getItem('cardiomegaly_history');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      const isAppleData = parsed.some(item => item.id && (item.id.startsWith('AP-') || !item.gender));
      if (isAppleData) {
        localStorage.removeItem('cardiomegaly_history');
        localStorage.setItem('cardiomegaly_history', JSON.stringify(INITIAL_HISTORY));
        return INITIAL_HISTORY;
      }
      return parsed;
    } catch (e) {
      localStorage.removeItem('cardiomegaly_history');
      localStorage.setItem('cardiomegaly_history', JSON.stringify(INITIAL_HISTORY));
      return INITIAL_HISTORY;
    }
  }
  localStorage.setItem('cardiomegaly_history', JSON.stringify(INITIAL_HISTORY));
  return INITIAL_HISTORY;
};

export const saveHistoryData = (history) => {
  localStorage.setItem('cardiomegaly_history', JSON.stringify(history));
};

/**
 * 1. MENDAPATKAN STATISTIK DASHBOARD
 */
export const fetchDashboardStats = async () => {
  const config = getApiConfig();
  
  if (config.useMock) {
    // Simulasi respons backend (delay 500ms)
    await new Promise(resolve => setTimeout(resolve, 500));
    const history = getHistoryData();
    
    const total = history.length;
    const cardiomegalyCount = history.filter(h => h.status === 'Kardiomegali').length;
    const normalCount = history.filter(h => h.status === 'Normal').length;
    const reviewCount = history.filter(h => h.status === 'Perlu Review').length;
    
    return {
      totalData: 1284 + (total - INITIAL_HISTORY.length), // Data historis + data baru
      cardiomegaly: 412 + (cardiomegalyCount - 2),
      normal: 846 + (normalCount - 4),
      needReview: 26 + (reviewCount - 1),
      recentActivity: history.slice(0, 4).map(item => ({
        id: item.id,
        name: item.name,
        date: item.date,
        status: item.status
      }))
    };
  } else {
    // API INTEGRASI RIIL DENGAN BACKEND PYTHON (FastAPI/Flask)
    try {
      const response = await fetch(`${config.backendUrl}/api/dashboard-stats`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      if (!response.ok) throw new Error('Gagal mengambil statistik dari backend');
      return await response.json();
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  }
};

/**
 * 2. MENGUNGGAH FILE & MELAKUKAN PREDIKSI (INTEGRASI DEEP LEARNING)
 * 
 * Fungsi ini menangani pengiriman data rontgen dada / data klinis ke model Deep Learning Python.
 */
export const uploadAndAnalyze = async (file, patientData, onProgress) => {
  const config = getApiConfig();
  
  if (config.useMock) {
    // Simulasi proses upload dan analisis model deep learning
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      if (progress <= 90) {
        onProgress(progress);
      }
    }, 250);

    await new Promise(resolve => setTimeout(resolve, 3000));
    clearInterval(interval);
    onProgress(100);

    // Hasil klasifikasi mock acak tetapi logis
    const isCardiomegaly = Math.random() > 0.5;
    const confidence = parseFloat((80 + Math.random() * 19).toFixed(2)); // 80% - 99%
    const status = isCardiomegaly ? 'Kardiomegali' : 'Normal';
    
    // Penjelasan hasil analisis klinis terkait ODGJ
    let notes = '';
    if (isCardiomegaly) {
      notes = `Hasil klasifikasi model ${config.selectedModel} mendeteksi pembesaran jantung (Kardiomegali) dengan keyakinan ${confidence}%. Pasien ODGJ dengan riwayat pengobatan antipsikotik golongan tipikal/atipikal dosis tinggi berisiko mengalami efek samping kardiovaskuler. Disarankan pemeriksaan EKG tambahan.`;
    } else {
      notes = `Hasil klasifikasi menunjukkan siluet jantung normal (CTR < 50%) dengan keyakinan ${confidence}%. Tidak ada tanda-tanda hipertrofi ventrikel kiri. Lanjutkan pemantauan rutin efek samping kardiotoksik obat psikotropika.`;
    }

    const newResult = {
      id: `PX-${Math.floor(1000 + Math.random() * 9000)}`,
      name: patientData.name || 'Pasien Anonim',
      age: parseInt(patientData.age) || 30,
      gender: patientData.gender || 'Laki-laki',
      date: new Date().toISOString().split('T')[0],
      status: status,
      confidence: confidence,
      notes: notes,
      model: config.selectedModel
    };

    // Simpan ke histori lokal
    const history = getHistoryData();
    const updatedHistory = [newResult, ...history];
    saveHistoryData(updatedHistory);

    return newResult;
  } else {
    // API INTEGRASI RIIL DENGAN BACKEND PYTHON (HF Spaces)
    try {
      const formData = new FormData();
      formData.append('image', file);           // backend Flask pakai key 'image'
      formData.append('id_pasien', `PX-${Math.floor(1000 + Math.random() * 9000)}`); // generate ID

      onProgress(20);

      const response = await fetch(`${config.backendUrl}/api/v1/scan-thorax`, {
        method: 'POST',
        body: formData
      });

      onProgress(80);

      if (!response.ok) throw new Error(`Analisis backend gagal (status ${response.status})`);

      const result = await response.json();
      onProgress(100);

      // Mapping response backend baru → format frontend
      const isCardiomegaly = result.data.label_kardiomegali === 1;
      const confidence = parseFloat((result.data.nilai_probabilitas * 100).toFixed(2));
      const status = isCardiomegaly ? 'Kardiomegali' : 'Normal';

      let notes = '';
      if (isCardiomegaly) {
        notes = `Model ${result.data.model_info.arsitektur} mendeteksi Kardiomegali dengan keyakinan ${confidence}%. Pasien ODGJ dengan riwayat antipsikotik berisiko kardiovaskuler. Disarankan pemeriksaan EKG tambahan.`;
      } else {
        notes = `Model ${result.data.model_info.arsitektur} mendeteksi jantung Normal dengan keyakinan ${confidence}%. Tidak ada tanda hipertrofi ventrikel. Lanjutkan pemantauan rutin.`;
      }

      const newResult = {
        id: result.data.id_pasien,
        name: patientData.name || 'Pasien Anonim',
        age: parseInt(patientData.age) || 30,
        gender: patientData.gender || 'Laki-laki',
        date: new Date().toISOString().split('T')[0],
        status: status,
        confidence: confidence,
        notes: notes,
        model: result.data.model_info.arsitektur,
        gradcam: result.data.url_visualisasi_gradcam || null,
        normal_percentage: result.data.normal_percentage,
        cardiomegaly_percentage: result.data.cardiomegaly_percentage
      };

      // Simpan hasil ke riwayat lokal
      const history = getHistoryData();
      saveHistoryData([newResult, ...history]);

      return newResult;
    } catch (error) {
      console.error('Error uploading and analyzing:', error);
      throw error;
    }
  }
};

/**
 * 3. MENGHAPUS RIWAYAT PREDIKSI
 */
export const deleteHistoryItem = async (id) => {
  const config = getApiConfig();
  const history = getHistoryData();
  const filtered = history.filter(item => item.id !== id);
  saveHistoryData(filtered);

  if (!config.useMock) {
    try {
      await fetch(`${config.backendUrl}/api/history/${id}`, {
        method: 'DELETE'
      });
    } catch (e) {
      console.error("Gagal menghapus di database backend riil:", e);
    }
  }
  return true;
};
