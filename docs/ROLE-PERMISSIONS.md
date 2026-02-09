# Ring Pro — Role & Permission Matrix

## Hierarki User

```
SUPERADMIN (Ring Pro Team)
    └── OWNER (Pemilik Bengkel)
            ├── MANAGER (Kepala Cabang)
            └── CASHIER (Kasir)
```

---

## 1. SUPERADMIN

> **Deskripsi:** Tim internal Ring Pro yang mengelola seluruh platform SaaS.

| Platform | Fitur |
|----------|-------|
| **Admin Panel** | Dashboard semua tenant |
| | Lihat statistik global |
| | Manage semua tenant (CRUD) |
| | Manage subscription & billing |
| | Suspend/aktifkan tenant |
| | Lihat revenue platform |

### Akses:
- ❌ Tidak bisa akses data transaksi detail tenant
- ❌ Tidak bisa login ke akun tenant
- ✅ Bisa reset password Owner jika diminta

---

## 2. OWNER

> **Deskripsi:** Pemilik bengkel yang berlangganan Ring Pro. Akses penuh ke semua data bisnisnya.

### Web Dashboard

| Kategori | Fitur | Akses |
|----------|-------|-------|
| **Dashboard** | Lihat omzet hari ini | ✅ |
| | Lihat total transaksi | ✅ |
| | Lihat fee mekanik | ✅ |
| | Alert stok menipis | ✅ |
| **Laporan** | Laporan harian per cabang | ✅ |
| | Laporan komisi mekanik | ✅ |
| | Laporan produk terlaris | ✅ |
| | Laporan stok menipis | ✅ |
| | Riwayat kendaraan | ✅ |
| | Export Excel | ✅ |
| **Master Data** | Kelola Cabang (CRUD) | ✅ |
| | Kelola Produk (CRUD) | ✅ |
| | Set harga jual & min stok | ✅ |
| | Kelola Mekanik (CRUD) | ✅ |
| | Kelola Karyawan (CRUD) | ✅ |
| | Assign karyawan ke cabang | ✅ |
| **Billing** | Lihat status langganan | ✅ |
| | Upgrade/perpanjang | ✅ |
| | Lihat riwayat pembayaran | ✅ |
| **Settings** | Ubah profil bengkel | ✅ |
| | Ubah password | ✅ |

### Mobile App
- ❌ Owner biasanya tidak perlu akses mobile
- ✅ Bisa login jika diperlukan (akses sama seperti Manager)

---

## 3. MANAGER

> **Deskripsi:** Kepala cabang atau supervisor yang mengelola operasional harian.

### Web Dashboard

| Kategori | Fitur | Akses |
|----------|-------|-------|
| **Dashboard** | Lihat omzet cabangnya | ✅ |
| | Lihat total transaksi | ✅ |
| | Alert stok menipis | ✅ |
| **Laporan** | Laporan harian (cabang sendiri) | ✅ |
| | Laporan komisi mekanik | ✅ |
| | Riwayat kendaraan | ✅ |
| **Master Data** | Lihat Cabang | 👁️ View only |
| | Kelola Produk (cabang sendiri) | ✅ |
| | Kelola Mekanik (cabang sendiri) | ✅ |
| | Lihat Karyawan | 👁️ View only |
| **Billing** | - | ❌ |
| **Settings** | Ubah password sendiri | ✅ |

### Mobile App

| Kategori | Fitur | Akses |
|----------|-------|-------|
| **Home** | Lihat stats hari ini | ✅ |
| **Kasir** | Input transaksi | ✅ |
| | Scan barcode | ✅ |
| | Input plat nomor | ✅ |
| | Pilih mekanik + fee | ✅ |
| **Produk** | Lihat produk | ✅ |
| | Tambah produk baru | ✅ |
| | Edit harga | ✅ |
| **Riwayat** | Lihat transaksi hari ini | ✅ |
| | Void transaksi (dengan PIN) | ✅ |
| **Stok** | Lihat stok | ✅ |
| | Stok opname / adjustment | ✅ |

---

## 4. CASHIER (Kasir)

> **Deskripsi:** Petugas kasir yang menangani transaksi pelanggan.

### Web Dashboard
- ❌ Tidak ada akses web dashboard

### Mobile App

| Kategori | Fitur | Akses |
|----------|-------|-------|
| **Home** | Lihat stats hari ini | ✅ |
| **Kasir** | Input transaksi | ✅ |
| | Scan barcode | ✅ |
| | Input plat nomor | ✅ |
| | Pilih mekanik + fee | ✅ |
| | Hitung kembalian | ✅ |
| **Produk** | Lihat produk | 👁️ View only |
| | Cari produk | ✅ |
| | Tambah/edit produk | ❌ |
| **Riwayat** | Lihat transaksi hari ini | ✅ |
| | Void transaksi | ❌ |
| **Stok** | Lihat stok | 👁️ View only |
| | Adjustment | ❌ |

---

## Ringkasan Akses

| Fitur | SuperAdmin | Owner | Manager | Kasir |
|-------|:----------:|:-----:|:-------:|:-----:|
| Manage Tenant | ✅ | ❌ | ❌ | ❌ |
| Billing Tenant | ✅ | ❌ | ❌ | ❌ |
| Lihat Semua Cabang | ❌ | ✅ | ❌ | ❌ |
| Kelola Karyawan | ❌ | ✅ | ❌ | ❌ |
| Kelola Cabang | ❌ | ✅ | ❌ | ❌ |
| Kelola Produk | ❌ | ✅ | ✅ | ❌ |
| Kelola Mekanik | ❌ | ✅ | ✅ | ❌ |
| Stok Opname | ❌ | ✅ | ✅ | ❌ |
| Input Transaksi | ❌ | ✅ | ✅ | ✅ |
| Void Transaksi | ❌ | ✅ | ✅ | ❌ |
| Laporan Lengkap | ❌ | ✅ | ✅* | ❌ |
| Billing/Upgrade | ❌ | ✅ | ❌ | ❌ |

*Manager hanya lihat laporan cabang sendiri

---

## Platform Matrix

| Role | Web Dashboard | Mobile App |
|------|:-------------:|:----------:|
| SuperAdmin | ✅ Admin Panel | ❌ |
| Owner | ✅ Full | ⚪ Optional |
| Manager | ✅ Limited | ✅ Full |
| Cashier | ❌ | ✅ POS Only |

---

## Catatan Penting

1. **Multi-Cabang:** Manager dan Kasir di-assign ke cabang tertentu. Data yang dilihat hanya dari cabang tersebut.

2. **Void Transaksi:** Hanya Manager ke atas yang bisa void, untuk mencegah fraud.

3. **Stok Opname:** Kasir tidak bisa adjust stok manual untuk keamanan.

4. **Billing:** Hanya Owner yang bisa akses, karena terkait pembayaran.

5. **Audit Trail:** Semua aksi tercatat (siapa, kapan, apa) untuk tracking.
