CREATE DATABASE facialArtist;

use facialArtist;

-- Crear tabla roles
CREATE TABLE roles (
  id_rol INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(45)
);

-- Crear tabla permisos
CREATE TABLE permisos (
  id_permiso INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(45),
  descripcion TEXT
);

-- Crear tabla rol_permiso
CREATE TABLE rol_permiso (
  id_rol_permiso INT AUTO_INCREMENT PRIMARY KEY,
  id_rol INT,
  permiso_id INT,
  FOREIGN KEY (id_rol) REFERENCES roles(id_rol),
  FOREIGN KEY (permiso_id) REFERENCES permisos(id_permiso)
);

-- Crear tabla usuarios
CREATE TABLE usuarios (
  id_usuario INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100),
  apellido varchar(100),
  email VARCHAR(80),
  telefono varchar(20),
  fecha_nacimiento date,
  clave VARCHAR(200),
  id_rol INT,
  FOREIGN KEY (id_rol) REFERENCES roles(id_rol)
);

-- TABLA: UsuarioTemporal
CREATE TABLE UsuarioTemporal (
    id_usuario_temporal INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100),
    apellido VARCHAR(100),
    correo VARCHAR(150),
    telefono VARCHAR(20),
    descripcion VARCHAR(255)
);

-- TABLA: Servicio
CREATE TABLE Servicio (
    id_servicio INT AUTO_INCREMENT PRIMARY KEY,
    descripcion VARCHAR(255) NOT NULL,
    categoria VARCHAR(100),
    precio DECIMAL(10,2)
);

-- TABLA: Profesional
CREATE TABLE Profesional (
    id_profesional INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL
);

-- TABLA: Cita
CREATE TABLE Cita (
    id_cita INT AUTO_INCREMENT PRIMARY KEY,
    fecha DATE NOT NULL,
    hora TIME NOT NULL,
    nota VARCHAR(255),
    estado ENUM('pendiente', 'confirmada', 'cancelada', 'completada') DEFAULT 'pendiente',
    email VARCHAR(150) NOT NULL,
    id_usuario INT,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE
);


select * from usuarios;
select * from Cita;
select * from roles;
select * from permisos;
select * from rol_permiso;


-- Insertar roles
INSERT INTO roles (nombre) VALUES
('Administrador'),
('Usuario');

-- Insertar permisos
INSERT INTO permisos (nombre, descripcion) VALUES
('Crear', 'Permite crear nuevos registros.'),
('Leer', 'Permite visualizar registros.'),
('Actualizar', 'Permite modificar registros existentes.'),
('Eliminar', 'Permite eliminar registros.');

-- Asignar permisos al rol Administrador (id_rol = 1)
INSERT INTO rol_permiso (id_rol, permiso_id) VALUES
(1, 1),  -- Crear
(1, 2),  -- Leer
(1, 3),  -- Actualizar
(1, 4);  -- Eliminar

INSERT INTO rol_permiso (id_rol, permiso_id) VALUES
(2, 1),
(2, 2),
(2, 3),
(2, 4);


drop database facialArtist;