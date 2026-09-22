export function mapEmployee(row) {
    if (!row) return row;
    return {
        idKaryawan: row.id_karyawan,
        namaKaryawan: row.nama_karyawan,
        kodeKaryawan: row.kode_karyawan,
        tanggalLahir: row.tanggal_lahir,
        alamat: row.alamat,
        createdAt: row.created_at
    };
}

export function mapSalary(row) {
    if (!row) return row;
    return {
        idSalary: row.id_salary,
        bulan: row.bulan,
        tahun: Number(row.tahun),
        salary: Number(row.salary),
        idKaryawan: row.id_karyawan,
        createdAt: row.created_at
    };
}

export function mapBonus(row) {
    if (!row) return row;
    return {
        idBonus: row.id_bonus,
        bonus: Number(row.bonus),
        total: Number(row.total),
        idKaryawan: row.id_karyawan,
        idSalary: row.id_salary,
        createdAt: row.created_at
    };
}
