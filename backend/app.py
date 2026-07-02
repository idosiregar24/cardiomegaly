# -*- coding: utf-8 -*-
"""
Backend API Server — Sistem Klasifikasi Kardiomegali ODGJ
Model: DenseNet121_Cardiomegali_HighRes_v2 (.keras)
Input: 256×256 RGB | Output: 2 kelas (Normal / Kardiomegali)
"""

import os
import cv2
import base64
import numpy as np
import tensorflow as tf
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)

# CORS: Izinkan frontend Vercel & localhost development
# Set CORS_ORIGINS di HF Spaces Secrets jika ingin membatasi domain
_cors_origins = os.environ.get(
    "CORS_ORIGINS",
    "https://cardiomegaly.vercel.app,https://cardiomegaly-inky.vercel.app,http://localhost:5173,http://localhost:3000"
).split(",")
CORS(app, origins=_cors_origins, supports_credentials=False)



# ==========================================
# 1. KONFIGURASI & MEMUAT MODEL
# ==========================================
MODEL_FILENAME = "cnn_kardiomegali_256px.keras"
MODEL_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), MODEL_FILENAME)

INPUT_SIZE = (256, 256)  # RGB 256×256
CLASS_NAMES = ["Normal", "Kardiomegali"]

print(f"[INFO] Memuat model DenseNet121 dari: {MODEL_PATH}")
if not os.path.exists(MODEL_PATH):
    raise FileNotFoundError(
        f"[FATAL] Model tidak ditemukan di: {MODEL_PATH}\n"
        f"Pastikan file '{MODEL_FILENAME}' berada di folder backend/."
    )

model = tf.keras.models.load_model(MODEL_PATH)
print(f"[INFO] Model '{model.name}' berhasil dimuat.")
print(f"[INFO] Input shape: {model.input_shape} | Output shape: {model.output_shape}")

# Deteksi otomatis layer konvolusi terakhir di dalam DenseNet121 untuk Grad-CAM
GRADCAM_LAYER_NAME = None
densenet_sublayer = None
for layer in model.layers:
    if layer.name == "densenet121":
        densenet_sublayer = layer
        break

if densenet_sublayer is not None:
    for sub in reversed(densenet_sublayer.layers):
        if "conv" in sub.name and hasattr(sub, "kernel"):
            GRADCAM_LAYER_NAME = sub.name
            break

if GRADCAM_LAYER_NAME:
    print(f"[INFO] Grad-CAM target layer: densenet121 → {GRADCAM_LAYER_NAME}")
else:
    print("[WARN] Tidak dapat mendeteksi Grad-CAM layer secara otomatis.")

# Folder temp lokal untuk transit file
os.makedirs("static/temp", exist_ok=True)


# ==========================================
# 2. CORE ALGORITMA (GRAD-CAM & OVERLAY)
# ==========================================
def make_gradcam_heatmap(img_array, model_ref, layer_name):
    """
    Generate Grad-CAM heatmap for DenseNet121 functional sublayer.
    """
    if layer_name is None:
        return None
    try:
        # 1. Pass input through all layers up to densenet121, skipping InputLayer
        x = img_array
        densenet_layer = None
        densenet_index = -1
        for i, layer in enumerate(model_ref.layers):
            if isinstance(layer, tf.keras.layers.InputLayer) or layer.__class__.__name__ == "InputLayer":
                continue
            if layer.name == "densenet121":
                densenet_layer = layer
                densenet_index = i
                break
            x = layer(x)
            
        # 2. Definisikan sub-model untuk densenet121
        target_layer = densenet_layer.get_layer(layer_name)
        densenet_grad_model = tf.keras.Model(
            inputs=densenet_layer.input,
            outputs=[target_layer.output, densenet_layer.output]
        )
        
        with tf.GradientTape() as tape:
            # Jalankan densenet121 sub-model
            conv_outputs, densenet_features = densenet_grad_model(x)
            # Watch intermediate tensor conv_outputs
            tape.watch(conv_outputs)
            
            # Sisa layer setelah densenet121
            y = densenet_features
            for layer in model_ref.layers[densenet_index + 1:]:
                y = layer(y)
                
            pred_index = tf.argmax(y[0])
            class_channel = y[:, pred_index]

        # Ambil gradien output terhadap conv_outputs
        grads = tape.gradient(class_channel, conv_outputs)
        
        if grads is None:
            print("[WARN] Grad-CAM: gradients are None.")
            return None

        pooled_grads = tf.reduce_mean(grads, axis=(0, 1, 2))
        conv_outputs = conv_outputs[0]
        heatmap = conv_outputs @ pooled_grads[..., tf.newaxis]
        heatmap = tf.squeeze(heatmap)
        heatmap = tf.maximum(heatmap, 0) / (tf.reduce_max(heatmap) + 1e-10)
        return heatmap.numpy()
    except Exception as e:
        print(f"[WARN] Grad-CAM Error: {e}")
        return None


def generate_overlay_gradcam(original_img_path, heatmap, output_path, alpha=0.4):
    """Overlay Grad-CAM heatmap onto the original image."""
    try:
        with open(original_img_path, "rb") as f:
            file_bytes = np.frombuffer(f.read(), dtype=np.uint8)
            img = cv2.imdecode(file_bytes, cv2.IMREAD_COLOR)
        if img is None:
            return False
        heatmap_resized = cv2.resize(heatmap, (img.shape[1], img.shape[0]))
        heatmap_scaled = np.uint8(255 * heatmap_resized)
        heatmap_color = cv2.applyColorMap(heatmap_scaled, cv2.COLORMAP_JET)
        superimposed_img = heatmap_color * alpha + img
        superimposed_img = np.clip(superimposed_img, 0, 255).astype(np.uint8)

        _, img_encoded = cv2.imencode('.png', superimposed_img)
        with open(output_path, "wb") as f:
            f.write(img_encoded.tobytes())
        return True
    except Exception as e:
        print(f"[WARN] Overlay Error: {e}")
        return False


