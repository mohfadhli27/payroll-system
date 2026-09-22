import { useEffect, useState } from "react";
import { api } from "../services/api.js";
import { formatCurrency } from "../utils/formatter.js";

const icons = {
    employee: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
    ),
    salary: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="6" width="20" height="12" rx="2" />
            <circle cx="12" cy="12" r="2.5" />
            <path d="M6 12h.01M18 12h.01" />
        </svg>
    ),
    bonus: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 12v9H4v-9" />
            <path d="M2 7h20v5H2z" />
            <path d="M12 22V7" />
            <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
            <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
        </svg>
    ),
    payroll: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 3v18h18" />
            <path d="M18 17V9" />
            <path d="M13 17V5" />
            <path d="M8 17v-3" />
        </svg>
    )
};

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
                    <div className="stat-top">
                        <span>Total Employee</span>
                        <span className="stat-icon icon-blue">{icons.employee}</span>
                    </div>
                    <strong>{stats.employees}</strong>
                </div>
                <div className="stat-card">
                    <div className="stat-top">
                        <span>Total Salary</span>
                        <span className="stat-icon icon-violet">{icons.salary}</span>
                    </div>
                    <strong>{stats.salaries}</strong>
                </div>
                <div className="stat-card">
                    <div className="stat-top">
                        <span>Total Bonus</span>
                        <span className="stat-icon icon-green">{icons.bonus}</span>
                    </div>
                    <strong>{formatCurrency(stats.totalBonus)}</strong>
                </div>
                <div className="stat-card">
                    <div className="stat-top">
                        <span>Total Payroll</span>
                        <span className="stat-icon icon-amber">{icons.payroll}</span>
                    </div>
                    <strong>{formatCurrency(stats.totalPayroll)}</strong>
                </div>
            </div>
        </div>
    );
}
