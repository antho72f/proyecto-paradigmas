import { getConnection, mssql } from '../database/connectionSQLServer.js';

export const agregarMensaje = async (req, res) => {
    const { HistorialID, Contenido, UsuarioID } = req.body;

    if (Contenido == null || UsuarioID == null) {
        return res.status(400).json({ msg: "Solicitud incorrecta. Por favor complete todos los campos obligatorios" });
    }

    try {
        const pool = await getConnection();

        let historialId = HistorialID;

        if (HistorialID == null) {
            const nombreHistorial = Contenido;

            const resultHistorial = await pool
                .request()
                .input("Nombre", mssql.VarChar, nombreHistorial)
                .input("UsuarioID", mssql.Int, UsuarioID)
                .query(
                    "INSERT INTO Historial (Nombre, UsuarioID) VALUES (@Nombre, @UsuarioID); SELECT SCOPE_IDENTITY() as Id"
                );

            historialId = resultHistorial.recordset[0].Id;
        }

        const fechaHoraEnvio = new Date();

        const resultMensaje = await pool
            .request()
            .input("HistorialID", mssql.Int, historialId)
            .input("Contenido", mssql.VarChar, Contenido)
            .input("FechaHoraEnvio", mssql.DateTime, fechaHoraEnvio)
            .query(
                "INSERT INTO Mensajes (HistorialID, Contenido, FechaHoraEnvio) VALUES (@HistorialID, @Contenido, @FechaHoraEnvio)"
            );

        res.json({ Id: historialId });
    } catch (error) {
        res.status(500).send(error.message);
    }
};

export const obtenerMensajesPorHistorialId = async (req, res) => {
    const historialId = req.params.id;

    if (historialId == null) {
        return res.status(400).json({ msg: "Solicitud incorrecta. Proporcione el ID del historial" });
    }

    try {
        const pool = await getConnection();

        const result = await pool
            .request()
            .input("HistorialID", mssql.Int, historialId)
            .query("SELECT * FROM Mensajes WHERE HistorialID = @HistorialID");

        res.json(result.recordset);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

export const eliminarHistorial = async (req, res) => {
    const historialId = req.params.id;

    if (historialId == null) {
        return res.status(400).json({ msg: "Solicitud incorrecta. Proporcione el ID del historial a eliminar" });
    }

    try {
        const pool = await getConnection();

        await pool
            .request()
            .input("HistorialID", mssql.Int, historialId)
            .query("DELETE FROM Mensajes WHERE HistorialID = @HistorialID");

        const result = await pool
            .request()
            .input("HistorialID", mssql.Int, historialId)
            .query("DELETE FROM Historial WHERE ID = @HistorialID");

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ msg: "Historial no encontrado" });
        }

        res.sendStatus(204);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

export const obtenerHistorialPorUsuarioId = async (req, res) => {
    const usuarioId = req.params.id;

    if (usuarioId == null) {
        return res.status(400).json({ msg: "Solicitud incorrecta. Proporcione el ID del usuario" });
    }

    try {
        const pool = await getConnection();

        const result = await pool
            .request()
            .input("UsuarioID", mssql.Int, usuarioId)
            .query("SELECT * FROM Historial WHERE UsuarioID = @UsuarioID");

        if (result.recordset.length === 0) {
            return res.status(404).json({ msg: "No se encontró historial para el usuario especificado" });
        }

        res.json(result.recordset);
    } catch (error) {
        res.status(500).send(error.message);
    }
};
