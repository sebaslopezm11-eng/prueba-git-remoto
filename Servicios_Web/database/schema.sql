-- BuildX.Pro Database Schema
-- Construction Project Management System

CREATE DATABASE IF NOT EXISTS buildxpro;
USE buildxpro;

-- Tabla de Proyectos
CREATE TABLE IF NOT EXISTS proyectos (
    id VARCHAR(50) PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    ubicacion VARCHAR(255) NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE,
    progreso INT DEFAULT 0,
    estado ENUM('active', 'paused', 'completed') DEFAULT 'active',
    descripcion TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla de Personal
CREATE TABLE IF NOT EXISTS personal (
    id VARCHAR(50) PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    rol VARCHAR(100) NOT NULL,
    proyecto_id VARCHAR(50),
    horario VARCHAR(50),
    telefono VARCHAR(20),
    email VARCHAR(255),
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (proyecto_id) REFERENCES proyectos(id) ON DELETE SET NULL
);

-- Tabla de Equipos
CREATE TABLE IF NOT EXISTS equipos (
    id VARCHAR(50) PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    estado ENUM('Disponible', 'En uso', 'Mantenimiento') DEFAULT 'Disponible',
    proyecto_id VARCHAR(50),
    ultimo_mantenimiento DATE,
    modelo VARCHAR(100),
    serie VARCHAR(100),
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (proyecto_id) REFERENCES proyectos(id) ON DELETE SET NULL
);

-- Tabla de Materiales
CREATE TABLE IF NOT EXISTS materiales (
    id VARCHAR(50) PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    cantidad DECIMAL(10,2) NOT NULL,
    unidad VARCHAR(50) NOT NULL,
    ubicacion VARCHAR(255),
    proxima_entrega DATE,
    estado ENUM('low', 'normal', 'high') DEFAULT 'normal',
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Reportes
CREATE TABLE IF NOT EXISTS reportes (
    id VARCHAR(50) PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    tipo ENUM('semanal', 'mensual', 'anual', 'personalizado') NOT NULL,
    fecha DATE NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_usuario VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    rol VARCHAR(50) DEFAULT 'usuario',
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar datos de ejemplo
INSERT INTO proyectos (id, nombre, ubicacion, fecha_inicio, progreso, estado, descripcion) VALUES
('proyecto-norte', 'Proyecto Norte', 'Zona Norte, Bogotá', '2024-01-15', 65, 'active', 'Construcción de edificio residencial de 8 pisos'),
('proyecto-sur', 'Proyecto Sur', 'Zona Sur, Bogotá', '2024-01-20', 32, 'active', 'Remodelación de centro comercial'),
('proyecto-centro', 'Proyecto Centro', 'Zona Centro, Bogotá', '2024-01-10', 45, 'paused', 'Construcción de oficinas corporativas');

INSERT INTO personal (id, nombre, rol, proyecto_id, horario) VALUES
('EMP001', 'Carlos Mendoza', 'Supervisor', 'proyecto-norte', '7:00 - 17:00'),
('EMP002', 'Ana Rodríguez', 'Obrero', 'proyecto-sur', '6:00 - 14:00'),
('EMP003', 'Miguel Torres', 'Arquitecto', 'proyecto-centro', '8:00 - 18:00');

INSERT INTO equipos (id, nombre, estado, proyecto_id, ultimo_mantenimiento) VALUES
('CAT320-001', 'Excavadora CAT 320', 'Disponible', 'proyecto-norte', '2024-01-15'),
('VOLVO-002', 'Volqueta Volvo', 'En uso', 'proyecto-sur', '2024-01-10');

INSERT INTO materiales (id, nombre, cantidad, unidad, ubicacion, proxima_entrega, estado) VALUES
('MAT001', 'Cemento Portland', 15, 'bolsas', 'Almacén Central', '2024-01-20', 'low'),
('MAT002', 'Ladrillos', 500, 'unidades', 'Almacén Norte', '2024-01-25', 'normal');

INSERT INTO reportes (id, nombre, tipo, fecha) VALUES
('report-1', 'Reporte Semanal - Proyecto Norte', 'semanal', '2024-01-15'),
('report-2', 'Reporte de Recursos - Enero 2024', 'mensual', '2024-01-01');

INSERT INTO usuarios (nombre_usuario, email, password, rol) VALUES
('admin', 'admin@buildxpro.com', 'password123*', 'administrador');
