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

// backend/src/controllers/dashboard.controller.js
const getVentasPorEmpleado = async (req, res) => {
    try {
        const query = `
            SELECT u.id, u.nombre, u.email,
                   COUNT(o.id) as total_ordenes,
                   COALESCE(SUM(o.total), 0) as monto_total
            FROM usuarios u
            LEFT JOIN ordenes o ON u.id = o.usuario_id
            GROUP BY u.id, u.nombre, u.email
            ORDER BY monto_total DESC
        `;
        const result = await db.query(query);
        res.json(result.rows);
    } catch (error) {
        console.error('Error en getVentasPorEmpleado:', error);
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

// Stock total de productos
const getStockTotal = async (req, res) => {
    try {
        const query = `
            SELECT id, codigo, nombre, stock_actual, stock_minimo,
                   (stock_minimo - stock_actual) as cantidad_faltante
            FROM productos
            ORDER BY nombre
        `;
        const result = await db.query(query);
        res.json(result.rows);
    } catch (error) {
        console.error('Error en getStockTotal:', error);
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

const getProductosMasVendidos = async (req, res) => {
    try {
        const query = `
            SELECT p.id, p.codigo, p.nombre,
                   COALESCE(SUM(d.cantidad), 0) as cantidad_vendida,
                   COALESCE(SUM(d.cantidad * d.precio_unitario), 0) as monto_total
            FROM productos p
            LEFT JOIN detalle_ordenes d ON p.id = d.producto_id
            GROUP BY p.id, p.codigo, p.nombre
            ORDER BY cantidad_vendida DESC
            LIMIT 10
        `;
        const result = await db.query(query);
        res.json(result.rows);
    } catch (error) {
        console.error('Error en getProductosMasVendidos:', error);
        res.status(500).json({ error: error.message });
    }
};

const getOrdenesPorMes = async (req, res) => {
    try {
        const { fecha_inicio, fecha_fin } = req.query;
        let query;
        let params = [];

        if (fecha_inicio && fecha_fin) {
            query = `
                SELECT 
                    TO_CHAR(fecha_orden, 'YYYY-MM') as mes,
                    COUNT(*) as total_ordenes,
                    SUM(total) as monto_total
                FROM ordenes
                WHERE fecha_orden >= $1 AND fecha_orden <= $2
                GROUP BY mes
                ORDER BY mes
            `;
            params = [fecha_inicio, fecha_fin];
        } else {
            // Últimos 12 meses por defecto
            query = `
                SELECT 
                    TO_CHAR(fecha_orden, 'YYYY-MM') as mes,
                    COUNT(*) as total_ordenes,
                    SUM(total) as monto_total
                FROM ordenes
                WHERE fecha_orden >= NOW() - INTERVAL '12 months'
                GROUP BY mes
                ORDER BY mes
            `;
        }

        const result = await db.query(query, params);
        res.json(result.rows);
    } catch (error) {
        console.error('Error en getOrdenesPorMes:', error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getTotales,
    getStockBajo,
    getUltimasOrdenes,
    getOrdenesPorMes,
    getProductosMasVendidos,
    getStockTotal,
    getVentasPorEmpleado   // <-- nueva línea

};