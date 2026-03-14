// backend/src/controllers/dashboard.controller.js
const db = require('../config/database');

const getTotales = async (req, res) => {
    try {
        const productos = await db.query('SELECT COUNT(*) as total FROM productos');
        console.log('productos count:', productos.rows);
        const proveedores = await db.query('SELECT COUNT(*) as total FROM proveedores');
        console.log('proveedores count:', proveedores.rows);
        const ordenes = await db.query('SELECT COUNT(*) as total FROM ordenes');
        console.log('ordenes count:', ordenes.rows);
        res.json({
            totalProductos: parseInt(productos.rows[0].total),
            totalProveedores: parseInt(proveedores.rows[0].total),
            totalOrdenes: parseInt(ordenes.rows[0].total)
        });
    } catch (error) {
        console.error('Error en getTotales:', error);
        res.status(500).json({ error: error.message });
    }
};
const getStockBajo = async (req, res) => {
    try {
        const result = await db.query(`
            SELECT id, codigo, nombre, stock_actual, stock_minimo,
                   (stock_minimo - stock_actual) as cantidad_faltante
            FROM productos
            WHERE stock_actual < stock_minimo
            ORDER BY cantidad_faltante DESC
        `);
        res.json(result.rows);
    } catch (error) {
        console.error('Error en getStockBajo:', error);
        res.status(500).json({ error: error.message });
    }
};

const getUltimasOrdenes = async (req, res) => {
    try {
        const result = await db.query(`
            SELECT o.id, o.fecha_orden, o.estado, o.total, p.nombre as proveedor
            FROM ordenes o
            LEFT JOIN proveedores p ON o.proveedor_id = p.id
            ORDER BY o.fecha_orden DESC
            LIMIT 5
        `);
        res.json(result.rows);
    } catch (error) {
        console.error('Error en getUltimasOrdenes:', error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getTotales,
    getStockBajo,
    getUltimasOrdenes
};