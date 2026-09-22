import express from "express";
import {
    getBonuses,
    getBonus,
    createBonus,
    updateBonus,
    deleteBonus
} from "../controllers/bonusController.js";

const router = express.Router();

router.get("/", getBonuses);
router.get("/:id", getBonus);
router.post("/", createBonus);
router.put("/:id", updateBonus);
router.delete("/:id", deleteBonus);

export default router;
