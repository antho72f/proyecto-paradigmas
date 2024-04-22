import express from "express";
import cors from "cors";
import morgan from "morgan";
import authRoutes from "./routes/auth.routes.js";
import usuariosRoutes from "./routes/usuarios.routes.js";
import openaiRoutes from "./routes/openai.routes.js";
import historialRoutes from "./routes/historial.routes.js";
import cookieParser from "cookie-parser";
import { FRONTEND_URL } from "./config.js";

const app = express();

app.use(
    cors({
        credentials: true,
        origin: FRONTEND_URL,
    })
);

app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api", authRoutes);
app.use("/api", usuariosRoutes);
app.use("/api", openaiRoutes);
app.use("/api", historialRoutes);

export default app;