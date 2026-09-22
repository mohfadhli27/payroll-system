import supabase from "../config/supabase.js";
import { appError } from "../utils/appError.js";

export async function getPayrollReport(filters = {}) {
    const { bulan, tahun, idKaryawan } = filters;

    let query = supabase
        .from("salary")
        .select(
            "id_salary, bulan, tahun, salary, id_karyawan, employee(nama_karyawan, kode_karyawan), bonus(bonus, total)"
        )
        .order("tahun", { ascending: true })
        .order("id_salary", { ascending: true });

    if (bulan) query = query.eq("bulan", bulan);
    if (tahun) query = query.eq("tahun", Number(tahun));
    if (idKaryawan) query = query.eq("id_karyawan", idKaryawan);

    const { data, error } = await query;

    if (error) throw appError(error.message, 500);

    return (data || [])
        .filter((row) => row.bonus != null)
        .map((row) => {
            const bonus = row.bonus;
            return {
                namaKaryawan: row.employee ? row.employee.nama_karyawan : null,
                kodeKaryawan: row.employee ? row.employee.kode_karyawan : null,
                bulan: row.bulan,
                tahun: Number(row.tahun),
                salary: Number(row.salary),
                bonus: bonus ? Number(bonus.bonus) : 0,
                total: bonus ? Number(bonus.total) : Number(row.salary)
            };
        });
}
