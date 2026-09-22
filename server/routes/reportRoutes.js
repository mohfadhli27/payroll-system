import express from "express";
import { getPayrollReport } from "../controllers/reportController.js";

const router = express.Router();

router.get("/payroll", getPayrollReport);

export default router;
