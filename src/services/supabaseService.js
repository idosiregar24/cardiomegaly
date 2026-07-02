import { supabase } from './supabaseClient';

// ============================================================
// FITUR 1: Simpan hasil klasifikasi ke tabel scan_results
// ============================================================

/**
 * Insert hasil scan AI ke tabel `scan_results` di Supabase.
 *
 * Schema tabel:
 *   id                    UUID (auto)
 *   patient_id            TEXT
 *   normal_percentage     FLOAT   — probabilitas kelas Normal × 100
 *   cardiomegaly_percentage FLOAT — probabilitas kelas Kardiomegali × 100
 *   gradcam_image_path    TEXT    — nama file atau label path Grad-CAM
 *   timestamp             TIMESTAMPTZ (auto)
 *
 * @param {string} patientId           - ID pasien
 * @param {number} normalPct           - Persentase Normal (misal: 8.34)
 * @param {number} cardiomegalyPct     - Persentase Kardiomegali (misal: 91.66)
 * @param {string|null} gradcamPath    - Nama/path file Grad-CAM (bukan base64 penuh)
 * @returns {Promise<object|null>} Row yang berhasil diinsert, atau null jika gagal
 */
export const logScanResult = async (patientId, normalPct, cardiomegalyPct, gradcamPath = null) => {
  try {
    if (!patientId || normalPct === undefined || cardiomegalyPct === undefined) {
      throw new Error('logScanResult: argumen wajib tidak lengkap (patientId, normalPct, cardiomegalyPct).');
    }

    const { data, error } = await supabase
      .from('scan_results')
      .insert([
        {
          patient_id:              patientId,
          normal_percentage:       parseFloat(normalPct.toFixed(2)),
          cardiomegaly_percentage: parseFloat(cardiomegalyPct.toFixed(2)),
          gradcam_image_path:      gradcamPath || null,
          // timestamp diisi otomatis oleh DEFAULT now() di Supabase
        },
      ])
      .select();

    if (error) throw error;

    console.log('[Supabase] scan_results INSERT sukses:', data?.[0]);
    return data ? data[0] : null;
  } catch (err) {
    console.error('[Supabase] logScanResult GAGAL:', err.message || err);
    // Jangan throw — gagal simpan DB tidak boleh menghentikan flow UI
    return null;
  }
};

/**
 * Ambil semua riwayat scan dari tabel scan_results (urutan terbaru dulu).
 *
 * @returns {Promise<Array>} Daftar baris scan_results
 */
