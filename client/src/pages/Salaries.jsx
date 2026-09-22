import { useEffect, useState } from "react";
import { api } from "../services/api.js";
import SalaryForm from "../components/SalaryForm.jsx";
import SalaryTable from "../components/SalaryTable.jsx";

export default function Salaries() {
    const [salaries, setSalaries] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [editing, setEditing] = useState(null);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    async function load() {
        try {
            const [s, e] = await Promise.all([
                api.getSalaries(),
                api.getEmployees()
            ]);
            setSalaries(s);
            setEmployees(e);
        } catch (e) {
            setError(e.message);
        }
    }

    useEffect(() => {
        load();
    }, []);

    async function handleSubmit(payload) {
        setError("");
        setMessage("");
        try {
            if (editing) {
                await api.updateSalary(editing.idSalary, payload);
                setMessage("Data salary berhasil diubah.");
            } else {
                await api.createSalary(payload);
                setMessage("Data salary berhasil disimpan.");
            }
            setEditing(null);
            load();
        } catch (e) {
            setError(e.message);
        }
    }

    async function handleDelete(id) {
        if (!confirm("Hapus data salary ini? Bonus terkait ikut terhapus.")) return;
        setError("");
        setMessage("");
        try {
            await api.deleteSalary(id);
            setMessage("Data salary dihapus.");
            if (editing?.idSalary === id) setEditing(null);
            load();
        } catch (e) {
            setError(e.message);
        }
    }

    return (
        <div>
            <h1>Data Salary</h1>
            {message && <div className="alert success">{message}</div>}
            {error && <div className="alert danger">{error}</div>}
            <SalaryForm
                employees={employees}
                initial={editing}
                onSubmit={handleSubmit}
                onReset={() => setEditing(null)}
            />
            <SalaryTable
                salaries={salaries}
                onEdit={setEditing}
                onDelete={handleDelete}
            />
        </div>
    );
}
