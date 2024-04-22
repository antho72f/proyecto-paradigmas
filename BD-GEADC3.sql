-- Crear base de datos
CREATE DATABASE GEADC
GO

-- Usar la base de datos GEADC
USE GEADC
GO

-- Tabla Roles
CREATE TABLE Roles (
    ID INT PRIMARY KEY IDENTITY(1,1),
    Nombre VARCHAR(50) UNIQUE
)
GO

-- Insertar roles predeterminados
INSERT INTO Roles (Nombre) VALUES ('ADMIN'), ('USUARIO')
GO

-- Tabla Usuarios
CREATE TABLE Usuarios (
    ID INT PRIMARY KEY IDENTITY(1,1),
    Nombre VARCHAR(255),
    Contrasena VARCHAR(255),
    Correo VARCHAR(255),
	RolID INT DEFAULT 2,
	FOREIGN KEY (RolID) REFERENCES Roles(ID)
)
GO

-- Tabla Historial
CREATE TABLE Historial (
    ID INT PRIMARY KEY IDENTITY(1,1),
	Nombre VARCHAR(255),
	UsuarioID INT,
	FOREIGN KEY (UsuarioID) REFERENCES Usuarios(ID)
)
GO

-- Tabla Mensajes
CREATE TABLE Mensajes (
    ID INT PRIMARY KEY IDENTITY(1,1),
    HistorialID INT,
    Contenido VARCHAR(MAX),
	Image VARCHAR(MAX) NULL,
    FechaHoraEnvio DATETIME,
    TipoUsuario VARCHAR(50) NULL,
    FOREIGN KEY (HistorialID) REFERENCES Historial(ID)
)
GO
