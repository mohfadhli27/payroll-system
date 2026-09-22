import * as salaryService from "../services/salaryService.js";

export async function getSalaries(req, res, next) {
    try {
        const data = await salaryService.listSalaries();
        res.json(data);
    } catch (err) {
        next(err);
    }
}

export async function getSalary(req, res, next) {
    try {
        const data = await salaryService.getSalary(req.params.id);
        res.json(data);
    } catch (err) {
        next(err);
    }
}

export async function createSalary(req, res, next) {
    try {
        const data = await salaryService.createSalary(req.body);
        res.status(201).json(data);
    } catch (err) {
        next(err);
    }
}

export async function updateSalary(req, res, next) {
    try {
        const data = await salaryService.updateSalary(req.params.id, req.body);
        res.json(data);
    } catch (err) {
        next(err);
    }
}

export async function deleteSalary(req, res, next) {
    try {
        const data = await salaryService.deleteSalary(req.params.id);
        res.json(data);
    } catch (err) {
        next(err);
    }
}
