// backend/src/models/queries/producto.queries.js
const db = require('../../config/database');

const productoQueries = {
    // Obtener todos los productos (con opción de incluir proveedor)
    getAll: async () => {
        const query = `
            SELECT p.*, prov.nombre as proveedor_nombre 
            FROM productos p
            LEFT JOIN proveedores prov ON p.proveedor_id = prov.id
            ORDER BY p.id DESC
        `;
        const result = await db.query(query);
        return result.rows;
    },

    // Obtener un producto por ID
    getById: async (id) => {
        const query = `
            SELECT p.*, prov.nombre as proveedor_nombre 
            FROM productos p
            LEFT JOIN proveedores prov ON p.proveedor_id = prov.id
            WHERE p.id = $1
        `;
        const result = await db.query(query, [id]);
        return result.rows[0];
    },

    // Crear un nuevo producto
    create: async (producto) => {
        const { codigo, nombre, descripcion, precio, stock_minimo, stock_actual, categoria, imagen_url, proveedor_id } = producto;
        const query = `
            INSERT INTO productos 
            (codigo, nombre, descripcion, precio, stock_minimo, stock_actual, categoria, imagen_url, proveedor_id)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING *
        `;
        const values = [codigo, nombre, descripcion, precio, stock_minimo, stock_actual, categoria, imagen_url, proveedor_id || null];
        const result = await db.query(query, values);
        return result.rows[0];
    },

    // Actualizar un producto
    update: async (id, producto) => {
        const { codigo, nombre, descripcion, precio, stock_minimo, stock_actual, categoria, imagen_url, proveedor_id } = producto;
        const query = `
            UPDATE productos
            SET codigo = $1, nombre = $2, descripcion = $3, precio = $4, 
                stock_minimo = $5, stock_actual = $6, categoria = $7, 
                imagen_url = $8, proveedor_id = $9, updated_at = CURRENT_TIMESTAMP
            WHERE id = $10
            RETURNING *
        `;
        const values = [codigo, nombre, descripcion, precio, stock_minimo, stock_actual, categoria, imagen_url, proveedor_id || null, id];
        const result = await db.query(query, values);
        return result.rows[0];
    },

    // Eliminar un producto
    delete: async (id) => {
        const query = 'DELETE FROM productos WHERE id = $1 RETURNING id';
        const result = await db.query(query, [id]);
        return result.rows[0];
    },

    // Verificar si existe un código (para evitar duplicados)
    existsByCodigo: async (codigo, excludeId = null) => {
        let query = 'SELECT id FROM productos WHERE codigo = $1';
        const params = [codigo];
        if (excludeId) {
            query += ' AND id != $2';
            params.push(excludeId);
        }
        const result = await db.query(query, params);
        return result.rows.length > 0;
    }
};
console.log('✅ productoQueries exportado correctamente. Funciones disponibles:', Object.keys(productoQueries));
module.exports = productoQueries;