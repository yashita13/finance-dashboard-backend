import { Response, NextFunction } from "express"
import {
    createRecord,
    getRecords,
    updateRecord,
    deleteRecord,
    getRecentRecords,
} from "./record.service";
import { AuthRequest } from "../../middlewares/auth.middleware";

export const create = async (req: AuthRequest, res: Response) => {
    const record = await createRecord(req.body, req.user!.userId);
    res.status(201).json({
        success: true,
        data: record,
    });
};

export const getAll = async (req: AuthRequest, res: Response) => {
    const result = await getRecords(req.query, req.user!.userId);

    res.json({
        success: true,
        data: result.records,
        meta: {
            total: result.total,
            page: result.page,
            limit: result.limit,
            totalPages: Math.ceil(result.total / result.limit),
        },
    });
};

export const update = async (req: AuthRequest, res: Response) => {
    const id = req.params.id as string;
    await updateRecord(id, req.body, req.user!.userId);

    res.json({
        success: true,
        message: "Record updated",
    });
};

export const remove = async (req: AuthRequest, res: Response) => {
    const id = req.params.id as string;
    await deleteRecord(id, req.user!.userId);

    res.json({
        success: true,
        message: "Record deleted",
    });
};

export const getRecent=async(req:AuthRequest,res:Response,_next:NextFunction)=>{
    const limit=Number(req.query.limit)||5
    const data=await getRecentRecords(req.user!.userId,limit)

    res.status(200).json({
        success:true,
        data
    })
}