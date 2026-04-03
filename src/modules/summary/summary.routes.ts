import { Router } from "express";
import { summary } from "./summary.controller";
import { authenticate } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { summaryQuerySchema } from "../../utils/validation/summary.validation";

const router = Router();

router.get(
    "/",
    authenticate,
    validate(summaryQuerySchema, "query"),
    summary
);

export default router;