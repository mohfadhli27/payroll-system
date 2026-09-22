import { useEffect, useState } from "react";
import { MONTHS } from "../utils/constants.js";

const empty = {
    idKaryawan: "",
    bulan: "",
    tahun: "",
    salary: ""
};

export default function SalaryForm({ employees, initial, onSubmit, onReset }) {
    const [form, setForm] = useState(empty);

    useEffect(() => {
        setForm(
            initial
                ? {
                      idKaryawan: initial.idKaryawan || "",
                      bulan: initial.bulan || "",
                      tahun: initial.tahun || "",
                      salary: initial.salary || ""
                  }
                : empty
        );
    }, [initial]);

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    function handleSubmit(e) {
        e.preventDefault();
        onSubmit({
            idKaryawan: Number(form.idKaryawan),
            bulan: form.bulan,
            tahun: Number(form.tahun),
            salary: Number(form.salary)
        });
    }

    function handleReset() {
        setForm(empty);
        onReset();
    }

    return (
        <form className="card" onSubmit={handleSubmit}>
            <h2>{initial ? "Edit Salary" : "Input Salary"}</h2>
            <div className="form-grid">
                <label>
                    Karyawan
                    <select
                        name="idKaryawan"
                        value={form.idKaryawan}
                        onChange={handleChange}
                        required
                    >
                        <option value="">-- Pilih Karyawan --</option>
                        {employees.map((e) => (
                            <option key={e.idKaryawan} value={e.idKaryawan}>
                                {e.namaKaryawan} ({e.kodeKaryawan})
                            </option>
                        ))}
                    </select>
                </label>
                <label>
                    Bulan
                    <select
                        name="bulan"
                        value={form.bulan}
                        onChange={handleChange}
                        required
                    >
                        <option value="">-- Pilih Bulan --</option>
                        {MONTHS.map((m) => (
                            <option key={m} value={m}>
                                {m}
                            </option>
                        ))}
                    </select>
                </label>
                <label>
                    Tahun
                    <input
                        type="number"
                        name="tahun"
                        value={form.tahun}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label>
                    Salary
                    <input
                        type="number"
                        name="salary"
                        value={form.salary}
                        onChange={handleChange}
                        min="1"
                        required
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
