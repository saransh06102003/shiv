import { Router } from "express";
import { getRoutine, saveRoutine } from "../controllers/routineController.js";

const router = Router();

router.get("/:userId", getRoutine);
router.post("/", saveRoutine);

export default router;
