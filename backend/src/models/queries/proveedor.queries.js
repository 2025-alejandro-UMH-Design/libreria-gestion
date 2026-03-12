const db = require('../../config/database');

const proveedorQueries = {
    getAll: async () => {
        const query = 'SELECT * FROM proveedores ORDER BY id DESC';
        const result = await db.query(query);
        return result.rows;
    },
    getById: async (id) => {
        const query = 'SELECT * FROM proveedores WHERE id = $1';
        const result = await db.query(query, [id]);
        return result.rows[0];
    },
    create: async (proveedor) => {
        const { nombre, contacto, telefono, email, direccion } = proveedor;
        const query = `
            INSERT INTO proveedores (nombre, contacto, telefono, email, direccion)
            VALUES ($1, $2, $3, $4, $5) RETURNING *
        `;
        const values = [nombre, contacto, telefono, email, direccion];
        const result = await db.query(query, values);
        return result.rows[0];
    },
    update: async (id, proveedor) => {
        const { nombre, contacto, telefono, email, direccion } = proveedor;
        const query = `
            UPDATE proveedores
            SET nombre = $1, contacto = $2, telefono = $3, email = $4, direccion = $5,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $6 RETURNING *
        `;
        const values = [nombre, contacto, telefono, email, direccion, id];
        const result = await db.query(query, values);
        return result.rows[0];
    },
    delete: async (id) => {
        const query = 'DELETE FROM proveedores WHERE id = $1 RETURNING id';
        const result = await db.query(query, [id]);
        return result.rows[0];
    }
};

module.exports = proveedorQueries;