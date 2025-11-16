-- Datos de Prueba para BuildX.Pro
-- Contraseña para todos los usuarios: password

USE buildxpro;

-- Limpiar datos existentes (opcional)
DELETE FROM usuarios;

-- Insertar usuarios de prueba
-- Contraseña para todos: 'password'
INSERT INTO usuarios (nombre_usuario, email, password, rol) VALUES
('admin', 'admin@buildxpro.com', 'password123*', 'administrador'),
('usuario1', 'usuario1@buildxpro.com', 'password234*', 'usuario'),
('gerente', 'gerente@buildxpro.com', 'password345*', 'gerente');

-- Mostrar usuarios creados
SELECT id, nombre_usuario, email, rol, activo FROM usuarios;

