import { Router } from "express";

import { enviarMensaje } from "../controllers/openai.controller.js";

const router = Router();

router.post("/openai", enviarMensaje);

export default router;