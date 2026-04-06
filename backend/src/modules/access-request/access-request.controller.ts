import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middleware";
import { createAccessRequest, getAccessRequests, updateAccessRequestStatus } from "./access-request.service";

export const create = async (req: AuthRequest, res: Response) => {
    try {
        const request = await createAccessRequest(req.user!.userId, "ANALYST");
        res.status(201).json({ success: true, data: request });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const getAll = async (req: AuthRequest, res: Response) => {
    try {
        const requests = await getAccessRequests();
        res.status(200).json({ success: true, data: requests });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const approve = async (req: AuthRequest, res: Response) => {
    try {
        const id = req.params.id as string;
        const request = await updateAccessRequestStatus(id, "APPROVED");
        res.status(200).json({ success: true, data: request });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const reject = async (req: AuthRequest, res: Response) => {
    try {
        const id = req.params.id as string;
        const request = await updateAccessRequestStatus(id, "REJECTED");
        res.status(200).json({ success: true, data: request });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};
