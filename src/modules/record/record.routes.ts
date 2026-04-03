import { Router } from "express";
import {
    create,
    getAll,
    update,
    remove,
} from "./record.controller";
import { authenticate, authorize } from "../../middlewares/auth.middleware";

const router = Router();

router.post("/", authenticate, authorize("ADMIN"), create);
router.get("/", authenticate, getAll);
router.put("/:id", authenticate, authorize("ADMIN"), update);
router.delete("/:id", authenticate, authorize("ADMIN"), remove);

export default router;