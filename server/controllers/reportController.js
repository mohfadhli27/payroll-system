import * as reportService from "../services/reportService.js";

export async function getPayrollReport(req, res, next) {
    try {
        const { bulan, tahun, idKaryawan } = req.query;
        const data = await reportService.getPayrollReport({
            bulan,
            tahun,
            idKaryawan
        });
        res.json(data);
    } catch (err) {
        next(err);
    }
}
