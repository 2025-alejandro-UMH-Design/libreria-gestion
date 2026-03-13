const db = require('../../config/database');

const ordenQueries = {
    // Obtener todas las órdenes con proveedor
    getAll: async () => {
        const query = `
            SELECT o.*, p.nombre as proveedor_nombre
            FROM ordenes o
            LEFT JOIN proveedores p ON o.proveedor_id = p.id
            ORDER BY o.fecha_orden DESC
        `;
        const result = await db.query(query);
        return result.rows;
    },

    // Obtener una orden con sus detalles y productos
    getById: async (id) => {
        // Obtener la orden
        const ordenQuery = `
            SELECT o.*, p.nombre as proveedor_nombre
            FROM ordenes o
            LEFT JOIN proveedores p ON o.proveedor_id = p.id
            WHERE o.id = $1
        `;
        const ordenResult = await db.query(ordenQuery, [id]);
        if (ordenResult.rows.length === 0) return null;

        const orden = ordenResult.rows[0];

        // Obtener detalles con información del producto
        const detallesQuery = `
            SELECT d.*, prod.nombre as producto_nombre, prod.imagen_url
            FROM detalle_ordenes d
            JOIN productos prod ON d.producto_id = prod.id
            WHERE d.orden_id = $1
        `;
        const detallesResult = await db.query(detallesQuery, [id]);
        orden.detalles = detallesResult.rows;
        return orden;
    },

    // Crear una orden y sus detalles (usando transacción)
    create: async (ordenData, detalles) => {
        const client = await db.pool.connect();
        try {
            await client.query('BEGIN');

            // Insertar orden
            const ordenInsert = `
                INSERT INTO ordenes (fecha_orden, proveedor_id, usuario_id, estado, total, observaciones)
                VALUES ($1, $2, $3, $4, $5, $6) RETURNING *
            `;
            const ordenValues = [
                ordenData.fecha || new Date(),
                ordenData.proveedor_id,
                ordenData.usuario_id || 1,
                'pendiente',
                ordenData.total || 0,
                ordenData.observaciones || ''
            ];
            const ordenResult = await client.query(ordenInsert, ordenValues);
            const orden = ordenResult.rows[0];

            // Insertar detalles
            for (const detalle of detalles) {
                const detalleInsert = `
                    INSERT INTO detalle_ordenes (orden_id, producto_id, cantidad, precio_unitario)
                    VALUES ($1, $2, $3, $4)
                `;
                await client.query(detalleInsert, [
                    orden.id,
                    detalle.producto_id,
                    detalle.cantidad,
                    detalle.precio_unitario
                ]);
            }

            await client.query('COMMIT');
            return orden;
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    },

    // Cambiar estado de una orden (y actualizar stock si se completa)
    cambiarEstado: async (id, nuevoEstado) => {
        const client = await db.pool.connect();
        try {
            await client.query('BEGIN');

            // Obtener estado actual
            const estadoActualQuery = await client.query('SELECT estado FROM ordenes WHERE id = $1', [id]);
            if (estadoActualQuery.rows.length === 0) return null;
            const estadoActual = estadoActualQuery.rows[0].estado;

            // Si ya está completada, no permitir cambios (o manejarlo)
            if (estadoActual === 'completada') {
                throw new Error('No se puede cambiar una orden ya completada');
            }

            // Actualizar estado
            const updateQuery = 'UPDATE ordenes SET estado = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *';
            const updateResult = await client.query(updateQuery, [nuevoEstado, id]);
            const orden = updateResult.rows[0];

            // Si el nuevo estado es 'completada', actualizar stock de productos
            if (nuevoEstado === 'completada') {
                // Obtener detalles de la orden
                const detalles = await client.query('SELECT producto_id, cantidad FROM detalle_ordenes WHERE orden_id = $1', [id]);
                for (const detalle of detalles.rows) {
                    await client.query(
                        'UPDATE productos SET stock_actual = stock_actual + $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
                        [detalle.cantidad, detalle.producto_id]
                    );
                }
            }

            await client.query('COMMIT');
            return orden;
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    },

    // Eliminar una orden (solo si está pendiente)
    delete: async (id) => {
        const client = await db.pool.connect();
        try {
            await client.query('BEGIN');
            const orden = await client.query('SELECT estado FROM ordenes WHERE id = $1', [id]);
            if (orden.rows.length === 0) return null;
            if (orden.rows[0].estado !== 'pendiente') {
                throw new Error('Solo se pueden eliminar órdenes pendientes');
            }
            await client.query('DELETE FROM detalle_ordenes WHERE orden_id = $1', [id]);
            await client.query('DELETE FROM ordenes WHERE id = $1', [id]);
            await client.query('COMMIT');
            return { id };
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }
};

module.exports = ordenQueries;