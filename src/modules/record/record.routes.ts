import { Router } from "express";
import {
    create,
    getAll,
    update,
    remove,
} from "./record.controller";
import { authenticate, authorize } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validate.middleware";
import {
    createRecordSchema,
    updateRecordSchema,
} from "../../utils/validation/record.validation";
import { asyncHandler } from "../../utils/asyncHandler"
import { getRecent } from "./record.controller"


const router = Router();

router.post(
    "/",
    authenticate,
    validate(createRecordSchema),
    create
);

router.get("/", authenticate, getAll);
router.get("/recent",authenticate,authorize("ANALYST","ADMIN"),asyncHandler(getRecent))

router.put(
    "/:id",
    authenticate,
    validate(updateRecordSchema),
    update
);

router.delete("/:id", authenticate, remove);

export default router;