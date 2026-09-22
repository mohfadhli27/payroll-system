const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

async function request(path, options = {}) {
    const response = await fetch(`${API_URL}${path}`, {
        headers: { "Content-Type": "application/json" },
        ...options
    });

    let body = null;
    try {
        body = await response.json();
    } catch (_) {
        body = null;
    }

    if (!response.ok) {
        throw new Error(body?.message || "Terjadi kesalahan");
    }

    return body;
}

export const api = {
    getEmployees: () => request("/api/employees"),
    createEmployee: (payload) =>
        request("/api/employees", {
            method: "POST",
            body: JSON.stringify(payload)
        }),
    updateEmployee: (id, payload) =>
        request(`/api/employees/${id}`, {
            method: "PUT",
            body: JSON.stringify(payload)
        }),
    deleteEmployee: (id) =>
        request(`/api/employees/${id}`, { method: "DELETE" }),

    getSalaries: () => request("/api/salaries"),
    createSalary: (payload) =>
        request("/api/salaries", {
            method: "POST",
            body: JSON.stringify(payload)
        }),
    updateSalary: (id, payload) =>
        request(`/api/salaries/${id}`, {
            method: "PUT",
            body: JSON.stringify(payload)
        }),
    deleteSalary: (id) =>
        request(`/api/salaries/${id}`, { method: "DELETE" }),

    getBonuses: () => request("/api/bonuses"),
    createBonus: (payload) =>
        request("/api/bonuses", {
            method: "POST",
            body: JSON.stringify(payload)
        }),
    updateBonus: (id) =>
        request(`/api/bonuses/${id}`, { method: "PUT" }),
    deleteBonus: (id) =>
        request(`/api/bonuses/${id}`, { method: "DELETE" }),

    getPayrollReport: (filters = {}) => {
        const params = new URLSearchParams();
        if (filters.idKaryawan) params.set("idKaryawan", filters.idKaryawan);
        if (filters.bulan) params.set("bulan", filters.bulan);
        if (filters.tahun) params.set("tahun", filters.tahun);
        const qs = params.toString();
        return request(`/api/reports/payroll${qs ? `?${qs}` : ""}`);
    }
};
