import { Router } from "express";
import { currentUser, loginUser } from "../controllers/userController.js";
import { validateTokenHandler } from "../middleware/validateTokenHandler.js";

const router = Router();

router.post("/login", loginUser);
router.get("/current", validateTokenHandler, currentUser);

export default router;
