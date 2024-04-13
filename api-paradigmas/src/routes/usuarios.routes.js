import { Router } from "express";

import {addUsuario, deleteUsuarioById, getUsuarioById, getUsuarios, updateUsuarioById} from '../controllers/usuarios.controller.js'

const router = Router();

router.get("/usuarios", getUsuarios);

router.post("/usuarios", addUsuario);

router.get("/usuarios/:id", getUsuarioById);

router.delete("/usuarios/:id", deleteUsuarioById);

router.put("/usuarios/:id", updateUsuarioById);

export default router;