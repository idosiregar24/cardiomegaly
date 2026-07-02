---
title: Cardiomegaly Backend API
emoji: 🫀
colorFrom: red
colorTo: blue
sdk: docker
pinned: false
app_port: 7860
---

# Cardiomegaly Backend API

Backend Flask API untuk sistem klasifikasi Kardiomegali menggunakan model DenseNet121.

## Endpoints

- POST /api/v1/scan-thorax — Analisis citra X-Ray thorax (DenseNet121 + Grad-CAM)
- GET /api/v1/model-info — Informasi model aktif
