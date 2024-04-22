import { Router } from "express";

import { enviarMensaje } from "../controllers/openai.controller.js";
import { authRequired } from "../middlewares/validateToken.js";

const router = Router();

router.post("/openai", authRequired, enviarMensaje);

export default router;