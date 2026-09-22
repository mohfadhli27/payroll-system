import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import app from "../server/app.js";

let server;
let base = "";

let testEmployeeId;
let januariSalaryId;
let februariSalaryId;
let februariBonusId;

const kode = "T" + Math.floor(10000 + Math.random() * 89999);

before(async () => {
    await new Promise((resolve) => {
        server = app.listen(0, () => {
            base = `http://localhost:${server.address().port}`;
            resolve();
        });
    });
});

after(async () => {
    if (testEmployeeId) {
        await req("DELETE", `/api/employees/${testEmployeeId}`);
    }
    await new Promise((resolve) => server.close(resolve));
});

async function req(method, path, body) {
    const res = await fetch(`${base}${path}`, {
        method,
        headers: { "Content-Type": "application/json" },
        body: body ? JSON.stringify(body) : undefined
    });

    let json = null;
    try {
        json = await res.json();
    } catch (_) {
        json = null;
    }

    return { status: res.status, json };
}

/* ---------------- Employee (PRD 17, 52) ---------------- */

test("Employee Test 1: input employee valid -> data berhasil disimpan", async () => {
    const res = await req("POST", "/api/employees", {
        namaKaryawan: "Test Employee",
        kodeKaryawan: kode,
        tanggalLahir: "1995-06-15",
        alamat: "Jakarta"
    });

    assert.equal(res.status, 201);
    assert.ok(res.json.idKaryawan);
    assert.equal(res.json.namaKaryawan, "Test Employee");
    assert.equal(res.json.kodeKaryawan, kode);
    testEmployeeId = res.json.idKaryawan;
});

test("Employee Test 2: kode employee duplikat -> data ditolak", async () => {
    const res = await req("POST", "/api/employees", {
        namaKaryawan: "Duplikat",
        kodeKaryawan: kode,
        tanggalLahir: "1995-06-15",
        alamat: "Jakarta"
    });

    assert.equal(res.status, 400);
});

test("Employee Test 3: nama kosong -> validasi gagal", async () => {
    const res = await req("POST", "/api/employees", {
        namaKaryawan: "",
        kodeKaryawan: "T" + Math.floor(10000 + Math.random() * 89999),
        tanggalLahir: "1995-06-15"
    });

    assert.equal(res.status, 400);
});

test("GET /api/employees menampilkan daftar employee", async () => {
    const res = await req("GET", "/api/employees");
    assert.equal(res.status, 200);
    assert.ok(Array.isArray(res.json));
    assert.ok(res.json.length >= 3);
    assert.ok(res.json.some((e) => e.namaKaryawan === "Adi"));
});

test("GET /api/employees/:id menampilkan detail employee", async () => {
    const res = await req("GET", `/api/employees/${testEmployeeId}`);
    assert.equal(res.status, 200);
    assert.equal(res.json.idKaryawan, testEmployeeId);
});

test("PUT /api/employees/:id mengubah data employee", async () => {
    const res = await req("PUT", `/api/employees/${testEmployeeId}`, {
        namaKaryawan: "Test Employee Updated",
        kodeKaryawan: kode,
        tanggalLahir: "1995-06-15",
        alamat: "Bandung"
    });

    assert.equal(res.status, 200);
    assert.equal(res.json.namaKaryawan, "Test Employee Updated");
    assert.equal(res.json.alamat, "Bandung");
});

test("GET /api/employees/:id untuk id tidak ada -> 404", async () => {
    const res = await req("GET", "/api/employees/999999");
    assert.equal(res.status, 404);
});

/* ---------------- Salary (PRD 18, 53) ---------------- */

test("Salary Test 1: tambah salary valid -> berhasil disimpan", async () => {
    const res = await req("POST", "/api/salaries", {
        idKaryawan: testEmployeeId,
        bulan: "Januari",
        tahun: 2024,
        salary: 5000000
    });

    assert.equal(res.status, 201);
    assert.equal(res.json.bulan, "Januari");
    assert.equal(res.json.salary, 5000000);
    januariSalaryId = res.json.idSalary;
});