export const fetchScanHistory = async () => {
  try {
    const { data, error } = await supabase
      .from('scan_results')
      .select('*')
      .order('timestamp', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error('[Supabase] fetchScanHistory GAGAL:', err.message || err);
    return [];
  }
};

/**
 * Hapus satu record scan dari tabel scan_results.
 *
 * @param {string} id - UUID record
 * @returns {Promise<boolean>}
 */
export const deleteScanResult = async (id) => {
  try {
    const { error } = await supabase
      .from('scan_results')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (err) {
    console.error('[Supabase] deleteScanResult GAGAL:', err.message || err);
    return false;
  }
};



/**
 * Scenario A: Inserting the Initial AI Prediction
 * Triggered immediately after the Backend AI returns the classification result.
 * 
 * @param {string} patientId - The identifier of the anonymized patient data.
 * @param {string} imageUrl - The URL of the uploaded thorax X-ray image.
 * @param {string} prediction - The CNN model prediction ('Normal' or 'Kardiomegali').
 * @param {number} confidence - The probability percentage (e.g. 94.6).
 * @returns {Promise<object|null>} The inserted row data, or null if failed.
 */
export const logClassificationResult = async (patientId, imageUrl, prediction, confidence) => {
  try {
    if (!patientId || !imageUrl || !prediction || confidence === undefined) {
      throw new Error('Missing required arguments for logging classification result.');
    }

    const { data, error } = await supabase
      .from('classification_logs')
      .insert([
        {
          patient_identifier: patientId,
          image_url: imageUrl,
          ai_prediction: prediction,
          confidence_score: parseFloat(confidence),
          doctor_validation: null, // explicitly set as null initially
          validated_by: null,
          validated_at: null,
        },
      ])
      .select();

    if (error) {
      throw error;
    }

    console.log('Successfully logged classification attempt to Supabase:', data);
    return data ? data[0] : null;
  } catch (error) {
    console.error('Error in logClassificationResult:', error.message || error);
    throw error;
  }
};

/**
 * Upload the reviewed X-Ray image to Supabase Storage before the final log insert.
 * Configure the bucket with VITE_SUPABASE_XRAY_BUCKET, or create a public
 * bucket named `classification-images`.
 *
 * @param {File} imageFile
 * @param {string} patientIdentifier
 * @returns {Promise<string>} Public image URL
 */
export const uploadClassificationImage = async (imageFile, patientIdentifier) => {
  if (!imageFile || !patientIdentifier) {
    throw new Error('Missing imageFile or patientIdentifier for image upload.');
  }

  const bucket = import.meta.env.VITE_SUPABASE_XRAY_BUCKET || 'classification-images';
  const extension = imageFile.name.split('.').pop()?.toLowerCase() || 'jpg';
  const safePatientId = patientIdentifier.replace(/[^a-zA-Z0-9_-]/g, '-');
  const filePath = `${safePatientId}/${Date.now()}-${crypto.randomUUID()}.${extension}`;

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(filePath, imageFile, {
      cacheControl: '3600',
      contentType: imageFile.type || 'image/jpeg',
      upsert: false,
    });

  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
  if (!data?.publicUrl) {
    throw new Error('Supabase Storage did not return a public URL.');
  }

  return data.publicUrl;
};

/**
 * Final sequential insert for the requested workflow. Call this only when the
 * doctor clicks "Lakukan Analisis Baru" after reviewing the AI result.
 *
 * @param {object} payload
 * @param {string} payload.patient_identifier
 * @param {string} payload.image_url
 * @param {'Normal'|'Kardiomegali'} payload.ai_prediction
 * @param {number} payload.confidence_score
 * @param {boolean} payload.doctor_validation
 * @param {string} payload.validated_by
 * @param {string} [payload.validated_at]
 * @returns {Promise<object|null>}
 */
export const insertClassificationLogAfterReview = async (payload) => {
  const requiredFields = [
    'patient_identifier',
    'image_url',
    'ai_prediction',
    'confidence_score',
    'doctor_validation',
    'validated_by',
  ];

  const missingField = requiredFields.find((field) => {
    const value = payload?.[field];
    return value === undefined || value === null || value === '';
  });

  if (missingField) {
    throw new Error(`Missing required classification log field: ${missingField}`);
  }

  const baseRow = {
    patient_identifier: payload.patient_identifier,
    image_url: payload.image_url,
    ai_prediction: payload.ai_prediction,
    confidence_score: Number(payload.confidence_score),
    doctor_validation: Boolean(payload.doctor_validation),
    validated_by: payload.validated_by,
    validated_at: payload.validated_at || new Date().toISOString(),
  };

  const maybePatientName =
    payload.patient_name !== undefined && payload.patient_name !== null && String(payload.patient_name).trim() !== ''
      ? String(payload.patient_name).trim()
      : null;

  const maybePatientAge =
    payload.patient_age !== undefined && payload.patient_age !== null && payload.patient_age !== ''
      ? Number(payload.patient_age)
      : null;

  const rowWithOptional = {
    ...baseRow,
    ...(maybePatientName !== null ? { patient_name: maybePatientName } : {}),
    ...(maybePatientAge !== null && !Number.isNaN(maybePatientAge) ? { patient_age: maybePatientAge } : {}),
  };

  // Debug untuk memastikan field patient_name/patient_age benar-benar dikirim
  console.log('[Supabase] insertClassificationLogAfterReview payload:', {
    patient_identifier: baseRow.patient_identifier,
    patient_name: rowWithOptional.patient_name ?? null,
    patient_age: rowWithOptional.patient_age ?? null,
  });

  try {
    const { data, error } = await supabase
      .from('classification_logs')
      .insert([rowWithOptional])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (err) {
    const msg = err?.message || String(err);

    // Fallback jika Supabase schema belum punya kolom patient_name/patient_age
    const looksLikeMissingColumn =
      msg.toLowerCase().includes('column') &&
      (msg.toLowerCase().includes('patient_name') || msg.toLowerCase().includes('patient_age'));

    const hasAnyOptional = maybePatientName !== null || maybePatientAge !== null;

    if (hasAnyOptional && looksLikeMissingColumn) {
      const { data, error } = await supabase
        .from('classification_logs')
        .insert([baseRow])
        .select()
        .single();

      if (error) throw error;
      return data;
    }

    throw err;
  }
};

/**
 * Scenario B: Doctor Validation UI Action
 * Triggered when the doctor clicks "Benar" (Correct) or "Salah" (Incorrect) button.
 * 
 * @param {string} logId - The UUID primary key of the log entry.
 * @param {boolean} isCorrect - TRUE if doctor agrees with the AI, FALSE if they disagree.
 * @param {string} doctorId - The identifier of the doctor who validated the classification.
 * @returns {Promise<object|null>} The updated row data, or null if failed.
 */
export const validateClassificationResult = async (logId, isCorrect, doctorId) => {
  try {
    if (!logId || isCorrect === undefined || !doctorId) {
      throw new Error('Missing required arguments for validating classification result.');
    }

    const { data, error } = await supabase
      .from('classification_logs')
      .update({
        doctor_validation: isCorrect,
        validated_by: doctorId,
        validated_at: new Date().toISOString(),
      })
      .eq('id', logId)
      .select();

    if (error) {
      throw error;
    }

    console.log('Successfully updated classification log with doctor validation:', data);
    return data ? data[0] : null;
  } catch (error) {
    console.error('Error in validateClassificationResult:', error.message || error);
    throw error;
  }
};

/**
 * Fetch all classification logs from Supabase ordered by created_at descending.
 * 
 * @returns {Promise<Array>} List of classification logs.
 */
export const fetchHistoryFromSupabase = async () => {
  try {
    const { data, error } = await supabase
      .from('classification_logs')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    // Map database fields to the frontend model fields used across admin pages.
  return (data || []).map(row => ({
      id: row.id,
      patientId: row.patient_identifier,
      patientIdentifier: row.patient_identifier,
      name: row.patient_name ? String(row.patient_name) : `Pasien ${row.patient_identifier}`,
      age: row.patient_age === null || row.patient_age === undefined || row.patient_age === '' ? '-' : String(row.patient_age),
      gender: '-',
      date: new Date(row.created_at).toISOString().split('T')[0],
      createdAt: row.created_at,
      status: row.ai_prediction,
      confidence: Number.parseFloat(row.confidence_score || 0),
      notes: row.doctor_validation !== null 
        ? `Hasil diverifikasi oleh ${row.validated_by}: ${row.doctor_validation ? 'BENAR' : 'SALAH'}`
        : 'Menunggu review medis.',
      model: 'DenseNet121',
      supabaseLogId: row.id,
      imageUrl: row.image_url,
      filePreview: row.image_url,
      aiPrediction: row.ai_prediction,
      confidenceScore: Number.parseFloat(row.confidence_score || 0),
      doctorValidation: row.doctor_validation,
      validatedBy: row.validated_by,
      validatedAt: row.validated_at,
    }));
  } catch (error) {
    console.error('Error in fetchHistoryFromSupabase:', error.message || error);
    throw error;
  }
};

/**
 * Delete a classification log entry from Supabase.
 * 
 * @param {string} id - UUID primary key of the log entry.
 * @returns {Promise<boolean>} True if successful.
 */
export const deleteLogFromSupabase = async (id) => {
  try {
    if (!id) throw new Error('Missing ID for deleting log.');
    const { error } = await supabase
      .from('classification_logs')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error in deleteLogFromSupabase:', error.message || error);
    throw error;
  }
};

/**
 * Fetch dashboard statistics calculated in real-time from Supabase data.
 * 
 * @returns {Promise<object>} Dashboard metrics.
 */
export const fetchStatsFromSupabase = async () => {
  try {
    const { data: allLogs, error } = await supabase
      .from('classification_logs')
      .select('id, ai_prediction, doctor_validation, created_at, patient_identifier');

    if (error) throw error;

    const total = allLogs?.length || 0;
    const cardiomegaly = allLogs?.filter(log => log.ai_prediction === 'Kardiomegali').length || 0;
    const normal = allLogs?.filter(log => log.ai_prediction === 'Normal').length || 0;
    const needReview = allLogs?.filter(log => 
      log.doctor_validation === null || log.doctor_validation === false
    ).length || 0;

    // Fetch the 4 most recent records
    const recentActivity = [...(allLogs || [])]
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 4)
      .map(log => ({
        id: log.id,
        name: `Pasien ${log.patient_identifier}`,
        date: new Date(log.created_at).toISOString().split('T')[0],
        status: log.ai_prediction
      }));

    return {
      totalData: total,
      cardiomegaly,
      normal,
      needReview,
      recentActivity
    };
  } catch (error) {
    console.error('Error in fetchStatsFromSupabase:', error.message || error);
    throw error;
  }
};
