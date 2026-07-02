# TODO - Tambah kolom Nama Pasien & Umur

## Rencana perubahan (berdasarkan prioritas)
1. Periksa struktur input & state di `src/components/NgrokScanner.jsx`.
2. Tambahkan state baru: `patientName`, `patientAge`.
3. Tambahkan UI input untuk **Nama Pasien** dan **Umur** pada section **Data Pasien**.
4. Validasi sebelum analisis: Pastikan Umur angka 0-120 dan Nama Pasien terisi.
5. Saat klik Analisis: simpan `patientName/patientAge` untuk ditampilkan dan dikirim ke Supabase saat save.
6. Update `handleSaveAndReset` di `NgrokScanner.jsx` agar payload `insertClassificationLogAfterReview` menyertakan `patient_name` dan `patient_age` (atau field yang sesuai).
7. Update UI panel hasil (ResultPanel) agar menampilkan Nama Pasien & Umur.
8. Buat fallback jika field Supabase belum ada (tetap simpan tanpa field baru, namun UI tetap menampilkan).
9. Jalankan `npm test` / `npm run build` / `npm run lint` (jika tersedia) untuk memastikan tidak ada error kompilasi.

