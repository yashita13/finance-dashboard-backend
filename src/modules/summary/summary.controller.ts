import { Response } from "express";
import { getSummary } from "./summary.service";
import { AuthRequest } from "../../middlewares/auth.middleware";

export const summary = async (req: AuthRequest, res: Response) => {
    const data = await getSummary(req.user!.userId, req.query);
    res.json({
        success: true,
        data,
    });
};