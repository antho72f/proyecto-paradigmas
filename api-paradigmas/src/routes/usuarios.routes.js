import { Router } from "express";

import {addUsuario, deleteUsuarioById, getUsuarioById, getUsuarios, updatePasswordById, updateUsuarioById} from '../controllers/usuarios.controller.js'
import { authRequired } from "../middlewares/validateToken.js";

const router = Router();

router.get("/usuarios", authRequired, getUsuarios);

router.post("/usuarios", authRequired, addUsuario);

router.get("/usuarios/:id", authRequired, getUsuarioById);

router.delete("/usuarios/:id", authRequired, deleteUsuarioById);

router.put("/usuarios/cambiarContrasena/:id", authRequired, updatePasswordById);

router.put("/usuarios/:id", authRequired, updateUsuarioById);

export default router;