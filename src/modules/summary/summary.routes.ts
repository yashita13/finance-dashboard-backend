import { Router } from "express";
import { summary } from "./summary.controller";
import { authenticate } from "../../middlewares/auth.middleware";

const router = Router();

router.get("/", authenticate, summary);

export default router;