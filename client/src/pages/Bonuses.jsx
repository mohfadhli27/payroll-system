import { useEffect, useState } from "react";
import { api } from "../services/api.js";
import { formatCurrency } from "../utils/formatter.js";
import BonusForm from "../components/BonusForm.jsx";
import BonusTable from "../components/BonusTable.jsx";

export default function Bonuses() {
    const [salaries, setSalaries] = useState([]);
    const [bonuses, setBonuses] = useState([]);
    const [result, setResult] = useState(null);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    async function load() {
        try {
            const [s, b] = await Promise.all([
                api.getSalaries(),
                api.getBonuses()
            ]);
            setSalaries(s);
            setBonuses(b);
        } catch (e) {
            setError(e.message);
        }
    }

    useEffect(() => {
        load();
    }, []);

    const availableSalaries = salaries.filter(
        (s) => !bonuses.some((b) => b.idSalary === s.idSalary)
    );

    async function handleGenerate(idSalary) {
        setError("");
        setMessage("");
        setResult(null);
        try {
            const res = await api.createBonus({ idSalary });
            setResult(res);
            setMessage(
                `Bonus berhasil dibuat: Bonus ${formatCurrency(
                    res.bonus
                )}, Total ${formatCurrency(res.total)}`
            );
            load();
        } catch (e) {
            setError(e.message);
        }
    }

    async function handleDelete(id) {
        if (!confirm("Hapus bonus ini?")) return;
        setError("");
        setMessage("");
        setResult(null);
        try {
            await api.deleteBonus(id);
            setMessage("Bonus dihapus.");
            load();
        } catch (e) {
            setError(e.message);
        }
    }

    return (
        <div>
            <h1>Data Bonus</h1>
            {message && <div className="alert success">{message}</div>}
            {error && <div className="alert danger">{error}</div>}
            <BonusForm
                salaries={availableSalaries}
                result={result}
                onGenerate={handleGenerate}
            />
            <BonusTable bonuses={bonuses} onDelete={handleDelete} />
        </div>
    );
}