test("Salary Test 2: periode sama untuk employee sama -> ditolak", async () => {
    const res = await req("POST", "/api/salaries", {
        idKaryawan: testEmployeeId,
        bulan: "Januari",
        tahun: 2024,
        salary: 9999999
    });

    assert.equal(res.status, 400);
    assert.equal(
        res.json.message,
        "Data salary untuk employee dan periode tersebut sudah ada"
    );
});

test("Salary Test 2 (data seed): Adi Januari 2023 lagi -> ditolak", async () => {
    const res = await req("POST", "/api/salaries", {
        idKaryawan: 1,
        bulan: "Januari",
        tahun: 2023,
        salary: 3500000
    });

    assert.equal(res.status, 400);
});

test("Salary 0 atau negatif -> ditolak (PRD 50)", async () => {
    const res = await req("POST", "/api/salaries", {
        idKaryawan: testEmployeeId,
        bulan: "Maret",
        tahun: 2024,
        salary: 0
    });

    assert.equal(res.status, 400);
});

test("Bulan tidak valid -> ditolak", async () => {
    const res = await req("POST", "/api/salaries", {
        idKaryawan: testEmployeeId,
        bulan: "BulanKe13",
        tahun: 2024,
        salary: 1000000
    });

    assert.equal(res.status, 400);
});

test("Employee tidak ada -> 404 (PRD 50)", async () => {
    const res = await req("POST", "/api/salaries", {
        idKaryawan: 999999,
        bulan: "Maret",
        tahun: 2024,
        salary: 1000000
    });

    assert.equal(res.status, 404);
});

test("Tambah salary periode berbeda diperbolehkan (PRD 9)", async () => {
    const res = await req("POST", "/api/salaries", {
        idKaryawan: testEmployeeId,
        bulan: "Februari",
        tahun: 2024,
        salary: 6000000
    });

    assert.equal(res.status, 201);
    februariSalaryId = res.json.idSalary;
});

test("PUT /api/salaries/:id mengubah data salary", async () => {
    const res = await req("PUT", `/api/salaries/${februariSalaryId}`, {
        idKaryawan: testEmployeeId,
        bulan: "Februari",
        tahun: 2024,
        salary: 6500000
    });

    assert.equal(res.status, 200);
    assert.equal(res.json.salary, 6500000);
});

test("DELETE /api/salaries/:id menghapus data salary", async () => {
    const created = await req("POST", "/api/salaries", {
        idKaryawan: testEmployeeId,
        bulan: "Maret",
        tahun: 2024,
        salary: 4000000
    });
    const idSalary = created.json.idSalary;

    const res = await req("DELETE", `/api/salaries/${idSalary}`);
    assert.equal(res.status, 200);

    const check = await req("GET", `/api/salaries/${idSalary}`);
    assert.equal(check.status, 404);
});

/* ---------------- Bonus (PRD 19, 43, 54) ---------------- */

test("Bonus Test Januari: bonus = 0, total = salary", async () => {
    const res = await req("POST", "/api/bonuses", { idSalary: januariSalaryId });

    assert.equal(res.status, 201);
    assert.equal(res.json.bonus, 0);
    assert.equal(res.json.total, 5000000);
});

test("Bonus Test Februari: bonus = 5%, total = salary + bonus", async () => {
    const res = await req("POST", "/api/bonuses", { idSalary: februariSalaryId });

    assert.equal(res.status, 201);
    assert.equal(res.json.bonus, 325000);
    assert.equal(res.json.total, 6825000);
    februariBonusId = res.json.idBonus;
});

test("PRD 43: nilai bonus/total dari client diabaikan, backend menghitung ulang", async () => {
    const created = await req("POST", "/api/salaries", {
        idKaryawan: testEmployeeId,
        bulan: "April",
        tahun: 2024,
        salary: 4000000
    });
    const idSalary = created.json.idSalary;

    const res = await req("POST", "/api/bonuses", {
        idSalary,
        bonus: 999999999,
        total: 999999999
    });

    assert.equal(res.status, 201);
    assert.equal(res.json.bonus, 200000);
    assert.equal(res.json.total, 4200000);

    await req("DELETE", `/api/salaries/${idSalary}`);
});

