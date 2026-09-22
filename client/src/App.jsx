import { Routes, Route, NavLink } from "react-router-dom";
import Dashboard from "./pages/Dashboard.jsx";
import Employees from "./pages/Employees.jsx";
import Salaries from "./pages/Salaries.jsx";
import Bonuses from "./pages/Bonuses.jsx";
import Reports from "./pages/Reports.jsx";

const navItems = [
    { to: "/", label: "Dashboard" },
    { to: "/employees", label: "Employee" },
    { to: "/salaries", label: "Salary" },
    { to: "/bonuses", label: "Bonus" },
    { to: "/reports", label: "Report" }
];

export default function App() {
    return (
        <div className="app">
            <header className="navbar">
                <span className="brand">Payroll System</span>
                <nav>
                    {navItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            end={item.to === "/"}
                            className={({ isActive }) =>
                                isActive ? "nav-link active" : "nav-link"
                            }
                        >
                            {item.label}
                        </NavLink>
                    ))}
                </nav>
            </header>
            <main className="container">
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/employees" element={<Employees />} />
                    <Route path="/salaries" element={<Salaries />} />
                    <Route path="/bonuses" element={<Bonuses />} />
                    <Route path="/reports" element={<Reports />} />
                </Routes>
            </main>
        </div>
    );
}
