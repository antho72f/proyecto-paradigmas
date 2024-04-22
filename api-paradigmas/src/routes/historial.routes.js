import { Router } from "express";
import { agregarMensaje, eliminarHistorial, obtenerHistorialPorUsuarioId, obtenerMensajesPorHistorialId } from "../controllers/historial.controller.js";
import { authRequired } from "../middlewares/validateToken.js";
const router = Router();

router.post("/historial", authRequired, agregarMensaje);
router.get("/historial/:id", authRequired, obtenerMensajesPorHistorialId);
router.delete("/historial/:id", authRequired, eliminarHistorial);
router.get("/historial/usuario/:id", authRequired, obtenerHistorialPorUsuarioId);

export default router;