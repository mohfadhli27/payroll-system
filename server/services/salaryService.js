import supabase from "../config/supabase.js";
import { mapSalary } from "../utils/mappers.js";
import { appError } from "../utils/appError.js";
import { VALID_BULAN } from "../utils/constants.js";

function withEmployeeInfo(row) {
    return {
        ...mapSalary(row),
        namaKaryawan: row.employee ? row.employee.nama_karyawan : null,
        kodeKaryawan: row.employee ? row.employee.kode_karyawan : null
    };
}

export async function listSalaries() {
    const { data, error } = await supabase
        .from("salary")
        .select("*, employee(nama_karyawan, kode_karyawan)")
        .order("id_salary", { ascending: true });

    if (error) throw appError(error.message, 500);
    return (data || []).map(withEmployeeInfo);
}

export async function getSalary(id) {
    const { data, error } = await supabase
        .from("salary")
        .select("*, employee(nama_karyawan, kode_karyawan)")
        .eq("id_salary", id)
        .maybeSingle();

    if (error) throw appError(error.message, 500);
    if (!data) throw appError("Salary tidak ditemukan", 404);
    return withEmployeeInfo(data);
}

function validateSalaryPayload(payload) {
    const { idKaryawan, bulan, tahun, salary } = payload;

    if (!idKaryawan) throw appError("Employee wajib dipilih", 400);
    if (!bulan || !VALID_BULAN.includes(bulan)) {
        throw appError("Bulan tidak valid", 400);
    }
    if (tahun === undefined || tahun === null || tahun === "") {
        throw appError("Tahun wajib diisi", 400);
    }
    if (!Number.isFinite(Number(tahun))) {
        throw appError("Tahun tidak valid", 400);
    }
    if (!salary || Number(salary) <= 0) {
        throw appError("Salary harus lebih besar dari 0", 400);
    }
}

async function ensureEmployeeExists(idKaryawan) {
    const { data } = await supabase
        .from("employee")
        .select("id_karyawan")
        .eq("id_karyawan", idKaryawan)
        .maybeSingle();

    if (!data) throw appError("Employee tidak ditemukan", 404);
}

async function findDuplicateSalary(idKaryawan, bulan, tahun, excludeId) {
    let query = supabase
        .from("salary")
        .select("id_salary")
        .eq("id_karyawan", idKaryawan)
        .eq("bulan", bulan)
        .eq("tahun", Number(tahun));

    if (excludeId) {
        query = query.neq("id_salary", excludeId);
    }

    const { data } = await query.maybeSingle();
    return data;
}

export async function createSalary(payload) {
    const { idKaryawan, bulan, tahun, salary } = payload;
    validateSalaryPayload(payload);
    await ensureEmployeeExists(idKaryawan);

    const existing = await findDuplicateSalary(idKaryawan, bulan, tahun);
    if (existing) {
        throw appError("Data salary untuk employee dan periode tersebut sudah ada", 400);
    }

    const { data, error } = await supabase
        .from("salary")
        .insert({
            id_karyawan: idKaryawan,
            bulan,
            tahun: Number(tahun),
            salary: Number(salary)
        })
        .select()
        .single();

    if (error) {
        if (error.code === "23505") {
            throw appError("Data salary untuk employee dan periode tersebut sudah ada", 400);
        }
        throw appError(error.message, 400);
    }

    return mapSalary(data);
}

export async function updateSalary(id, payload) {
    const { idKaryawan, bulan, tahun, salary } = payload;
    validateSalaryPayload(payload);
    await ensureEmployeeExists(idKaryawan);

    const existing = await findDuplicateSalary(idKaryawan, bulan, tahun, id);
    if (existing) {
        throw appError("Data salary untuk employee dan periode tersebut sudah ada", 400);
    }

    const { data, error } = await supabase
        .from("salary")
        .update({
            id_karyawan: idKaryawan,
            bulan,
            tahun: Number(tahun),
            salary: Number(salary)
        })
        .eq("id_salary", id)
        .select()
        .single();

    if (error) {
        if (error.code === "23505") {
            throw appError("Data salary untuk employee dan periode tersebut sudah ada", 400);
        }
        if (error.code === "PGRST116") {
            throw appError("Salary tidak ditemukan", 404);
        }
        throw appError(error.message, 400);
    }

    return mapSalary(data);
}

export async function deleteSalary(id) {
    const { error } = await supabase
        .from("salary")
        .delete()
        .eq("id_salary", id);

    if (error) throw appError(error.message, 400);

    return { success: true };
}
