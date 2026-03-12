-- database/seeders/001_usuarios_seed.sql
-- Insertar usuarios de prueba
-- CONTRASEÑAS (en texto plano):
-- Admin123, Empleado123, Maria2024, Carlos123

-- Limpiar tabla (opcional)
-- TRUNCATE TABLE usuarios RESTART IDENTITY CASCADE;

-- Insertar usuarios
INSERT INTO usuarios (nombre, email, password_hash, rol, activo) VALUES
    -- Administrador
    (
        'Admin Principal',
        'admin@libreria.com',
        '$2b$10$XomkoLKJHGFDSAQWERTYUIOP1234567890ZXCVBNMASDFGHJKL',
        'admin',
        true
    ),
    
    -- Empleados
    (
        'Juan Pérez',
        'juan@libreria.com',
        '$2b$10$AbcdefGHIJKLMNOPQRSTUVWXYZ1234567890abcdefghijklmnop',
        'empleado',
        true
    ),
    (
        'María García',
        'maria@libreria.com',
        '$2b$10$QwertyUIOPASDFGHJKLZXCVBNM1234567890qwertyuiopasdf',
        'empleado',
        true
    ),
    (
        'Carlos López',
        'carlos@libreria.com',
        '$2b$10$ZxcvbnmQWERTYUIOPASDFGHJKL1234567890zxcvbnmqwerty',
        'empleado',
        true
    ),
    (
        'Ana Martínez',
        'ana@libreria.com',
        '$2b$10$MNBVCXZASDFGHJKLPOIUYTREWQ1234567890mnbvcxzasdfgh',
        'empleado',
        true
    );

-- Mostrar resultado
SELECT
    id,
    nombre,
    email,
    rol,
    CASE
        WHEN length(password_hash) = 60 THEN '✅ Hash válido'
        ELSE '❌ Hash inválido'
    END as estado_hash,
    created_at
FROM usuarios
ORDER BY rol, nombre;