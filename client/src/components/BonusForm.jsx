import { useState } from "react";
import { formatCurrency } from "../utils/formatter.js";

export default function BonusForm({ salaries, result, onGenerate }) {
    const [idSalary, setIdSalary] = useState("");

    const selected = salaries.find(
        (s) => String(s.idSalary) === String(idSalary)
    );

    function handleSubmit(e) {
        e.preventDefault();
        if (idSalary) onGenerate(Number(idSalary));
    }

    return (
        <form className="card" onSubmit={handleSubmit}>
            <h2>Generate Bonus</h2>
            <div className="form-grid">
                <label>
                    Salary
                    <select
                        value={idSalary}
                        onChange={(e) => setIdSalary(e.target.value)}
                        required
                    >
                        <option value="">-- Pilih Salary --</option>
                        {salaries.map((s) => (
                            <option key={s.idSalary} value={s.idSalary}>
                                {s.namaKaryawan} - {s.bulan} {s.tahun}
                            </option>
                        ))}
                    </select>
                </label>
            </div>

            {selected && (
                <div className="detail-grid">
                    <span>Employee : {selected.namaKaryawan}</span>
                    <span>Bulan : {selected.bulan}</span>
                    <span>Tahun : {selected.tahun}</span>
                    <span>Salary : {formatCurrency(selected.salary)}</span>
                    <span>Bonus : {result ? formatCurrency(result.bonus) : "-"}</span>
                    <span>Total : {result ? formatCurrency(result.total) : "-"}</span>
                </div>
            )}

            <div className="actions">
                <button
                    type="submit"
                    className="btn primary"
                    disabled={!idSalary}
                >
                    Generate Bonus
                </button>
            </div>
        </form>
    );
}
