-- Crear base de datos
CREATE DATABASE GEADC
GO

-- Usar la base de datos GEADC
USE GEADC
GO

-- Tabla Usuarios
CREATE TABLE Usuarios (
    ID INT PRIMARY KEY IDENTITY(1,1),
    Nombre VARCHAR(255),
    Contrasena VARCHAR(255),
    Correo VARCHAR(255)
)
GO

-- Tabla de Chats
CREATE TABLE Chats (
    ID INT PRIMARY KEY IDENTITY(1,1),
    UsuarioID INT,
    ContadorMensajes INT DEFAULT 0,
    FOREIGN KEY (UsuarioID) REFERENCES Usuarios(ID)
)
GO

-- Tabla de Mensajes
CREATE TABLE Mensajes (
    ID INT PRIMARY KEY IDENTITY(1,1),
    ChatID INT,
    Orden INT,
    Mensaje VARCHAR(MAX),
    FOREIGN KEY (ChatID) REFERENCES Chats(ID)
)
GO

-- Insertar usuarios
INSERT INTO Usuarios (Nombre, Correo, Contrasena)
VALUES
('Usuario1', 'usuario1@example.com', 'contrasena1'),
('Usuario2', 'usuario2@example.com', 'contrasena2');


-- Insertar Chat
INSERT INTO Chats (UsuarioID)
VALUES
(1),  
(2);  


-- Insertar Historial de chats
INSERT INTO Mensajes (ChatID, Orden, Mensaje)
VALUES
(1, 1, '....'),  
(2, 1, '...');  


-- Procedimiento almacenado para insertar un nuevo mensaje en un chat y actualizar el contador de mensajes
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE InsertarMensajeYActualizarContador
    @ChatID INT,
    @Mensaje VARCHAR(MAX),
    @NuevoOrden INT
AS
BEGIN
    BEGIN TRANSACTION;
    
    -- Insertar el nuevo mensaje
    INSERT INTO Mensajes (ChatID, Orden, Mensaje)
    VALUES (@ChatID, @NuevoOrden, @Mensaje);
    
    -- Actualizar el contador de mensajes del chat
    UPDATE Chats SET ContadorMensajes = ContadorMensajes + 1 WHERE ID = @ChatID;
    
    COMMIT TRANSACTION;
END;
