import { useEffect, useState } from "react";

const empty = {
    namaKaryawan: "",
    kodeKaryawan: "",
    tanggalLahir: "",
    alamat: ""
};

export default function EmployeeForm({ initial, onSubmit, onReset }) {
    const [form, setForm] = useState(empty);

    useEffect(() => {
        setForm(
            initial
                ? {
                      namaKaryawan: initial.namaKaryawan || "",
                      kodeKaryawan: initial.kodeKaryawan || "",
                      tanggalLahir: initial.tanggalLahir || "",
                      alamat: initial.alamat || ""
                  }
                : empty
        );
    }, [initial]);

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    function handleSubmit(e) {
        e.preventDefault();
        onSubmit(form);
    }

    function handleReset() {
        setForm(empty);
        onReset();
    }

    return (
        <form className="card" onSubmit={handleSubmit}>
            <h2>{initial ? "Edit Employee" : "Tambah Employee"}</h2>
            <div className="form-grid">
                <label>
                    Nama
                    <input
                        name="namaKaryawan"
                        value={form.namaKaryawan}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label>
                    Kode
                    <input
                        name="kodeKaryawan"
                        value={form.kodeKaryawan}
                        onChange={handleChange}
                        maxLength={6}
                        required
                    />
                </label>
                <label>
                    Tanggal Lahir
                    <input
                        type="date"
                        name="tanggalLahir"
                        value={form.tanggalLahir}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label>
                    Alamat
                    <input
                        name="alamat"
                        value={form.alamat}
                        onChange={handleChange}
                    />
                </label>
            </div>
            <div className="actions">
                <button type="submit" className="btn primary">
                    {initial ? "Update" : "Simpan"}
                </button>
                <button type="button" className="btn" onClick={handleReset}>
                    Reset
                </button>
            </div>
        </form>
    );
}
