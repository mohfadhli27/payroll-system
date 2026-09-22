import express from "express";
import {
    getSalaries,
    getSalary,
    createSalary,
    updateSalary,
    deleteSalary
} from "../controllers/salaryController.js";

const router = express.Router();

router.get("/", getSalaries);
router.get("/:id", getSalary);
router.post("/", createSalary);
router.put("/:id", updateSalary);
router.delete("/:id", deleteSalary);

export default router;