test("Satu salary hanya memiliki satu bonus (PRD 10, 43)", async () => {
    const res = await req("POST", "/api/bonuses", { idSalary: februariSalaryId });
    assert.equal(res.status, 400);
    assert.equal(res.json.message, "Bonus untuk salary tersebut sudah ada");
});

test("Bonus untuk salary tidak ada -> 404 (PRD 43)", async () => {
    const res = await req("POST", "/api/bonuses", { idSalary: 999999 });
    assert.equal(res.status, 404);
});

test("PUT /api/bonuses/:id menghitung ulang bonus", async () => {
    const res = await req("PUT", `/api/bonuses/${februariBonusId}`);
    assert.equal(res.status, 200);
    assert.equal(res.json.bonus, 325000);
    assert.equal(res.json.total, 6825000);
});

/* ---------------- Report (PRD 20, 21, 26, 45) ---------------- */

test("Report menampilkan kolom Nama|Bulan|Tahun|Salary|Bonus|Total", async () => {
    const res = await req("GET", "/api/reports/payroll");
    assert.equal(res.status, 200);
    assert.ok(Array.isArray(res.json));
    assert.ok(res.json.length >= 3);

    for (const row of res.json) {
        assert.ok("namaKaryawan" in row);
        assert.ok("bulan" in row);
        assert.ok("tahun" in row);
        assert.ok("salary" in row);
        assert.ok("bonus" in row);
        assert.ok("total" in row);
    }
});

test("Expected Report PRD 45: data seed Adi tampil dengan benar", async () => {
    const res = await req(
        "GET",
        "/api/reports/payroll?tahun=2023&idKaryawan=1&bulan=Januari"
    );
    assert.equal(res.status, 200);
    assert.deepEqual(res.json, [
        {
            namaKaryawan: "Adi",
            kodeKaryawan: "KRY001",
            bulan: "Januari",
            tahun: 2023,
            salary: 3500000,
            bonus: 0,
            total: 3500000
        }
    ]);
});

test("Expected Report PRD 45: Neli Januari dan Februari 2023", async () => {
    const res = await req("GET", "/api/reports/payroll?tahun=2023&idKaryawan=2");
    assert.equal(res.status, 200);
    assert.deepEqual(res.json, [
        {
            namaKaryawan: "Neli",
            kodeKaryawan: "KRY002",
            bulan: "Januari",
            tahun: 2023,
            salary: 4000000,
            bonus: 0,
            total: 4000000
        },
        {
            namaKaryawan: "Neli",
            kodeKaryawan: "KRY002",
            bulan: "Februari",
            tahun: 2023,
            salary: 4000000,
            bonus: 200000,
            total: 4200000
        }
    ]);
});

test("Report filter PRD 21: Neli + Februari + 2023 -> satu baris", async () => {
    const res = await req(
        "GET",
        "/api/reports/payroll?idKaryawan=2&bulan=Februari&tahun=2023"
    );
    assert.equal(res.status, 200);
    assert.equal(res.json.length, 1);
    assert.equal(res.json[0].namaKaryawan, "Neli");
    assert.equal(res.json[0].bonus, 200000);
    assert.equal(res.json[0].total, 4200000);
});

test("Data persistence: data seed tetap ada (bukan mock/localStorage)", async () => {
    const employees = await req("GET", "/api/employees");
    const names = employees.json.map((e) => e.namaKaryawan);
    assert.ok(names.includes("Adi"));
    assert.ok(names.includes("Neli"));
    assert.ok(names.includes("Budi"));
});

/* ---------------- Data Integrity (PRD 50, 51) ---------------- */

test("Hapus employee -> salary dan bonus terkait ikut terhapus (cascade)", async () => {
    const res = await req("DELETE", `/api/employees/${testEmployeeId}`);
    assert.equal(res.status, 200);

    const salaries = await req("GET", "/api/salaries");
    const stillThere = salaries.json.some(
        (s) => s.idKaryawan === testEmployeeId
    );
    assert.equal(stillThere, false);

    const bonuses = await req("GET", "/api/bonuses");
    const bonusStill = bonuses.json.some(
        (b) => b.idKaryawan === testEmployeeId
    );
    assert.equal(bonusStill, false);

    testEmployeeId = null;
});
