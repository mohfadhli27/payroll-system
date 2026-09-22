import { formatCurrency } from "../utils/formatter.js";

export default function ReportTable({ report }) {
    return (
        <table className="table">
            <thead>
                <tr>
                    <th>Nama</th>
                    <th>Bulan</th>
                    <th>Tahun</th>
                    <th>Salary</th>
                    <th>Bonus</th>
                    <th>Total</th>
                </tr>
            </thead>
            <tbody>
                {report.length === 0 ? (
                    <tr>
                        <td colSpan={6} className="empty">
                            Tidak ada data report
                        </td>
                    </tr>
                ) : (
                    report.map((r, i) => (
                        <tr key={i}>
                            <td>{r.namaKaryawan}</td>
                            <td>{r.bulan}</td>
                            <td>{r.tahun}</td>
                            <td>{formatCurrency(r.salary)}</td>
                            <td>{formatCurrency(r.bonus)}</td>
                            <td>{formatCurrency(r.total)}</td>
                        </tr>
                    ))
                )}
            </tbody>
        </table>
    );
}
