import { useEffect, useState } from "react";
import { api } from "../services/api.js";
import { formatCurrency } from "../utils/formatter.js";

export default function Dashboard() {
    const [stats, setStats] = useState({
        employees: 0,
        salaries: 0,
        bonuses: 0,
        totalSalary: 0,
        totalBonus: 0,
        totalPayroll: 0
    });
    const [error, setError] = useState("");

    useEffect(() => {
        (async () => {
            try {
                const [employees, salaries, bonuses, report] = await Promise.all([
                    api.getEmployees(),
                    api.getSalaries(),
                    api.getBonuses(),
                    api.getPayrollReport()
                ]);
                setStats({
                    employees: employees.length,
                    salaries: salaries.length,
                    bonuses: bonuses.length,
                    totalSalary: report.reduce((a, r) => a + r.salary, 0),
                    totalBonus: report.reduce((a, r) => a + r.bonus, 0),
                    totalPayroll: report.reduce((a, r) => a + r.total, 0)
                });
            } catch (e) {
                setError(e.message);
            }
        })();
    }, []);

    return (
        <div>
            <h1>Dashboard</h1>
            {error && <div className="alert danger">{error}</div>}
            <div className="cards">
                <div className="stat-card">
                    <span>Total Employee</span>
                    <strong>{stats.employees}</strong>
                </div>
                <div className="stat-card">
                    <span>Total Salary</span>
                    <strong>{stats.salaries}</strong>
                </div>
                <div className="stat-card">
                    <span>Total Bonus</span>
                    <strong>{formatCurrency(stats.totalBonus)}</strong>
                </div>
                <div className="stat-card">
                    <span>Total Payroll</span>
                    <strong>{formatCurrency(stats.totalPayroll)}</strong>
                </div>
            </div>
        </div>
    );
}
