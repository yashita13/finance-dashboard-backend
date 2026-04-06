import { Router } from "express";
import { create, getAll, approve, reject } from "./access-request.controller";
import { authenticate, authorize } from "../../middlewares/auth.middleware";

const router = Router();

router.post("/", authenticate, authorize("VIEWER"), create);
router.get("/", authenticate, authorize("ADMIN", "SUPERADMIN"), getAll);
router.patch("/:id/approve", authenticate, authorize("ADMIN", "SUPERADMIN"), approve);
router.patch("/:id/reject", authenticate, authorize("ADMIN", "SUPERADMIN"), reject);

export default router;
