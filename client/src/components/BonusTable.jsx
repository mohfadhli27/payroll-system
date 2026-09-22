import { formatCurrency } from "../utils/formatter.js";

export default function BonusTable({ bonuses, onDelete }) {
    return (
        <table className="table">
            <thead>
                <tr>
                    <th>Karyawan</th>
                    <th>Bulan</th>
                    <th>Tahun</th>
                    <th>Salary</th>
                    <th>Bonus</th>
                    <th>Total</th>
                    <th>Aksi</th>
                </tr>
            </thead>
            <tbody>
                {bonuses.length === 0 ? (
                    <tr>
                        <td colSpan={7} className="empty">
                            Tidak ada data bonus
                        </td>
                    </tr>
                ) : (
                    bonuses.map((b) => (
                        <tr key={b.idBonus}>
                            <td>{b.namaKaryawan || "-"}</td>
                            <td>{b.bulan}</td>
                            <td>{b.tahun}</td>
                            <td>{formatCurrency(b.salary)}</td>
                            <td>{formatCurrency(b.bonus)}</td>
                            <td>{formatCurrency(b.total)}</td>
                            <td>
                                <button
                                    className="btn small danger"
                                    onClick={() => onDelete(b.idBonus)}
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
