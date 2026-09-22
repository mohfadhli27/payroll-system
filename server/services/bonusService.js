import supabase from "../config/supabase.js";
import { mapBonus } from "../utils/mappers.js";
import { appError } from "../utils/appError.js";

export function calculateBonus(bulan, salary) {
    let bonus;

    if (bulan === "Januari") {
        bonus = 0;
    } else {
        bonus = salary * 0.05;
    }

    const total = salary + bonus;

    return { bonus, total };
}

function withRelations(row) {
    return {
        ...mapBonus(row),
        namaKaryawan: row.employee ? row.employee.nama_karyawan : null,
        bulan: row.salary ? row.salary.bulan : null,
        tahun: row.salary ? Number(row.salary.tahun) : null,
        salary: row.salary ? Number(row.salary.salary) : null
    };
}

export async function listBonuses() {
    const { data, error } = await supabase
        .from("bonus")
        .select("*, salary(bulan, tahun, salary), employee(nama_karyawan, kode_karyawan)")
        .order("id_bonus", { ascending: true });

    if (error) throw appError(error.message, 500);
    return (data || []).map(withRelations);
}

export async function getBonus(id) {
    const { data, error } = await supabase
        .from("bonus")
        .select("*, salary(bulan, tahun, salary), employee(nama_karyawan, kode_karyawan)")
        .eq("id_bonus", id)
        .maybeSingle();

    if (error) throw appError(error.message, 500);
    if (!data) throw appError("Bonus tidak ditemukan", 404);
    return withRelations(data);
}

async function getSalaryForBonus(idSalary) {
    const { data, error } = await supabase
        .from("salary")
        .select("*")
        .eq("id_salary", idSalary)
        .maybeSingle();

    if (error) throw appError(error.message, 500);
    if (!data) throw appError("Salary tidak ditemukan", 404);
    return data;
}

async function findExistingBonus(idSalary, excludeId) {
    let query = supabase
        .from("bonus")
        .select("id_bonus")
        .eq("id_salary", idSalary);

    if (excludeId) {
        query = query.neq("id_bonus", excludeId);
    }

    const { data } = await query.maybeSingle();
    return data;
}

export async function createBonus(payload) {
    const { idSalary } = payload;

    if (!idSalary) throw appError("Salary wajib dipilih", 400);

    const salaryData = await getSalaryForBonus(idSalary);
    const salary = Number(salaryData.salary);

    if (salary <= 0) throw appError("Salary harus bernilai positif", 400);

    const existing = await findExistingBonus(idSalary);
    if (existing) {
        throw appError("Bonus untuk salary tersebut sudah ada", 400);
    }

    const { bonus, total } = calculateBonus(salaryData.bulan, salary);

    const { data, error } = await supabase
        .from("bonus")
        .insert({
            bonus,
            total,
            id_karyawan: salaryData.id_karyawan,
            id_salary: salaryData.id_salary
        })
        .select()
        .single();

    if (error) {
        if (error.code === "23505") {
            throw appError("Bonus untuk salary tersebut sudah ada", 400);
        }
        throw appError(error.message, 400);
    }

    return mapBonus(data);
}

export async function updateBonus(id) {
    const { data: existingBonus, error: bonusError } = await supabase
        .from("bonus")
        .select("*")
        .eq("id_bonus", id)
        .maybeSingle();

    if (bonusError) throw appError(bonusError.message, 500);
    if (!existingBonus) throw appError("Bonus tidak ditemukan", 404);

    const salaryData = await getSalaryForBonus(existingBonus.id_salary);
    const salary = Number(salaryData.salary);

    if (salary <= 0) throw appError("Salary harus bernilai positif", 400);

    const { bonus, total } = calculateBonus(salaryData.bulan, salary);

    const { data, error } = await supabase
        .from("bonus")
        .update({ bonus, total, id_karyawan: salaryData.id_karyawan })
        .eq("id_bonus", id)
        .select()
        .single();

    if (error) throw appError(error.message, 400);

    return mapBonus(data);
}

export async function deleteBonus(id) {
    const { error } = await supabase
        .from("bonus")
        .delete()
        .eq("id_bonus", id);

    if (error) throw appError(error.message, 400);

    return { success: true };
}
