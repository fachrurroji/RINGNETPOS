# 🔧 RingPOS — Multi-Tenant POS System

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![NestJS](https://img.shields.io/badge/backend-NestJS-red)](https://nestjs.com/)
[![Flutter](https://img.shields.io/badge/mobile-Flutter-blue)](https://flutter.dev/)
[![Next.js](https://img.shields.io/badge/dashboard-Next.js-black)](https://nextjs.org/)
[![PostgreSQL](https://img.shields.io/badge/database-PostgreSQL-blue)](https://www.postgresql.org/)

## 📋 Deskripsi

**RingPOS** adalah platform Point of Sale (POS) berbasis SaaS multi-tenant untuk bengkel motor/mobil dan bisnis retail. Sistem terdiri dari 3 komponen utama:

- 📱 **Mobile App** (Flutter) — Kasir & Warehouse
- 🖥️ **Web Dashboard** (Next.js) — Owner & Manager
- ⚙️ **Backend API** (NestJS) — REST API + JWT Auth

### ✨ Fitur Utama

- 🏪 **Multi-Tenant & Multi-Cabang** — Satu platform untuk banyak bisnis, setiap bisnis bisa punya banyak cabang
- 📱 **Mobile First** — HP/Tablet sebagai alat kasir dan warehouse scanner
- 📷 **Barcode Scanner** — Scan produk via kamera HP (mobile_scanner)
- 🔧 **Mechanic System** — Input komisi mekanik per item transaksi
- 📝 **Draft Transaksi** — Simpan dan lanjutkan transaksi draft
- 📊 **Reporting** — Laporan harian, komisi mekanik, produk terlaris
- 📦 **Stock Management** — Stock opname, transfer stok antar cabang, low stock alert
- 🔄 **Retur** — Sistem retur barang dengan tracking
- 🎨 **Modern UI** — Dark theme dashboard, glassmorphism mobile

---

## 🎯 Role & Akses

| Role | Platform | Fitur |
|------|----------|-------|
| **Superadmin** | Web Dashboard | Kelola semua tenant & platform |
| **Owner** | Web Dashboard | Dashboard bisnis, laporan, master data |
| **Manager** | Web Dashboard | Kelola cabang, produk, stok |
| **Cashier** | Mobile App | POS kasir, scan barcode, draft, riwayat |
| **Warehouse** | Mobile App | Tambah produk, stock opname, scan barcode |

> **Note:** Mekanik tidak memiliki akun — dicatat sebagai data master untuk komisi.

---

## 🛠️ Tech Stack

| Layer | Teknologi | Version |
|-------|-----------|---------|
| **Mobile App** | Flutter (Dart) | 3.x |
| **Web Dashboard** | Next.js 14 (React + TypeScript) | 14.x |
| **Backend API** | NestJS (Node.js + TypeScript) | 10.x |
| **Database** | PostgreSQL | 16+ |
| **ORM** | Prisma | 5.x |
| **Caching** | Redis (optional) | 7.x |
| **Auth** | JWT + Passport | - |
| **Barcode** | mobile_scanner (Flutter) | 5.x |

---

## 📁 Struktur Project

```
ringnetpos/
├── backend/                    # NestJS API Server
│   ├── src/
│   │   ├── auth/               # JWT Auth, Guards, Strategy
│   │   ├── tenants/            # Multi-tenant CRUD
│   │   ├── users/              # User management (role-based)
│   │   ├── branches/           # Branch management
│   │   ├── products/           # Product & SKU/barcode scan
│   │   ├── inventory/          # Stock management & low stock
│   │   ├── transactions/       # Transaction CRUD
│   │   ├── draft-transactions/ # Draft save & resume
│   │   ├── mechanics/          # Mechanic master data
│   │   ├── reports/            # Daily, commission, top products
│   │   ├── stock-transfer/     # Inter-branch stock transfer
│   │   ├── returns/            # Return/refund system
│   │   └── prisma/             # Prisma service
│   └── prisma/
│       ├── schema.prisma       # Database schema (20+ models)
│       └── seed.ts             # Demo data seeder
│
├── mobile/                     # Flutter Mobile App
│   └── lib/
│       ├── main.dart           # App entry + role-based navigation
│       ├── config/             # API configuration
│       ├── models/             # Data models (User, Product, CartItem)
│       ├── providers/          # State management (Auth, Cart, Product)
│       ├── services/           # API service (Dio + JWT interceptor)
│       ├── screens/
│       │   ├── login_screen.dart
│       │   ├── home_screen.dart          # Cashier dashboard
│       │   ├── pos_screen.dart           # POS with barcode scan
│       │   ├── scanner_screen.dart       # Camera barcode scanner
│       │   ├── cart_screen.dart          # Cart + mechanic assignment
│       │   ├── draft_list_screen.dart    # Draft list & resume
│       │   ├── history_screen.dart       # Transaction history
│       │   ├── product_list_screen.dart  # Product catalog
│       │   ├── profile_screen.dart       # User profile & logout
│       │   └── warehouse/               # Warehouse-specific screens
│       │       ├── warehouse_home_screen.dart
│       │       ├── warehouse_product_form_screen.dart
│       │       └── stock_opname_screen.dart
│       └── utils/              # Constants, Helpers, Formatters
│
├── web-dashboard/              # Next.js Owner/Admin Dashboard
│   └── app/
│       ├── login/              # Login page
│       ├── (dashboard)/
│       │   ├── dashboard/      # Overview stats
│       │   ├── master/         # Users, Products, Branches, Mechanics
│       │   ├── inventory/      # Stock transfer
│       │   ├── transactions/   # Transaction list & detail
│       │   ├── reports/        # Daily, Commission, Low Stock
│       │   └── settings/       # Billing & config
│       └── components/         # UI components (Sidebar, Cards, etc.)
│
├── nginx/                      # Nginx config (production)
├── docker-compose.yml          # Docker setup
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ & npm
- **PostgreSQL** 16+ (running)
- **Flutter** 3.x (for mobile app)
- **Redis** (optional, for caching)

### 1. Clone & Install

```bash
git clone https://github.com/fachrurroji/RINGNETPOS.git
cd RINGNETPOS
```

### 2. Backend Setup

```bash
cd backend
npm install

# Copy & edit environment
cp .env.example .env
# Edit DATABASE_URL, JWT_SECRET, etc.

# Push schema to database
npx prisma db push

# Generate Prisma client
npx prisma generate

# Seed demo data
npx ts-node prisma/seed.ts

# Start dev server
npm run start:dev
```

Backend akan jalan di `http://localhost:3001/api`

### 3. Web Dashboard Setup

```bash
cd web-dashboard
npm install
npm run dev
```

Dashboard akan jalan di `http://localhost:3000`

### 4. Mobile App Setup

```bash
cd mobile
flutter pub get

# Run on device/emulator
flutter run
```

> **Penting:** Edit `lib/config/api_config.dart` untuk mengarahkan ke IP backend Anda.

---

## ⚙️ Environment Variables

### Backend (`.env`)

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/ringnetpos"

# Redis (optional)
REDIS_HOST=localhost
REDIS_PORT=6379

# Server
PORT=3001
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRATION=1d
```

---

## 🔐 Test Credentials

| Role | Username | Password |
|------|----------|----------|
| Superadmin | `superadmin` | `SuperAdmin123!` |
| Owner | `owner_demo` | `Owner123!` |
| Cashier | `cashier_demo` | `Cashier123!` |
| Warehouse | `warehouse_demo` | `Warehouse123!` |

---

## 📡 API Endpoints

### Auth
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| `POST` | `/api/auth/login` | User login → JWT token | Public |

### Users
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| `POST` | `/api/users` | Create user | Superadmin, Owner |
| `GET` | `/api/users` | List users | Owner+ |
| `PATCH` | `/api/users/:id` | Update user | Owner+ |
| `DELETE` | `/api/users/:id` | Delete user | Owner+ |

### Products
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| `POST` | `/api/products` | Create product | Owner, Manager, Warehouse |
| `GET` | `/api/products` | List products | All roles |
| `GET` | `/api/products/search?q=` | Search products | All roles |
| `GET` | `/api/products/scan/:sku` | Barcode scan lookup | All roles |
| `PATCH` | `/api/products/:id` | Update product | Owner, Manager |
| `DELETE` | `/api/products/:id` | Delete product | Owner, Manager |

### Transactions
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| `POST` | `/api/transactions` | Create transaction | Cashier+ |
| `GET` | `/api/transactions` | List transactions | All roles |
| `GET` | `/api/transactions/:id` | Transaction detail | All roles |
| `PATCH` | `/api/transactions/:id/status` | Update status | Owner, Manager |

### Draft Transactions
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| `POST` | `/api/draft-transactions` | Save draft | Cashier |
| `GET` | `/api/draft-transactions` | List drafts | Cashier |
| `GET` | `/api/draft-transactions/:id` | Draft detail | Cashier |
| `PATCH` | `/api/draft-transactions/:id` | Update draft | Cashier |
| `DELETE` | `/api/draft-transactions/:id` | Delete draft | Cashier |
| `POST` | `/api/draft-transactions/:id/convert` | Convert to transaction | Cashier |

### Inventory
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| `POST` | `/api/inventory` | Add stock movement (IN/OUT) | Owner, Manager, Warehouse |
| `GET` | `/api/inventory` | List inventory | All roles |
| `GET` | `/api/inventory/low-stock` | Low stock alerts | Owner, Manager, Warehouse |
| `PATCH` | `/api/inventory/:id` | Update stock | Owner, Manager, Warehouse |

### Stock Transfer
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| `POST` | `/api/stock-transfer` | Create transfer | Owner, Manager, Warehouse |
| `GET` | `/api/stock-transfer` | List transfers | Owner, Manager, Warehouse |
| `GET` | `/api/stock-transfer/:id` | Transfer detail | Owner, Manager, Warehouse |

### Returns
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| `POST` | `/api/returns` | Create return | Cashier+ |
| `GET` | `/api/returns` | List returns | All roles |
| `GET` | `/api/returns/by-transaction/:id` | Returns by transaction | All roles |

### Reports
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| `GET` | `/api/reports/daily` | Daily sales report | Owner, Manager |
| `GET` | `/api/reports/mechanic-commission` | Mechanic commission | Owner, Manager |
| `GET` | `/api/reports/top-products` | Top selling products | Owner, Manager |
| `GET` | `/api/reports/vehicle-history/:plate` | Vehicle service history | All roles |
| `GET` | `/api/reports/low-stock` | Low stock report | Owner, Manager |

### Other
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| `CRUD` | `/api/branches` | Branch management | Owner+ |
| `CRUD` | `/api/mechanics` | Mechanic management | Owner, Manager |
| `CRUD` | `/api/tenants` | Tenant management | Superadmin |

---

## 📱 Mobile App Features

### Cashier Mode
- ✅ Login & auto-login (JWT stored securely)
- ✅ Dashboard dengan stats omzet & transaksi harian
- ✅ POS — cari produk, scan barcode (kamera), tambah ke cart
- ✅ Cart — atur qty, pilih mekanik, hapus item (swipe)
- ✅ Draft — simpan transaksi belum selesai, resume nanti
- ✅ Riwayat transaksi
- ✅ Profil & logout

### Warehouse Mode
- ✅ Dashboard stok & low stock alerts
- ✅ Tambah produk baru (barang/jasa, harga fleksibel)
- ✅ Stock opname — scan barcode / cari produk → adjust stok
- ✅ Daftar produk

### Role-Based Navigation
Aplikasi otomatis mendeteksi role user dan menampilkan navigasi berbeda:
- **CASHIER** → Home | Kasir | Riwayat | Profil
- **WAREHOUSE** → Stok | Produk | Opname | Profil

---

## 🖥️ Web Dashboard Features

- ✅ Login dengan JWT auth
- ✅ Dashboard overview (stats, charts)
- ✅ Master data: Users, Products, Branches, Mechanics
- ✅ Transaksi: list, detail, status update
- ✅ Inventory: stock transfer antar cabang
- ✅ Reports: daily sales, commission, low stock
- ✅ Settings: billing/subscription
- ✅ Responsive sidebar navigation
- ✅ Modern dark theme UI

---

## 🐳 Docker Deployment

```bash
# Start all services
docker compose up -d

# Services:
# - PostgreSQL: port 5432
# - Redis: port 6379
# - Backend: port 3001
# - Web Dashboard: port 3000
```

---

## 📄 License

MIT License — Lihat [LICENSE](LICENSE) untuk detail.

---

Made with ❤️ for Indonesian Workshop & Retail Businesses
