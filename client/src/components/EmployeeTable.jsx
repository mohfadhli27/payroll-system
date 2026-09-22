import { formatDate } from "../utils/formatter.js";

export default function EmployeeTable({ employees, onEdit, onDelete }) {
    return (
        <table className="table">
            <thead>
                <tr>
                    <th>Kode</th>
                    <th>Nama</th>
                    <th>Tanggal Lahir</th>
                    <th>Alamat</th>
                    <th>Aksi</th>
                </tr>
            </thead>
            <tbody>
                {employees.length === 0 ? (
                    <tr>
                        <td colSpan={5} className="empty">
                            Tidak ada data employee
                        </td>
                    </tr>
                ) : (
                    employees.map((e) => (
                        <tr key={e.idKaryawan}>
                            <td>{e.kodeKaryawan}</td>
                            <td>{e.namaKaryawan}</td>
                            <td>{formatDate(e.tanggalLahir)}</td>
                            <td>{e.alamat || "-"}</td>
                            <td>
                                <button
                                    className="btn small"
                                    onClick={() => onEdit(e)}
                                >
                                    Edit
                                </button>{" "}
                                <button
                                    className="btn small danger"
                                    onClick={() => onDelete(e.idKaryawan)}
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
