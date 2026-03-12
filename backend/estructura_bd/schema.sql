-- =====================================================
-- Base de datos para Librería - Sistema de Gestión
-- Versión: 1.0
-- =====================================================

-- Eliminar tablas si existen (para poder re-ejecutar el script)
-- El orden es importante por las claves foráneas
DROP TABLE IF EXISTS detalle_ordenes CASCADE;
DROP TABLE IF EXISTS ordenes CASCADE;
DROP TABLE IF EXISTS productos CASCADE;
DROP TABLE IF EXISTS proveedores CASCADE;
DROP TABLE IF EXISTS usuarios CASCADE;

-- =====================================================
-- TABLA: usuarios
-- =====================================================
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    rol VARCHAR(20) NOT NULL DEFAULT 'empleado',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    -- Restricción para asegurar que el rol sea válido
    CONSTRAINT rol_check CHECK (rol IN ('admin', 'empleado'))
);

-- Índice para búsquedas rápidas por email (útil en login)
CREATE INDEX idx_usuarios_email ON usuarios(email);

-- Comentarios para documentación
COMMENT ON TABLE usuarios IS 'Almacena los usuarios del sistema';
COMMENT ON COLUMN usuarios.rol IS 'Rol del usuario: admin o empleado';

-- =====================================================
-- TABLA: proveedores
-- =====================================================
CREATE TABLE proveedores (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    contacto VARCHAR(100), -- Nombre de la persona de contacto
    telefono VARCHAR(20),
    email VARCHAR(100),
    direccion TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índice para búsquedas por nombre
CREATE INDEX idx_proveedores_nombre ON proveedores(nombre);

COMMENT ON TABLE proveedores IS 'Catálogo de proveedores';

-- =====================================================
-- TABLA: productos
-- =====================================================
CREATE TABLE productos (
    id SERIAL PRIMARY KEY,
    codigo VARCHAR(50) UNIQUE NOT NULL,
    nombre VARCHAR(150) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10, 2) NOT NULL,
    stock_minimo INTEGER NOT NULL DEFAULT 5,
    stock_actual INTEGER NOT NULL DEFAULT 0,
    categoria VARCHAR(50),
    imagen_url VARCHAR(255),
    proveedor_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    -- Llave foránea a proveedores
    CONSTRAINT fk_productos_proveedor FOREIGN KEY (proveedor_id) 
        REFERENCES proveedores(id) ON DELETE SET NULL,
    -- Restricciones de validación
    CONSTRAINT precio_positivo CHECK (precio > 0),
    CONSTRAINT stock_minimo_positivo CHECK (stock_minimo >= 0),
    CONSTRAINT stock_actual_positivo CHECK (stock_actual >= 0)
);

-- Índices para mejorar rendimiento en búsquedas frecuentes
CREATE INDEX idx_productos_codigo ON productos(codigo);
CREATE INDEX idx_productos_nombre ON productos(nombre);
CREATE INDEX idx_productos_categoria ON productos(categoria);
CREATE INDEX idx_productos_stock_bajo ON productos(stock_actual) WHERE stock_actual < stock_minimo;

COMMENT ON TABLE productos IS 'Catálogo de productos de la librería';
COMMENT ON COLUMN productos.stock_minimo IS 'Stock mínimo para alertar cuando está bajo';
COMMENT ON COLUMN productos.stock_actual IS 'Stock actual disponible';

-- =====================================================
-- TABLA: ordenes
-- =====================================================
CREATE TABLE ordenes (
    id SERIAL PRIMARY KEY,
    fecha_orden TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    proveedor_id INTEGER NOT NULL,
    usuario_id INTEGER NOT NULL, -- Usuario que creó la orden
    estado VARCHAR(20) DEFAULT 'pendiente',
    total DECIMAL(12, 2) DEFAULT 0,
    observaciones TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    -- Llaves foráneas
    CONSTRAINT fk_ordenes_proveedor FOREIGN KEY (proveedor_id) 
        REFERENCES proveedores(id) ON DELETE RESTRICT,
    CONSTRAINT fk_ordenes_usuario FOREIGN KEY (usuario_id) 
        REFERENCES usuarios(id) ON DELETE RESTRICT,
    -- Restricción para estados válidos
    CONSTRAINT estado_check CHECK (estado IN ('pendiente', 'completada', 'cancelada'))
);

-- Índices para filtrado común
CREATE INDEX idx_ordenes_estado ON ordenes(estado);
CREATE INDEX idx_ordenes_fecha ON ordenes(fecha_orden);
CREATE INDEX idx_ordenes_proveedor ON ordenes(proveedor_id);

COMMENT ON TABLE ordenes IS 'Órdenes de compra a proveedores';
COMMENT ON COLUMN ordenes.estado IS 'Estado de la orden: pendiente, completada, cancelada';

