# Sistem Perhitungan Gaji dan Bonus Karyawan

Aplikasi web untuk mengelola data karyawan, gaji, bonus, dan laporan payroll.

## Tech Stack

- **Frontend:** React.js + Vite
- **Backend:** Node.js + Express.js
- **Database:** Supabase (PostgreSQL)

## Struktur Project

```text
payroll-system/
├── client/        # React frontend
├── server/        # Express backend
└── database/      # SQL schema + seed
```

## Persiapan Database

1. Buat project di [Supabase](https://supabase.com).
2. Buka **SQL Editor** dan jalankan `database/schema.sql`.
3. (Opsional) Jalankan `database/seed.sql` untuk data awal.

## Menjalankan Backend

```bash
cd server
npm install
cp .env.example .env   # isi SUPABASE_URL dan SUPABASE_SERVICE_ROLE_KEY
npm run dev
```

Backend berjalan di `http://localhost:3000`.

## Menjalankan Frontend

```bash
cd client
npm install
npm run dev
```

Frontend berjalan di `http://localhost:5173` (lihat output Vite).

## Environment Variables

### Backend (`server/.env`)

```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
PORT=3000
```

### Frontend (`client/.env`)

```env
VITE_API_URL=http://localhost:3000
```

> **Penting:** jangan commit `SUPABASE_SERVICE_ROLE_KEY` atau `.env` ke repository.

## Testing

Test berada di folder `tests/` (terpisah dari kode aplikasi). Jalankan dari root project:

```bash
npm test
```

Mencakup:
- **Unit test** aturan bonus: Januari = 0, Februari–Desember = 5%, total = salary + bonus (PRD 13–16).
- **Integration test API**: CRUD employee/salary/bonus, validasi (kode duplikat, periode ganda, salary <= 0, bulan tidak valid), bonus diabaikan dari client, satu salary satu bonus, report + filter, dan cascade delete (PRD 17–26, 43, 50–54).

## Business Rules

- Bonus bulan **Januari** = `0`.
- Bonus bulan **Februari–Desember** = `5% × Salary`.
- Total = `Salary + Bonus`.
- Satu karyawan tidak boleh punya dua salary pada periode (bulan + tahun) yang sama.
- Satu salary hanya boleh punya satu bonus.

## REST API

| Method | Endpoint | Keterangan |
|---|---|---|
| GET | `/api/employees` | Daftar employee |
| POST | `/api/employees` | Tambah employee |
| PUT | `/api/employees/:id` | Ubah employee |
| DELETE | `/api/employees/:id` | Hapus employee |
| GET | `/api/salaries` | Daftar salary |
| POST | `/api/salaries` | Tambah salary |
| PUT | `/api/salaries/:id` | Ubah salary |
| DELETE | `/api/salaries/:id` | Hapus salary |
| GET | `/api/bonuses` | Daftar bonus |
| POST | `/api/bonuses` | Generate bonus (body: `{ "idSalary": 3 }`) |
| PUT | `/api/bonuses/:id` | Hitung ulang bonus |
| DELETE | `/api/bonuses/:id` | Hapus bonus |
| GET | `/api/reports/payroll` | Laporan (filter: `bulan`, `tahun`, `idKaryawan`) |
