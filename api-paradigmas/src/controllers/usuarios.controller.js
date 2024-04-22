import { getConnection, mssql } from '../database/connectionSQLServer.js'
import bcrypt from 'bcrypt';

const hashPassword = async (password) => {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
};

const comparePassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
};

export const getUsuarios = async (req, res) => {
    try {
        const pool = await getConnection();
        const result = await pool.request().query("SELECT * FROM Usuarios");

        if (result.recordset.length === 0) {
            return res.status(404).json({ msg: "No hay datos" });
        }

        res.json(result.recordset);
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
};

export const addUsuario = async (req, res) => {
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
        res.json({
            Nombre,
            Contrasena, // No envíes la contraseña en texto plano al cliente
            Correo,
            Id: result.recordset[0].Id,
        });
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
};

export const getUsuarioById = async (req, res) => {
    try {
        const pool = await getConnection();
        const result = await pool
            .request()
            .input("id", req.params.id)
            .query("SELECT * FROM Usuarios WHERE ID = @id");

        if (result.recordset.length === 0) {
            return res.status(404).json({ msg: "Usuario no encontrado" });
        }

        return res.json(result.recordset[0]);
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
};

export const deleteUsuarioById = async (req, res) => {
    try {
        const pool = await getConnection();

        const result = await pool
            .request()
            .input("id", req.params.id)
            .query("DELETE FROM usuarios WHERE ID = @id");

        if (result.rowsAffected[0] === 0) return res.status(404).json({ msg: "Usuario no encontrado" });

        return res.sendStatus(204);
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
};

export const getTotalUsuarios = async (req, res) => {
    const pool = await getConnection();
    const result = await pool.request().query("SELECT COUNT(*) FROM Usuarios");
    res.json(result.recordset[0][""]);
};

export const updatePasswordById = async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const id = req.params.id;

    try {
        const pool = await getConnection();

        // Obtener la contraseña actual del usuario
        const user = await pool
            .request()
            .input("Id", id)
            .query("SELECT Contrasena FROM Usuarios WHERE ID = @Id");

        if (user.recordset.length === 0) {
            return res.status(404).json({ msg: "Usuario no encontrado" });
        }

        // Comparar la contraseña proporcionada con la almacenada en la base de datos
        const match = await comparePassword(oldPassword, user.recordset[0].Contrasena);
        
        if (!match) {
            return res.status(401).json({ msg: "La contraseña anterior es incorrecta" });
        }

        const hashedNewPassword = await hashPassword(newPassword);

        // Actualizar la contraseña en la base de datos
        await pool
            .request()
            .input("Id", id)
            .input("Contrasena", mssql.VarChar, hashedNewPassword)
            .query("UPDATE Usuarios SET Contrasena = @Contrasena WHERE ID = @Id");

        res.json({ msg: "Contraseña actualizada correctamente" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const updateUsuarioById = async (req, res) => {
    const { Nombre, Correo } = req.body;
    const id = req.params.id;

    if (Nombre == null || Correo == null) {
        return res.status(400).json({ msg: "Solicitud incorrecta. Por favor complete todos los campos" });
    }

    try {
        const pool = await getConnection();

        // Verificar si el correo ya está asociado a otro usuario
        const checkCorreo = await pool
            .request()
            .input("Correo", mssql.VarChar, Correo)
            .query("SELECT COUNT(*) as count, MIN(Id) as id FROM Usuarios WHERE Correo = @Correo GROUP BY Correo");

        if (checkCorreo.recordset.length > 0) {
            const existingId = checkCorreo.recordset[0].id;
            if (existingId != id) {
                return res.status(400).json({ msg: "El correo electrónico ya está registrado por otro usuario" });
            }
        }

        const result = await pool
            .request()
            .input("Id", id)
            .input("Nombre", mssql.VarChar, Nombre)
            .input("Correo", mssql.VarChar, Correo)
            .query("UPDATE Usuarios SET Nombre = @Nombre, Correo = @Correo WHERE ID = @Id");

        if (result.rowsAffected[0] === 0) return res.status(404).json({ msg: "Usuario no encontrado" });

        res.json({ Nombre, Correo, ID: id, msg: "El usuario ha sido actualizado" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};