import { getConnection, mssql } from '../database/connectionSQLServer.js'

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
            .input("Contrasena", mssql.VarChar, Contrasena)
            .input("Correo", mssql.VarChar, Correo)
            .query(
                "INSERT INTO Usuarios (Nombre, Contrasena, Correo) VALUES (@Nombre,@Contrasena,@Correo); SELECT SCOPE_IDENTITY() as Id"
            );
        res.json({
            Nombre,
            Contrasena,
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

export const updateUsuarioById = async (req, res) => {
    const { Nombre, Contrasena, Correo } = req.body;

    if (Nombre == null || Contrasena == null || Correo == null) {
        return res.status(400).json({ msg: "Solicitud incorrecta. Por favor complete todos los campos" });
    }

    try {
        const pool = await getConnection();
        const id = req.params.id;

        // Verificar si el correo ya está asociado a otro usuario
        const checkCorreo = await pool
            .request()
            .input("Correo", mssql.VarChar, Correo)
            .query("SELECT COUNT(*) as count, MIN(Id) as id FROM Usuarios WHERE Correo = @Correo GROUP BY Correo");

        if (checkCorreo.recordset.length > 0) {
            const existingId = checkCorreo.recordset[0].id;
            if (existingId != id) {
                console.log("Id: ", id, " Id consulta: ", existingId)
                return res.status(400).json({ msg: "El correo electrónico ya está registrado por otro usuario" });
            }
        }

        const result = await pool
            .request()
            .input("Id", id)
            .input("Nombre", mssql.VarChar, Nombre)
            .input("Contrasena", mssql.VarChar, Contrasena)
            .input("Correo", mssql.VarChar, Correo)
            .query(
                "UPDATE usuarios SET Nombre = @Nombre, Contrasena = @Contrasena, Correo = @Correo WHERE ID = @Id"
            );

        if (result.rowsAffected[0] === 0) return res.status(404).json({ msg: "Usuario no encontrado" });

        res.json({ Nombre, Contrasena, Correo, ID: id, msg: "El usuario ha sido actualizado" });
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
};

