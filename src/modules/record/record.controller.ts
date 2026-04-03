import { Request, Response } from "express";
import {
    createRecord,
    getRecords,
    updateRecord,
    deleteRecord,
} from "./record.service";
import { AuthRequest } from "../../middlewares/auth.middleware";

export const create = async (req: AuthRequest, res: Response) => {
    try {
        const record = await createRecord(req.body, req.user.userId);

        res.status(201).json({
            success: true,
            data: record,
        });
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

export const getAll = async (req: AuthRequest, res: Response) => {
    try {
        const records = await getRecords(req.query, req.user.userId);

        res.json({
            success: true,
            data: records,
        });
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

export const update = async (req: AuthRequest, res: Response) => {
    try {
        const id = req.params.id as string;
        await updateRecord(id, req.body, req.user.userId);

        res.json({
            success: true,
            message: "Record updated",
        });
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

export const remove = async (req: AuthRequest, res: Response) => {
    try {
        const id = req.params.id as string;
        await deleteRecord(id, req.user.userId);
        res.json({
            success: true,
            message: "Record deleted",
        });
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};