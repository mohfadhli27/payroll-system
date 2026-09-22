import { formatCurrency } from "../utils/formatter.js";

export default function SalaryTable({ salaries, onEdit, onDelete }) {
    return (
        <table className="table">
            <thead>
                <tr>
                    <th>Karyawan</th>
                    <th>Bulan</th>
                    <th>Tahun</th>
                    <th>Salary</th>
                    <th>Aksi</th>
                </tr>
            </thead>
            <tbody>
                {salaries.length === 0 ? (
                    <tr>
                        <td colSpan={5} className="empty">
                            Tidak ada data salary
                        </td>
                    </tr>
                ) : (
                    salaries.map((s) => (
                        <tr key={s.idSalary}>
                            <td>{s.namaKaryawan || "-"}</td>
                            <td>{s.bulan}</td>
                            <td>{s.tahun}</td>
                            <td>{formatCurrency(s.salary)}</td>
                            <td>
                                <button
                                    className="btn small"
                                    onClick={() => onEdit(s)}
                                >
                                    Edit
                                </button>{" "}
                                <button
                                    className="btn small danger"
                                    onClick={() => onDelete(s.idSalary)}
                                >
                                    Hapus
                                </button>
                            </td>
                        </tr>
                    ))
                )}
            </tbody>
        </table>
    );
}