-- =====================================================
-- TABLA: detalle_ordenes
-- =====================================================
CREATE TABLE detalle_ordenes (
    id SERIAL PRIMARY KEY,
    orden_id INTEGER NOT NULL,
    producto_id INTEGER NOT NULL,
    cantidad INTEGER NOT NULL,
    precio_unitario DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(12, 2) GENERATED ALWAYS AS (cantidad * precio_unitario) STORED,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    -- Llaves foráneas
    CONSTRAINT fk_detalle_orden FOREIGN KEY (orden_id) 
        REFERENCES ordenes(id) ON DELETE CASCADE,
    CONSTRAINT fk_detalle_producto FOREIGN KEY (producto_id) 
        REFERENCES productos(id) ON DELETE RESTRICT,
    -- Restricciones
    CONSTRAINT cantidad_positiva CHECK (cantidad > 0),
    CONSTRAINT precio_unitario_positivo CHECK (precio_unitario > 0)
);

-- Índices para consultas de detalle
CREATE INDEX idx_detalle_orden_id ON detalle_ordenes(orden_id);
CREATE INDEX idx_detalle_producto_id ON detalle_ordenes(producto_id);

COMMENT ON TABLE detalle_ordenes IS 'Detalle de productos incluidos en cada orden';
COMMENT ON COLUMN detalle_ordenes.subtotal IS 'Calculado automáticamente como cantidad * precio_unitario';

-- =====================================================
-- FUNCIÓN: Actualizar stock al recibir orden
-- =====================================================
-- Esta función se ejecutará mediante un trigger cuando
-- una orden cambie de estado a 'completada'
CREATE OR REPLACE FUNCTION actualizar_stock_por_orden()
RETURNS TRIGGER AS $$
BEGIN
    -- Solo cuando el estado cambia a 'completada'
    IF NEW.estado = 'completada' AND (OLD.estado IS NULL OR OLD.estado != 'completada') THEN
        -- Actualizar el stock de cada producto
        UPDATE productos p
        SET stock_actual = p.stock_actual + d.cantidad,
            updated_at = CURRENT_TIMESTAMP
        FROM detalle_ordenes d
        WHERE d.orden_id = NEW.id
        AND p.id = d.producto_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger que ejecuta la función
CREATE TRIGGER trigger_actualizar_stock
    AFTER UPDATE OF estado ON ordenes
    FOR EACH ROW
    EXECUTE FUNCTION actualizar_stock_por_orden();

-- =====================================================
-- FUNCIÓN: Calcular total de orden automáticamente
-- =====================================================
CREATE OR REPLACE FUNCTION calcular_total_orden()
RETURNS TRIGGER AS $$
BEGIN
    -- Actualizar el total de la orden sumando los subtotales
    UPDATE ordenes
    SET total = (
        SELECT COALESCE(SUM(subtotal), 0)
        FROM detalle_ordenes
        WHERE orden_id = NEW.orden_id
    ),
    updated_at = CURRENT_TIMESTAMP
    WHERE id = NEW.orden_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para mantener el total actualizado
CREATE TRIGGER trigger_calcular_total
    AFTER INSERT OR UPDATE OR DELETE ON detalle_ordenes
    FOR EACH ROW
    EXECUTE FUNCTION calcular_total_orden();

-- =====================================================
-- FUNCIÓN: Actualizar timestamp automáticamente
-- =====================================================
CREATE OR REPLACE FUNCTION actualizar_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar el trigger a todas las tablas
CREATE TRIGGER trigger_actualizar_timestamp_usuarios
    BEFORE UPDATE ON usuarios
    FOR EACH ROW
    EXECUTE FUNCTION actualizar_timestamp();

CREATE TRIGGER trigger_actualizar_timestamp_proveedores
    BEFORE UPDATE ON proveedores
    FOR EACH ROW
    EXECUTE FUNCTION actualizar_timestamp();

CREATE TRIGGER trigger_actualizar_timestamp_productos
    BEFORE UPDATE ON productos
    FOR EACH ROW
    EXECUTE FUNCTION actualizar_timestamp();

CREATE TRIGGER trigger_actualizar_timestamp_ordenes
    BEFORE UPDATE ON ordenes
    FOR EACH ROW
    EXECUTE FUNCTION actualizar_timestamp();

-- =====================================================
-- VISTA: Productos con stock bajo
-- =====================================================
CREATE VIEW vista_productos_stock_bajo AS
SELECT 
    id,
    codigo,
    nombre,
    stock_actual,
    stock_minimo,
    (stock_minimo - stock_actual) AS cantidad_faltante,
    categoria,
    precio
FROM productos
WHERE stock_actual < stock_minimo
ORDER BY (stock_minimo - stock_actual) DESC;

COMMENT ON VIEW vista_productos_stock_bajo IS 'Muestra productos que necesitan reposición';

-- =====================================================
-- VISTA: Resumen de órdenes por mes
-- =====================================================
CREATE VIEW vista_ordenes_por_mes AS
SELECT 
    EXTRACT(YEAR FROM fecha_orden) AS año,
    EXTRACT(MONTH FROM fecha_orden) AS mes,
    COUNT(*) AS total_ordenes,
    SUM(total) AS monto_total,
    SUM(CASE WHEN estado = 'completada' THEN 1 ELSE 0 END) AS completadas,
    SUM(CASE WHEN estado = 'pendiente' THEN 1 ELSE 0 END) AS pendientes,
    SUM(CASE WHEN estado = 'cancelada' THEN 1 ELSE 0 END) AS canceladas
FROM ordenes
GROUP BY año, mes
ORDER BY año DESC, mes DESC;

COMMENT ON VIEW vista_ordenes_por_mes IS 'Resumen mensual de órdenes para dashboard';