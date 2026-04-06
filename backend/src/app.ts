import express from "express";
import cors from "cors";
import authRoutes from "./modules/auth/auth.routes";
import { authenticate, authorize } from "./middlewares/auth.middleware";
import recordRoutes from "./modules/record/record.routes";
import summaryRoutes from "./modules/summary/summary.routes";
import { Request, Response, NextFunction } from "express";
import userRoutes from "./modules/user/user.routes";
import accessRequestRoutes from "./modules/access-request/access-request.routes";

export const errorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.error(err);

    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal Server Error",
    });
};

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("API is running");
});

app.use("/api/auth", authRoutes);

app.get(
    "/api/protected",
    authenticate,
    authorize("ADMIN"),
    (req, res) => {
        res.json({
            success: true,
            message: "You are authorized",
        });
    }
);

app.use("/api/records", recordRoutes);

app.use("/api/summary", summaryRoutes);

app.use(errorHandler);

app.use("/api/users", userRoutes);
app.use("/api/access-requests", accessRequestRoutes);

export default app;