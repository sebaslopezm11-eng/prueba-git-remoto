-- Datos de Prueba para BuildX.Pro
-- Contraseña para todos los usuarios: password

USE buildxpro;

-- Limpiar datos existentes (opcional)
DELETE FROM usuarios;

-- Insertar usuarios de prueba
-- Contraseña para todos: 'password'
INSERT INTO usuarios (nombre_usuario, email, password, rol) VALUES
('admin', 'admin@buildxpro.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'administrador'),
('usuario1', 'usuario1@buildxpro.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'usuario'),
('gerente', 'gerente@buildxpro.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'gerente');

-- Mostrar usuarios creados
SELECT id, nombre_usuario, email, rol, activo FROM usuarios;

