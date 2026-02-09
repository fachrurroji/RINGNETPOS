# 🔧 Ring Pro — Mechanic Edition

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Status](https://img.shields.io/badge/status-Phase%201%20Complete-green)](/)
[![NestJS](https://img.shields.io/badge/backend-NestJS-red)](https://nestjs.com/)
[![Flutter](https://img.shields.io/badge/mobile-Flutter-blue)](https://flutter.dev/)

## 📋 Deskripsi

**Ring Pro (Mechanic Edition)** adalah platform Point of Sale (POS) berbasis SaaS untuk manajemen bengkel motor/mobil multi-cabang. Sistem dirancang **Full Online** dengan arsitektur cloud-native untuk menjamin integritas data dan kecepatan tinggi.

### ✨ Keunggulan Utama

- 📱 **Mobile First** — Gunakan HP/Tablet sebagai alat kasir
- 🏪 **Multi-Cabang** — Pantau semua cabang dalam satu dashboard
- ⚡ **Super Cepat** — Scan barcode < 100ms dengan Redis caching
- 🔧 **Mechanic Friendly** — Input harga jasa & komisi mekanik fleksibel
- 🧾 **Struk Digital** — Cetak atau kirim via WhatsApp

## 🎯 Target Pengguna

| Role | Akses |
|------|-------|
| **Superadmin** | Pengelola Platform SaaS |
| **Owner** | Pemilik Bengkel (Multi-cabang) |
| **Manager** | Kepala Cabang |
| **Cashier** | Staf Kasir |

> **Note:** Mekanik tidak memiliki akun — hanya dicatat sebagai data master untuk komisi.

## 🛠️ Tech Stack

| Layer | Teknologi |
|-------|-----------|
| **Mobile App** | Flutter |
| **Web Dashboard** | Next.js (React) |
| **Backend API** | NestJS (Node.js + TypeScript) |
| **Database** | PostgreSQL 16 |
| **ORM** | Prisma |
| **Caching** | Redis |
| **Auth** | JWT + Passport |

## 📁 Struktur Project

```
ringnetpos/
├── backend/          # NestJS API Server
│   ├── src/
│   │   ├── auth/         # JWT Auth & Guards
│   │   ├── tenants/      # Multi-tenant CRUD
│   │   ├── users/        # User management
│   │   ├── branches/     # Branch management
│   │   ├── products/     # Product & SKU scan
│   │   └── prisma/       # Prisma service
│   └── prisma/
│       ├── schema.prisma # Database schema
│       └── seed.ts       # Demo data seeder
├── mobile/           # Flutter App (Android/iOS)
├── web-dashboard/    # Next.js Owner Dashboard
└── shared/           # Shared types & constants
```

## 🚀 Quick Start

### 1. Start Database (Docker)
```bash
docker compose up -d
```

### 2. Backend Setup
```bash
cd backend
npm install
npx prisma db push
npx ts-node prisma/seed.ts
npm run start:dev
```

### 3. Access API
- **API Base URL:** http://localhost:3000/api
- **Swagger Docs:** http://localhost:3000/api/docs

## 🔐 Test Credentials

| Role | Username | Password |
|------|----------|----------|
| Superadmin | `superadmin` | `SuperAdmin123!` |
| Owner | `owner_demo` | `Owner123!` |
| Cashier | `cashier_demo` | `Cashier123!` |

## 📡 API Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| `POST` | `/api/auth/login` | User login | Public |
| `GET` | `/api/tenants` | List tenants | Superadmin |
| `GET` | `/api/users` | List users | Owner+ |
| `GET` | `/api/branches` | List branches | All roles |
| `GET` | `/api/products` | List products | All roles |
| `GET` | `/api/products/scan/:sku` | Barcode scan | All roles |

## 📖 Development Phases

- [x] **Phase 1:** Foundation (Auth, CRUD Master Data)
- [ ] **Phase 2:** Core POS & Redis Integration
- [ ] **Phase 3:** Mechanic & Commission System
- [ ] **Phase 4:** Web Dashboard & Reporting
- [ ] **Phase 5:** SaaS Billing & Launch

## 📄 License

MIT License — Lihat [LICENSE](LICENSE) untuk detail.

---

Made with ❤️ for Indonesian Workshop & Retail Businesses
