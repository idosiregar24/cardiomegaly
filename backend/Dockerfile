# =========================================================
# Dockerfile — Cardiomegaly Backend (Flask + TensorFlow)
# Target: Hugging Face Spaces (Docker SDK)
# Port: 7860 (wajib untuk HF Spaces)
# =========================================================

FROM python:3.11-slim

WORKDIR /app

# Install system dependencies untuk OpenCV & TensorFlow
RUN apt-get update && apt-get install -y \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender-dev \
    libgomp1 \
    libgl1-mesa-glx \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements dulu (layer caching agar build lebih cepat)
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy semua file backend
COPY . .

# Buat folder temp untuk file upload sementara
RUN mkdir -p static/temp

# Beri permission user non-root (best practice HF Spaces)
RUN useradd -m -u 1000 appuser && chown -R appuser:appuser /app
USER appuser

# Expose port HF Spaces (WAJIB 7860)
EXPOSE 7860

# Start server dengan gunicorn
CMD ["gunicorn", "app:app", "--bind", "0.0.0.0:7860", "--timeout", "120", "--workers", "1", "--log-level", "info"]
