/**
 * locales/id.js — Kamus Bahasa Indonesia (default)
 */

const id = {
  // ──────────────────────────────────────────
  // UMUM / GLOBAL
  // ──────────────────────────────────────────
  lang:          'ID',
  langFull:      'Indonesia',
  langSwitch:    'English',

  appName:       'Kardiomegali ODGJ',
  institution:   'RSJ Tampan Riau',
  systemName:    'Sistem Analisis Digital',

  save:          'Simpan',
  cancel:        'Batal',
  close:         'Tutup',
  back:          'Kembali',
  next:          'Lanjut',
  reset:         'Reset',
  detail:        'Detail',
  viewAll:       'Lihat Semua',
  loading:       'Memuat data...',
  noData:        'Belum ada data pemeriksaan.',
  error:         'Terjadi kesalahan.',
  success:       'Berhasil disimpan!',
  status:        'Status',
  date:          'Tanggal',
  action:        'Aksi',

  // ──────────────────────────────────────────
  // SIDEBAR NAV
  // ──────────────────────────────────────────
  nav_dashboard:  'Dashboard',
  nav_upload:     'Unggah & Analisis',
  nav_history:    'Rekam Medis',
  nav_settings:   'Pengaturan',
  nav_exit:       'Keluar ke Portal',

  nav_dashboard_desc:  'Ringkasan & Statistik',
  nav_upload_desc:     'Analisis Citra Rontgen',
  nav_history_desc:    'Riwayat Pasien',
  nav_settings_desc:   'Konfigurasi Sistem',

  storage:        'Penyimpanan',
  storageUsed:    '1.5 TB dari 2 TB digunakan',
  onlineStatus:   'Online',

  // ──────────────────────────────────────────
  // HEADER
  // ──────────────────────────────────────────
  header_dashboard:   'Dashboard Analitik Kardiomegali',
  header_upload:      'Proses Data & Analisis CTR',
  header_history:     'Riwayat Rekam Medis Pasien',
  header_settings:    'Pengaturan Sistem & Konfigurasi',

  header_desc_dashboard:   'Ringkasan statistik & analisis terkini',
  header_desc_upload:      'Unggah & proses citra rontgen dada pasien',
  header_desc_history:     'Riwayat rekam medis dan data pasien',
  header_desc_settings:    'Konfigurasi endpoint API & sistem komputasi',

  notifications:      'Notifikasi Terbaru',
  notifClose:         'Tutup',
  notifViewAll:       'Lihat Semua Notifikasi →',
  notifEmpty:         'Tidak ada notifikasi baru.',

  notif1:   'Analisis selesai: Pasien #HK-2901 terdeteksi Kardiomegali.',
  notif2:   'Dr. Budi, mohon review hasil klasifikasi pasien #EP-9910.',
  notif3:   'Koneksi API Python Backend berhasil tersambung.',

  time_10min:  '10 mnt lalu',
  time_1h:     '1 jam lalu',
  time_2h:     '2 jam lalu',

  // ──────────────────────────────────────────
  // PUBLIC PORTAL (LANDING PAGE)
  // ──────────────────────────────────────────
  pp_badge:         'Sistem Pendukung Keputusan Medis · RSJ Tampan Riau',
  pp_hero_title1:   'Klasifikasi Kondisi',
  pp_hero_title2:   'Kardiomegali',
  pp_hero_title3:   'Pasien ODGJ Berbasis Morfometri Citra Thorax',
  pp_hero_subtitle: 'Sistem Komputasi berbasis {arch} untuk mendeteksi pembesaran jantung melalui perhitungan Cardiothoracic Ratio (CTR) secara instan dan presisi.',
  pp_cta_analyze:   'Mulai Analisis Thorax',
  pp_cta_learn:     'Pelajari Sistem',
  pp_scroll:        'Gulir ke bawah',

  pp_stat_arch:     'Arsitektur Sistem',
  pp_stat_time:     'Waktu Komputasi',
  pp_stat_acc:      'Akurasi Sistem',
  pp_stat_res:      'Resolusi Input',

  pp_nav_home:   'Beranda',
  pp_nav_about:  'Tentang',
  pp_nav_char:   'Karakteristik',
  pp_nav_flow:   'Arsitektur',
  pp_nav_team:   'Tim',
  pp_admin:      'Panel Admin',

  pp_about_label:    'Tentang Sistem',
  pp_about_title:    'Sistem Analisis Digital Berbasis Komputasi Klinis',
  pp_about_subtitle: 'Mengintegrasikan citra rontgen thorax dengan algoritma Sistem Komputasi untuk mendukung keputusan klinis dokter RSJ Tampan Riau secara akurat dan efisien.',

  pp_stat_total:   'Total Pemeriksaan',
  pp_stat_acc2:    'Akurasi Sistem',
  pp_stat_class:   'Kategori Diagnosis',
  pp_stat_speed:   'Waktu Analisis',

  pp_feat1_title:  'Klasifikasi CTR Otomatis',
  pp_feat1_desc:   'Menghitung Cardiothoracic Ratio (CTR) secara otomatis dari citra X-Ray thorax menggunakan Sistem Komputasi berbasis CNN.',
  pp_feat2_title:  'Akurasi Sistem: 86.5%',
  pp_feat2_desc:   'Divalidasi langsung dari rekam medis dan diagnosis historis dokter RSJ Tampan Riau menggunakan arsitektur DenseNet-121.',
  pp_feat3_title:  'Analisis < 0.5 Detik',
  pp_feat3_desc:   'Waktu komputasi yang sangat cepat memungkinkan dokter mendapatkan hasil analisis digital secara instan di ruang pemeriksaan.',
  pp_feat4_title:  'Data Medis Terlindungi',
  pp_feat4_desc:   'Seluruh rekam medis pasien tersimpan dengan aman di Supabase, dilengkapi enkripsi dan audit log untuk kepatuhan regulasi.',

  pp_char_label:    'Karakteristik Data',
  pp_char_title:    'Ambang Batas & Kategori Diagnosis',
  pp_char_subtitle: 'Dua kelas diagnosis berbasis nilai Cardiothoracic Ratio (CTR) yang ditetapkan oleh tim medis RSJ Tampan Riau.',

  pp_flow_label:    'Arsitektur Sistem',
  pp_flow_title:    'Metodologi & Arsitektur Sistem AI',
  pp_flow_subtitle: 'Detail teknis pipeline: persiapan data, perancangan DenseNet121, pengujian model, hingga integrasi backend Flask & frontend React.',

  pp_team_label:    'Tim Peneliti',
  pp_team_title:    'Kelompok Kardiomegali',
  pp_team_subtitle: 'Mahasiswa Sistem Informasi Politeknik Caltex Riau yang mengembangkan sistem ini sebagai proyek Data Mining.',

  pp_cta_label:     'Mulai Sekarang',
  pp_cta_title:     'Siap Melakukan Analisis Thorax Pasien?',
  pp_cta_subtitle:  'Masuk ke Panel Admin untuk mengunggah citra X-Ray dan mendapatkan hasil analisis digital secara instan.',
  pp_cta_btn:       'Buka Panel Admin',

  pp_footer_brand:   'Sistem Komputasi berbasis CNN untuk deteksi Kardiomegali pada pasien ODGJ di RSJ Tampan Riau.',
  pp_footer_nav:     'Navigasi',
  pp_footer_spec:    'Spesifikasi Sistem',
  pp_footer_inst:    'Institusi',
  pp_footer_group:   'Kelompok Kardiomegali',
  pp_footer_copy:    '© 2026 RSJ Tampan Riau · Politeknik Caltex Riau · Kelompok Kardiomegali',
  pp_footer_by:      'Didukung oleh',

  // ──────────────────────────────────────────
  // DASHBOARD
  // ──────────────────────────────────────────
  db_hero_label:    'Pusat Analisis Radiologi · RSJ Tampan Riau',
  db_hero_title:    'Dashboard Klinis Pemantauan Kardiomegali',
  db_hero_subtitle: 'Ringkasan pemeriksaan, distribusi temuan, dan status validasi dokter ditarik langsung dari Supabase.',
  db_readiness:     'Kesiapan Tinjauan Dokter',
  db_validated:     'hasil tervalidasi sesuai',
  db_total:         'dari {n} total pemeriksaan tersimpan',

  db_metric_total:    'Total Pemeriksaan',
  db_metric_normal:   'Status Normal',
  db_metric_cardi:    'Kardiomegali',
  db_metric_review:   'Perlu Tinjauan',

  db_metric_total_desc:   'Jumlah pemeriksaan tersimpan di Supabase.',
  db_metric_normal_desc:  'Temuan dalam batas fisiologis wajar.',
  db_metric_cardi_desc:   'Temuan yang membutuhkan tindak lanjut.',
  db_metric_review_desc:  'Keyakinan rendah atau koreksi dokter.',

  db_chart_time:     'Total Pemeriksaan dari Waktu ke Waktu',
  db_chart_time_sub: 'Dikelompokkan per bulan berdasarkan tanggal pencatatan.',
  db_chart_dist:     'Distribusi Temuan',
  db_chart_dist_sub: 'Perbandingan hasil Normal dan Kardiomegali.',
  db_chart_valid:    'Akurasi Validasi Dokter',
  db_chart_valid_sub:'Jumlah hasil sesuai dan hasil yang dikoreksi.',
  db_chart_exam:     'Pemeriksaan',
  db_chart_agree:    'Sesuai',
  db_chart_correct:  'Dikoreksi',

  db_recent_title:  'Log Pasien Terbaru',
  db_recent_sub:    'Data terbaru dari tabel classification_logs.',
  db_col_id:        'ID Pasien',
  db_col_date:      'Tanggal',
  db_col_conf:      'Keyakinan',
  db_col_status:    'Status',
  db_col_action:    'Aksi',

  // ──────────────────────────────────────────
  // SCANNER / UPLOAD
  // ──────────────────────────────────────────
  scan_banner_label:    'Alur Pemeriksaan Radiologi · Sistem Komputasi CNN',
  scan_banner_title:    'Unggah X-Ray Thorax & Dapatkan Ringkasan Klinis Terstruktur',
  scan_banner_subtitle: 'Sistem Analisis Digital membantu dokter membaca status kardiomegali, menampilkan tingkat keyakinan, dan menyusun rekomendasi klinis awal secara otomatis.',

  scan_patient_data:    'Data Pasien',
  scan_patient_id:      'ID Pasien / No. Rekam Medis',
  scan_patient_id_ph:   'Contoh: RM-2026-001',
  scan_patient_name:    'Nama Pasien',
  scan_patient_name_ph: 'Contoh: Budi Hermawan',
  scan_patient_age:     'Umur',
  scan_patient_age_ph:  '0 - 120',
  scan_endpoint:        'Endpoint Analisis',
  scan_analyze:         'Lakukan Analisis',
  scan_processing:      'Memproses...',
  scan_reset:           'Reset',

  scan_dropzone_title:  'Unggah Citra X-Ray Thorax',
  scan_dropzone_sub:    'Gunakan format PNG, JPG, atau JPEG.',
  scan_remove:          'Hapus Berkas',

  scan_result_image:    'Citra Pemeriksaan',
  scan_xray:            'X-Ray Thorax',
  scan_gradcam:         'Peta Atensi Klinis (Grad-CAM)',
  scan_no_gradcam:      'Visualisasi belum tersedia dari sistem komputasi.',
  scan_result_label:    'Hasil Analisis Digital',
  scan_patient_label:   'Nama Pasien',
  scan_age_label:       'Umur',
  scan_id_label:        'ID Pasien',
  scan_year:            'Tahun',
  scan_low_conf:        'Perlu tinjauan manual',

  scan_knowledge_title: 'Sistem Pengetahuan & Rekomendasi Klinis',
  scan_valid_title:     'Validasi Dokter',
  scan_valid_result:    'Hasil validasi',
  scan_valid_doctor:    'Dokter pemeriksa',
  scan_valid_match:     'Sesuai dengan hasil analisis digital',
  scan_valid_corrected: 'Dikoreksi oleh dokter',
  scan_save:            'Lakukan Analisis Baru',
  scan_saving:          'Menyimpan pemeriksaan...',

  scan_modal_title:     'Konfirmasi Manual Diperlukan',
  scan_modal_sub:       'Tinjauan dokter dibutuhkan sebelum pencatatan.',
  scan_modal_body:      'Konfirmasi Manual Diperlukan: Tingkat keyakinan sistem berada di bawah ambang batas standar. Mohon lakukan tinjauan manual dan pilih hasil validasi yang benar.',
  scan_modal_confirm:   'Lanjutkan Validasi',

  scan_back:            'Kembali ke Form Pemeriksaan',
  scan_detail:          'Detail Pemeriksaan',
  scan_stored_image:    'Citra Tersimpan',
  scan_conf:            'Keyakinan',
  scan_valid_status:    'Status Validasi',
  scan_doctor:          'Dokter',
  scan_time:            'Waktu',
  scan_agree:           'Sesuai',
  scan_corrected:       'Dikoreksi',
  scan_no_image:        'Citra belum tersedia.',

  // ──────────────────────────────────────────
  // SETTINGS
  // ──────────────────────────────────────────
  set_title:         'Pengaturan Sistem & Konfigurasi',
  set_subtitle:      'Konfigurasi koneksi API backend Python dan arsitektur sistem komputasi',
  set_mock_title:    'Mode Simulasi (Mock Data)',
  set_mock_desc:     'Aktifkan untuk menggunakan data simulasi tanpa koneksi backend Python. Cocok untuk demonstrasi dan pengembangan UI.',
  set_mock_on:       'Aktif',
  set_mock_off:      'Nonaktif',
  set_url_title:     'URL Backend Python',
  set_url_label:     'Endpoint URL (FastAPI / Flask + Ngrok)',
  set_url_ph:        'https://xxxxx.ngrok-free.app',
  set_url_note:      'Pastikan server backend mengizinkan CORS dan header ngrok-skip-browser-warning: true',
  set_model_title:   'Arsitektur Sistem Komputasi',
  set_model_note:    'Sistem Komputasi di backend Python mendeteksi pembesaran bayangan jantung berdasarkan bobot arsitektur yang dipilih.',
  set_save:          'Simpan Konfigurasi',
  set_saved:         'Pengaturan berhasil disimpan!',
  set_active:        'AKTIF',
  set_status_active: 'AKTIF',

  set_model_densenet: 'DenseNet-121 (CheXNet Pretrained)',
  set_model_vgg:      'ResNet50 (ImageNet Pretrained)',
  set_model_mobile:   'MobileNetV2 (Lightweight)',
  set_badge_rec:      'Direkomendasikan',
  set_badge_std:      'Stabil',
  set_badge_light:    'Ringan',

  // ──────────────────────────────────────────
  // KARAKTERISTIK DATA
  // ──────────────────────────────────────────
  kd_label0:     'Jantung Normal',
  kd_label1:     'Pembesaran Jantung',
  kd_label_data: 'Spesifikasi Data',
  kd_radiologi:  'Karakteristik Radiologi',
  kd_handling:   'Panduan Penanganan Klinis',

  kd0_title: 'Label 0: Normal',
  kd0_c1: 'Ukuran siluet jantung normal (CTR ≤ 50%)',
  kd0_c2: 'Rasio Cardiothoracic Ratio (CTR) dalam batas fisiologis normal',
  kd0_c3: 'Diagnosis historis oleh tim medis RSJ Tampan Riau (Panam)',
  kd0_c4: 'Fitur morfometri spasial rongga dada dalam rentang normal',
  kd0_c5: 'Tidak memerlukan tindakan medis kardiologi atau perubahan terapi',

  kd1_title: 'Label 1: Kardiomegali',
  kd1_c1: 'Ukuran siluet jantung melebihi batas normal (CTR > 50%)',
  kd1_c2: 'Terindikasi adanya hipertrofi atau pembesaran bayangan jantung',
  kd1_c3: 'Risiko kardiovaskular tinggi akibat konsumsi antipsikotik jangka panjang',
  kd1_c4: 'Diagnosis historis diverifikasi oleh dokter RSJ Tampan Riau',
  kd1_c5: 'Memerlukan rujukan kardiologi dan evaluasi dosis obat antipsikotik',

  kd2_title: 'Dataset & Preprocessing',
  kd2_c1: 'Sumber Data: Rekam medis & diagnosis dokter terdahulu di RSJ Tampan Riau',
  kd2_c2: 'Klasifikasi Dataset: Data dipisah menjadi label Normal dan Kardiomegali',
  kd2_c3: 'Feature Extraction: Fitur morfometri spasial dari citra rontgen dada (X-Ray Thorax)',
  kd2_c4: 'Preprocessing: Pengolahan otomatis (resize, ekspansi dimensi, normalisasi nilai piksel)',
  kd2_c5: 'Dimensi Input: Disesuaikan untuk kebutuhan ekstraksi arsitektur CNN (.h5)',

  kd_detail_ctr:     'Rasio CTR',
  kd_detail_label:   'Label Kelas',
  kd_detail_risk:    'Risiko Kardio',
  kd_detail_action:  'Tindakan',

  kd0_d1: '≤ 50% (0.50)',   kd0_d2: '0 (Normal)',      kd0_d3: 'Rendah / Normal',     kd0_d4: 'Lanjutkan Terapi ODGJ',
  kd1_d1: '> 50% (0.50)',   kd1_d2: '1 (Kardiomegali)',kd1_d3: 'Tinggi (Hipertrofi)', kd1_d4: 'Rujukan Kardiologi',
  kd2_d1: 'X-Ray Thorax (Biner)', kd2_d2: 'Morfometri Spasial', kd2_d3: '86.5% CNN', kd2_d4: 'RSJ Tampan Riau',

  kd_detail_label2:   'Label Kelas',
  kd_detail_feat:    'Fitur Ekstraksi',
  kd_detail_acc:     'Akurasi Sistem',
  kd_detail_source:  'Studi Kasus',

  // ──────────────────────────────────────────
  // FLOWCHART
  // ──────────────────────────────────────────
  fc_title:        'Arsitektur & Alur Sistem Analisis Digital',
  fc_subtitle:     'Sorot tahapan untuk melihat detail teknis sistem komputasi kardiomegali pada ODGJ',
  fc_badge:        'Sistem Terintegrasi Python & React',
  fc_more:         'lainnya',

  // ──────────────────────────────────────────
  // BIODATA TIM
  // ──────────────────────────────────────────
  bio_title:      'Kelompok Kardiomegali (Politeknik Caltex Riau)',
  bio_subtitle:   'Proyek Klasifikasi Kondisi Kardiomegali pada Pasien ODGJ Berdasarkan Fitur Morfometri Citra Thorax Menggunakan Algoritma Convolutional Neural Network (CNN) ini dikembangkan sebagai bagian dari praktikum mata kuliah Penambangan Data (Data Mining) program studi Sistem Informasi Politeknik Caltex Riau, didukung penuh secara klinis oleh RSJ Tampan Riau (Panam).',
  bio_profile:    'Profil Peneliti',
  bio_focus:      'Fokus Kontribusi',
  bio_skills:     'Kompetensi Teknis',
  bio_category:   'Kategori Praktikum',
  bio_course:     'Data Mining — Kelompok Kardiomegali',

  // ──────────────────────────────────────────
  // DATA TRAINING & TESTING SECTION
  // ──────────────────────────────────────────
  dt_label:        'Visualisasi Dataset',
  dt_title:        'Data Training & Data Testing',
  dt_subtitle:     'Dataset citra Rontgen Thorax dari pasien ODGJ RSJ Tampan Riau yang digunakan untuk pelatihan dan pengujian model CNN',
  dt_label_badge:  'Label',

  dt_normal_title: 'Normal',
  dt_normal_c1:    'Ukuran jantung dalam batas normal (CTR ≤ 50%)',
  dt_normal_c2:    'Tidak terdapat pembesaran siluet jantung',
  dt_normal_c3:    'Tidak memerlukan tindakan kardiologi',
  dt_normal_c4:    'Lanjutkan terapi ODGJ seperti biasa',

  dt_cardio_title: 'Kardiomegalitas',
  dt_cardio_c1:    'Ukuran jantung melebihi batas normal (CTR > 50%)',
  dt_cardio_c2:    'Terindikasi pembesaran siluet bayangan jantung',
  dt_cardio_c3:    'Risiko kardiovaskular tinggi dari antipsikotik',
  dt_cardio_c4:    'Memerlukan rujukan kardiologi segera',
};

export default id;
