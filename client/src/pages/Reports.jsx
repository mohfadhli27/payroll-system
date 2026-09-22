import { useEffect, useState } from "react";
import { api } from "../services/api.js";
import { MONTHS } from "../utils/constants.js";
import ReportTable from "../components/ReportTable.jsx";

export default function Reports() {
    const [employees, setEmployees] = useState([]);
    const [report, setReport] = useState([]);
    const [filters, setFilters] = useState({
        idKaryawan: "",
        bulan: "",
        tahun: ""
    });
    const [error, setError] = useState("");

    async function load(f = filters) {
        try {
            const clean = {};
            if (f.idKaryawan) clean.idKaryawan = f.idKaryawan;
            if (f.bulan) clean.bulan = f.bulan;
            if (f.tahun) clean.tahun = f.tahun;
            setReport(await api.getPayrollReport(clean));
        } catch (e) {
            setError(e.message);
        }
    }

    useEffect(() => {
        api.getEmployees().then(setEmployees).catch(() => {});
        load();
    }, []);

    function handleChange(e) {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    }

    function handleFilter(e) {
        e.preventDefault();
        load();
    }

    function handleReset() {
        setFilters({ idKaryawan: "", bulan: "", tahun: "" });
        load({ idKaryawan: "", bulan: "", tahun: "" });
    }

    return (
        <div>
            <h1>Report Payroll</h1>
            {error && <div className="alert danger">{error}</div>}
            <form className="card" onSubmit={handleFilter}>
                <div className="filters">
                    <label>
                        Karyawan
                        <select
                            name="idKaryawan"
                            value={filters.idKaryawan}
                            onChange={handleChange}
                        >
                            <option value="">Semua</option>
                            {employees.map((e) => (
                                <option key={e.idKaryawan} value={e.idKaryawan}>
                                    {e.namaKaryawan}
                                </option>
                            ))}
                        </select>
                    </label>
                    <label>
                        Bulan
                        <select
                            name="bulan"
                            value={filters.bulan}
                            onChange={handleChange}
                        >
                            <option value="">Semua</option>
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
                            value={filters.tahun}
                            onChange={handleChange}
                            placeholder="2023"
                        />
                    </label>
                    <button type="submit" className="btn primary">
                        Filter
                    </button>
                    <button type="button" className="btn" onClick={handleReset}>
                        Reset
                    </button>
                </div>
            </form>
            <ReportTable report={report} />
        </div>
    );
}
