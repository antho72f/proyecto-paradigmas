import express from "express";
import cors from "cors";
import morgan from "morgan";

import usuariosRoutes from "./routes/usuarios.routes.js";

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Routes
app.use("/api", usuariosRoutes);

export default app;