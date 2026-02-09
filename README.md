# 🔧 RingPOS - SaaS POS Bengkel & Retail

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Status](https://img.shields.io/badge/status-In%20Development-yellow)](/)

## 📋 Deskripsi

**RingPOS** adalah platform Point of Sale (POS) berbasis SaaS untuk manajemen bengkel dan retail multi-cabang. Sistem ini dirancang **Full Online** dengan arsitektur cloud-native untuk menjamin integritas data dan kecepatan tinggi.

### ✨ Keunggulan Utama

- 📱 **Mobile First** - Gunakan HP/Tablet sebagai alat kasir
- 🏪 **Multi-Cabang** - Pantau semua cabang dalam satu dashboard
- ⚡ **Super Cepat** - Scan barcode < 100ms dengan Redis caching
- 🔒 **Anti-Curang** - Stok dan kasir saling mengunci
- 🧾 **Struk Digital** - Cetak atau kirim via WhatsApp

## 🎯 Target Pengguna

| Role | Akses |
|------|-------|
| **Superadmin** | Pengelola Platform SaaS |
| **Owner** | Pemilik Bengkel (Multi-cabang) |
| **Manager** | Kepala Cabang |
| **Cashier** | Staf Kasir |

> **Note:** Mekanik tidak memiliki akun. Kasir berkomunikasi langsung secara lisan.

## 🛠️ Tech Stack

| Layer | Teknologi |
|-------|-----------|
| **Mobile App** | Flutter |
| **Web Dashboard** | Next.js (React) |
| **Backend API** | NestJS (Node.js) |
| **Database** | PostgreSQL 16 |
| **Caching** | Redis |
| **Cloud** | GCP/AWS (Jakarta Region) |

## 📁 Struktur Project

```
ringnetpos/
├── backend/          # NestJS API Server
├── mobile/           # Flutter App (Android/iOS)
├── web-dashboard/    # Next.js Owner Dashboard
├── docs/             # Dokumentasi
└── shared/           # Shared types & constants
```

## 🚀 Quick Start

### Backend
```bash
cd backend
cp .env.example .env
docker-compose up -d
npm install
npm run start:dev
```

### Mobile
```bash
cd mobile
flutter pub get
flutter run
```

### Web Dashboard
```bash
cd web-dashboard
npm install
npm run dev
```

## 📖 Dokumentasi

- [Implementation Plan](./implementation_plan.md) - Detail teknis & roadmap

## 📄 License

MIT License - Lihat [LICENSE](LICENSE) untuk detail.

---

Made with ❤️ for Indonesian Workshop & Retail Businesses