# ==========================================
# 3. ROUTE / ENDPOINT API
# ==========================================
@app.route('/api/v1/scan-thorax', methods=['POST'])
def scan_thorax():
    if 'image' not in request.files:
        return jsonify({"status": "error", "message": "Tidak ada file gambar."}), 400

    file = request.files['image']
    id_pasien = request.form.get('id_pasien', 'PASIEN_UNKNOWN').strip().replace(" ", "_")

    # Simpan sementara di lokal server untuk pemrosesan OpenCV
    temp_img_path = os.path.join("static/temp", f"raw_{id_pasien}_{file.filename}")
    file.save(temp_img_path)

    try:
        # A. Preprocessing — RGB 256×256 untuk DenseNet121
        with open(temp_img_path, "rb") as f:
            file_bytes = np.frombuffer(f.read(), dtype=np.uint8)
            img_raw = cv2.imdecode(file_bytes, cv2.IMREAD_COLOR)  # Baca sebagai BGR
        if img_raw is None:
            raise ValueError("Berkas citra rusak atau format tidak didukung.")

        # Konversi BGR → RGB (sesuai kebutuhan DenseNet)
        img_rgb = cv2.cvtColor(img_raw, cv2.COLOR_BGR2RGB)
        img_resized = cv2.resize(img_rgb, INPUT_SIZE, interpolation=cv2.INTER_AREA)

        # Expand dimensions: (256, 256, 3) → (1, 256, 256, 3), cast ke float32
        img_array = np.expand_dims(img_resized.astype(np.float32), axis=0)

        # B. Prediksi
        predictions = model.predict(img_array, verbose=0)[0]
        pred_class = int(np.argmax(predictions))
        prediction_prob = float(predictions[pred_class])

        # Mapping kelas (2-kelas):
        # Index 0: Normal
        # Index 1: Kardiomegali
        status_diagnosa = CLASS_NAMES[pred_class]
        label_kardiomegali = pred_class

        # C. Grad-CAM Generation
        heatmap = make_gradcam_heatmap(img_array, model, GRADCAM_LAYER_NAME)

        gradcam_base64_url = None

        if heatmap is not None:
            output_filename = f"result_{id_pasien}.png"
            local_output_path = os.path.join("static/temp", output_filename)

            if generate_overlay_gradcam(temp_img_path, heatmap, local_output_path):
                with open(local_output_path, 'rb') as f:
                    gradcam_bytes = f.read()
                gradcam_base64_url = "data:image/png;base64," + base64.b64encode(gradcam_bytes).decode('utf-8')

                # Hapus file output temporary
                if os.path.exists(local_output_path):
                    os.remove(local_output_path)

        # Bersihkan file raw temporary
        if os.path.exists(temp_img_path):
            os.remove(temp_img_path)

        # D. RETURN DATA RESPONSE KE FRONTEND
        # Hitung persentase masing-masing kelas dari array predictions penuh
        normal_pct        = float(predictions[0]) * 100  # Index 0 = Normal
        cardiomegaly_pct  = float(predictions[1]) * 100  # Index 1 = Kardiomegali

        return jsonify({
            "status": "success",
            "message": "Analisis citra berhasil diproses.",
            "data": {
                "id_pasien": id_pasien,
                "label_kardiomegali": label_kardiomegali,
                "deskripsi_klinis": status_diagnosa,
                "nilai_probabilitas": prediction_prob,
                "persentase_keyakinan": f"{prediction_prob * 100:.2f}%",
                # Persentase per-kelas (untuk disimpan di database scan_results)
                "normal_percentage": round(normal_pct, 2),
                "cardiomegaly_percentage": round(cardiomegaly_pct, 2),
                "url_visualisasi_gradcam": gradcam_base64_url,
                "model_info": {
                    "nama": model.name,
                    "input_shape": str(model.input_shape),
                    "arsitektur": "DenseNet121"
                }
            }
        }), 200


    except Exception as e:
        import traceback
        traceback.print_exc()
        if os.path.exists(temp_img_path):
            os.remove(temp_img_path)
        return jsonify({"status": "error", "message": f"Gagal memproses: {str(e)}"}), 500


@app.route('/api/v1/model-info', methods=['GET'])
def model_info():
    """Endpoint untuk menampilkan informasi model yang aktif."""
    return jsonify({
        "status": "success",
        "data": {
            "nama_model": model.name,
            "file_model": MODEL_FILENAME,
            "input_shape": str(model.input_shape),
            "output_shape": str(model.output_shape),
            "arsitektur_backbone": "DenseNet121",
            "jumlah_kelas": len(CLASS_NAMES),
            "nama_kelas": CLASS_NAMES,
            "gradcam_layer": GRADCAM_LAYER_NAME,
            "resolusi_input": f"{INPUT_SIZE[0]}×{INPUT_SIZE[1]} RGB"
        }
    }), 200


if __name__ == '__main__':
    print("\n" + "=" * 60)
    print("  BACKEND SERVER KARDIOMEGALI — DenseNet121")
    print(f"  Model: {MODEL_FILENAME}")
    print(f"  Input: {INPUT_SIZE[0]}×{INPUT_SIZE[1]} RGB")
    print(f"  Kelas: {CLASS_NAMES}")
    print(f"  Grad-CAM Layer: {GRADCAM_LAYER_NAME}")
    print("=" * 60)
    print("  Server berjalan di http://localhost:5000")
    print("=" * 60 + "\n")
    app.run(host='0.0.0.0', port=5000, debug=False, use_reloader=False)