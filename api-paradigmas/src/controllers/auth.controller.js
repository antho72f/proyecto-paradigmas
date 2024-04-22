import { getConnection, mssql } from '../database/connectionSQLServer.js';
import bcrypt from 'bcrypt';
import { createAccessToken } from '../libs/jwt.js';
import { JWT_SECRET } from '../config.js';
import jwt from "jsonwebtoken";

const hashPassword = async (password) => {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
};

const comparePassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
};

export const register = async (req, res) => {
    const { Nombre, Contrasena, Correo } = req.body;

    if (Nombre == null || Contrasena == null || Correo == null) {
        return res.status(400).json({ msg: "Solicitud incorrecta. Por favor complete todos los campos" });
    }

    try {
        const hashedPassword = await hashPassword(Contrasena); // Encriptar la contraseña

        const pool = await getConnection();

        // Verificar si el correo ya está asociado a otro usuario
        const checkCorreo = await pool
            .request()
            .input("Correo", mssql.VarChar, Correo)
            .query("SELECT COUNT(*) as count FROM Usuarios WHERE Correo = @Correo");

        if (checkCorreo.recordset[0].count > 0) {
            return res.status(400).json({ msg: "El correo electrónico ya está registrado" });
        }

        const result = await pool
            .request()
            .input("Nombre", mssql.VarChar, Nombre)
            .input("Contrasena", mssql.VarChar, hashedPassword) // Almacenar la contraseña encriptada
            .input("Correo", mssql.VarChar, Correo)
            .query(
                "INSERT INTO Usuarios (Nombre, Contrasena, Correo) VALUES (@Nombre,@Contrasena,@Correo); SELECT SCOPE_IDENTITY() as Id"
            );

        const usuarioId = result.recordset[0].Id;
        const token = await createAccessToken({ id: usuarioId });

        res.cookie("token", token);
        res.json({
            token,
            usuario: {
                Nombre,
                Correo,
                Id: usuarioId
            }
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
};

export const login = async (req, res) => {
    const { Correo, Contrasena } = req.body;

    if (!Correo || !Contrasena) {
        return res.status(400).json({ msg: "Por favor, ingrese correo y contraseña" });
    }

    try {
        const pool = await getConnection();

        const result = await pool
            .request()
            .input("Correo", mssql.VarChar, Correo)
            .query("SELECT * FROM Usuarios WHERE Correo = @Correo");

        if (result.recordset.length === 0) {
            return res.status(404).json({ msg: "Credenciales inválidas" });
        }

        const usuario = result.recordset[0];
        const match = await comparePassword(Contrasena, usuario.Contrasena);

        if (!match) {
            return res.status(401).json({ msg: "Credenciales inválidas" });
        }

        const token = await createAccessToken({ id: usuario.ID });
        res.cookie("token", token);
        res.json({ msg: "Inicio de sesión exitoso", token, usuario });
    } catch (error) {
        res.status(500).send(error.message);
    }
};

export const verifyToken = async (req, res) => {
    const { token } = req.cookies;
    if (!token) return res.send(false);

    jwt.verify(token, JWT_SECRET, async (error, user) => {
        if (error) return res.sendStatus(401);

        try {
            const pool = await getConnection();
            const result = await pool
                .request()
                .input("id", user.id)
                .query("SELECT * FROM Usuarios WHERE ID = @id");
            if (result.recordset.length === 0) return res.sendStatus(401);
            return res.json(result.recordset[0]);
        } catch (error) {
            console.error('Error al buscar usuario:', error);
            return res.sendStatus(500);
        }
    });
};

export const logout = (req, res) => {
    res.cookie("token", "", {
        expires: new Date(0),
    });
    return res.sendStatus(200);
};
