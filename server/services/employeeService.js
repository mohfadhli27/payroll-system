import supabase from "../config/supabase.js";
import { mapEmployee } from "../utils/mappers.js";
import { appError } from "../utils/appError.js";

export async function listEmployees() {
    const { data, error } = await supabase
        .from("employee")
        .select("*")
        .order("id_karyawan", { ascending: true });

    if (error) throw appError(error.message, 500);
    return (data || []).map(mapEmployee);
}

export async function getEmployee(id) {
    const { data, error } = await supabase
        .from("employee")
        .select("*")
        .eq("id_karyawan", id)
        .maybeSingle();

    if (error) throw appError(error.message, 500);
    if (!data) throw appError("Employee tidak ditemukan", 404);
    return mapEmployee(data);
}

export async function createEmployee(payload) {
    const { namaKaryawan, kodeKaryawan, tanggalLahir, alamat } = payload;

    if (!namaKaryawan || !String(namaKaryawan).trim()) {
        throw appError("Nama karyawan wajib diisi", 400);
    }
    if (!kodeKaryawan || !String(kodeKaryawan).trim()) {
        throw appError("Kode karyawan wajib diisi", 400);
    }
    if (String(kodeKaryawan).trim().length > 6) {
        throw appError("Kode karyawan maksimal 6 karakter", 400);
    }
    if (!tanggalLahir) {
        throw appError("Tanggal lahir wajib diisi", 400);
    }

    const { data, error } = await supabase
        .from("employee")
        .insert({
            nama_karyawan: String(namaKaryawan).trim(),
            kode_karyawan: String(kodeKaryawan).trim(),
            tanggal_lahir: tanggalLahir,
            alamat: alamat ? String(alamat).trim() : null
        })
        .select()
        .single();

    if (error) {
        if (error.code === "23505") {
            throw appError("Kode karyawan sudah digunakan", 400);
        }
        throw appError(error.message, 400);
    }

    return mapEmployee(data);
}

export async function updateEmployee(id, payload) {
    const { namaKaryawan, kodeKaryawan, tanggalLahir, alamat } = payload;

    if (!namaKaryawan || !String(namaKaryawan).trim()) {
        throw appError("Nama karyawan wajib diisi", 400);
    }
    if (!kodeKaryawan || !String(kodeKaryawan).trim()) {
        throw appError("Kode karyawan wajib diisi", 400);
    }
    if (String(kodeKaryawan).trim().length > 6) {
        throw appError("Kode karyawan maksimal 6 karakter", 400);
    }
    if (!tanggalLahir) {
        throw appError("Tanggal lahir wajib diisi", 400);
    }

    const { data, error } = await supabase
        .from("employee")
        .update({
            nama_karyawan: String(namaKaryawan).trim(),
            kode_karyawan: String(kodeKaryawan).trim(),
            tanggal_lahir: tanggalLahir,
            alamat: alamat ? String(alamat).trim() : null
        })
        .eq("id_karyawan", id)
        .select()
        .single();

    if (error) {
        if (error.code === "23505") {
            throw appError("Kode karyawan sudah digunakan", 400);
        }
        if (error.code === "PGRST116") {
            throw appError("Employee tidak ditemukan", 404);
        }
        throw appError(error.message, 400);
    }

    return mapEmployee(data);
}

export async function deleteEmployee(id) {
    const { error } = await supabase
        .from("employee")
        .delete()
        .eq("id_karyawan", id);

    if (error) throw appError(error.message, 400);

    return { success: true };
}
