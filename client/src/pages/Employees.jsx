import { useEffect, useState } from "react";
import { api } from "../services/api.js";
import EmployeeForm from "../components/EmployeeForm.jsx";
import EmployeeTable from "../components/EmployeeTable.jsx";

export default function Employees() {
    const [employees, setEmployees] = useState([]);
    const [editing, setEditing] = useState(null);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    async function load() {
        try {
            setEmployees(await api.getEmployees());
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
                await api.updateEmployee(editing.idKaryawan, payload);
                setMessage("Data employee berhasil diubah.");
            } else {
                await api.createEmployee(payload);
                setMessage("Data employee berhasil disimpan.");
            }
            setEditing(null);
            load();
        } catch (e) {
            setError(e.message);
        }
    }

    async function handleDelete(id) {
        if (!confirm("Hapus employee ini? Data salary dan bonus terkait ikut terhapus.")) return;
        setError("");
        setMessage("");
        try {
            await api.deleteEmployee(id);
            setMessage("Data employee dihapus.");
            if (editing?.idKaryawan === id) setEditing(null);
            load();
        } catch (e) {
            setError(e.message);
        }
    }

    return (
        <div>
            <h1>Data Employee</h1>
            {message && <div className="alert success">{message}</div>}
            {error && <div className="alert danger">{error}</div>}
            <EmployeeForm
                initial={editing}
                onSubmit={handleSubmit}
                onReset={() => setEditing(null)}
            />
            <EmployeeTable
                employees={employees}
                onEdit={setEditing}
                onDelete={handleDelete}
            />
        </div>
    );
}
