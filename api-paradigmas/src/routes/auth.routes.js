import { Router } from "express";
import { login, logout, register, verifyToken } from "../controllers/auth.controller.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/verify", verifyToken);
router.post("/logout", logout);

export default router;