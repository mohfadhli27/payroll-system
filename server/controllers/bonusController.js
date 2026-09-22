import * as bonusService from "../services/bonusService.js";

export async function getBonuses(req, res, next) {
    try {
        const data = await bonusService.listBonuses();
        res.json(data);
    } catch (err) {
        next(err);
    }
}

export async function getBonus(req, res, next) {
    try {
        const data = await bonusService.getBonus(req.params.id);
        res.json(data);
    } catch (err) {
        next(err);
    }
}

export async function createBonus(req, res, next) {
    try {
        const data = await bonusService.createBonus(req.body);
        res.status(201).json(data);
    } catch (err) {
        next(err);
    }
}

export async function updateBonus(req, res, next) {
    try {
        const data = await bonusService.updateBonus(req.params.id);
        res.json(data);
    } catch (err) {
        next(err);
    }
}

export async function deleteBonus(req, res, next) {
    try {
        const data = await bonusService.deleteBonus(req.params.id);
        res.json(data);
    } catch (err) {
        next(err);
    }
}
