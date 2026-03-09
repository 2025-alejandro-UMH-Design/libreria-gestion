-- =====================================================
-- Datos de prueba para la Librería
-- =====================================================

-- Insertar usuarios (contraseña: 'password123' hasheada con bcrypt)
-- El hash mostrado es solo un ejemplo, deben generar los suyos
INSERT INTO usuarios (nombre, email, password_hash, rol) VALUES
('Administrador', 'admin@libreria.com', '$2b$10$YourHashedPasswordHere1', 'admin'),
('Juan Pérez', 'juan@libreria.com', '$2b$10$YourHashedPasswordHere2', 'empleado'),
('María García', 'maria@libreria.com', '$2b$10$YourHashedPasswordHere3', 'empleado');

-- Insertar proveedores
INSERT INTO proveedores (nombre, contacto, telefono, email, direccion) VALUES
('Distribuidora Cultural', 'Carlos Rodríguez', '555-1234', 'carlos@cultural.com', 'Av. Principal 123, Ciudad'),
('Libros Mundiales', 'Ana Martínez', '555-5678', 'ana@mundiales.com', 'Calle Secundaria 456, Ciudad'),
('Editorial Nacional', 'Roberto Gómez', '555-9012', 'roberto@editorial.com', 'Av. Central 789, Ciudad'),
('Proveedor Educativo', 'Laura Sánchez', '555-3456', 'laura@educativo.com', 'Calle del Saber 234, Ciudad');

-- Insertar productos
INSERT INTO productos (codigo, nombre, descripcion, precio, stock_minimo, stock_actual, categoria, proveedor_id) VALUES
('LIB001', 'Cien años de soledad', 'Novela de Gabriel García Márquez', 45000.00, 5, 10, 'Novela', 1),
('LIB002', 'El principito', 'Libro infantil de Antoine de Saint-Exupéry', 25000.00, 3, 2, 'Infantil', 2),
('LIB003', '1984', 'Novela distópica de George Orwell', 38000.00, 4, 4, 'Novela', 1),
('LIB004', 'Don Quijote de la Mancha', 'Obra de Miguel de Cervantes', 65000.00, 2, 8, 'Clásico', 3),
('LIB005', 'Harry Potter y la piedra filosofal', 'J.K. Rowling', 55000.00, 6, 15, 'Fantasía', 2),
('LIB006', 'La sombra del viento', 'Carlos Ruiz Zafón', 42000.00, 3, 1, 'Novela', 1),
('LIB007', 'El código Da Vinci', 'Dan Brown', 48000.00, 4, 3, 'Misterio', 4),
('LIB008', 'Rayuela', 'Julio Cortázar', 39000.00, 2, 6, 'Novela', 3),
('LIB009', 'Pedro Páramo', 'Juan Rulfo', 28000.00, 3, 2, 'Novela', 3),
('LIB010', 'Ficciones', 'Jorge Luis Borges', 35000.00, 2, 4, 'Cuento', 1);

-- Insertar órdenes de compra
INSERT INTO ordenes (proveedor_id, usuario_id, estado, total, observaciones) VALUES
(1, 1, 'completada', 245000.00, 'Primera orden del mes'),
(2, 2, 'pendiente', 180000.00, 'Esperando confirmación'),
(1, 1, 'completada', 320000.00, 'Reabastecimiento general'),
(3, 2, 'cancelada', 95000.00, 'Cancelado por el proveedor'),
(2, 1, 'pendiente', 210000.00, NULL);

-- Insertar detalles de órdenes
-- Orden 1 (completada)
INSERT INTO detalle_ordenes (orden_id, producto_id, cantidad, precio_unitario) VALUES
(1, 1, 3, 45000.00),  -- 3x Cien años de soledad
(1, 3, 2, 38000.00),  -- 2x 1984
(1, 5, 1, 55000.00);  -- 1x Harry Potter

-- Orden 2 (pendiente)
INSERT INTO detalle_ordenes (orden_id, producto_id, cantidad, precio_unitario) VALUES
(2, 2, 5, 25000.00),  -- 5x El principito
(2, 7, 1, 48000.00);  -- 1x Código Da Vinci

-- Orden 3 (completada)
INSERT INTO detalle_ordenes (orden_id, producto_id, cantidad, precio_unitario) VALUES
(3, 4, 2, 65000.00),  -- 2x Don Quijote
(3, 8, 3, 39000.00),  -- 3x Rayuela
(3, 9, 2, 28000.00);  -- 2x Pedro Páramo

-- Orden 4 (cancelada)
INSERT INTO detalle_ordenes (orden_id, producto_id, cantidad, precio_unitario) VALUES
(4, 6, 2, 42000.00),  -- 2x Sombra del viento
(4, 10, 1, 35000.00); -- 1x Ficciones

-- Orden 5 (pendiente)
INSERT INTO detalle_ordenes (orden_id, producto_id, cantidad, precio_unitario) VALUES
(5, 2, 4, 25000.00),  -- 4x El principito
(5, 5, 2, 55000.00);  -- 2x Harry Potter

-- Nota: Los triggers actualizarán automáticamente:
-- - Los subtotales en detalle_ordenes
-- - Los totales en ordenes
-- - El stock cuando una orden pasa a 'completada'