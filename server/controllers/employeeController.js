import * as employeeService from "../services/employeeService.js";

export async function getEmployees(req, res, next) {
    try {
        const data = await employeeService.listEmployees();
        res.json(data);
    } catch (err) {
        next(err);
    }
}

export async function getEmployee(req, res, next) {
    try {
        const data = await employeeService.getEmployee(req.params.id);
        res.json(data);
    } catch (err) {
        next(err);
    }
}

export async function createEmployee(req, res, next) {
    try {
        const data = await employeeService.createEmployee(req.body);
        res.status(201).json(data);
    } catch (err) {
        next(err);
    }
}

export async function updateEmployee(req, res, next) {
    try {
        const data = await employeeService.updateEmployee(req.params.id, req.body);
        res.json(data);
    } catch (err) {
        next(err);
    }
}

export async function deleteEmployee(req, res, next) {
    try {
        const data = await employeeService.deleteEmployee(req.params.id);
        res.json(data);
    } catch (err) {
        next(err);
    }
}
