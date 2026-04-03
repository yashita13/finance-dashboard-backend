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

const router = Router();

router.post(
    "/",
    authenticate,
    validate(createRecordSchema),
    create
);

router.get("/", authenticate, getAll);

router.put(
    "/:id",
    authenticate,
    validate(updateRecordSchema),
    update
);

router.delete("/:id", authenticate, remove);

export default router;