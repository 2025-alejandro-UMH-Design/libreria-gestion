const ordenQueries = require('../models/queries/orden.queries');

const getAll = async (req, res) => {
    try {
        const ordenes = await ordenQueries.getAll();
        res.json(ordenes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener órdenes' });
    }
};

const getById = async (req, res) => {
    try {
        const orden = await ordenQueries.getById(req.params.id);
        if (!orden) return res.status(404).json({ message: 'Orden no encontrada' });
        res.json(orden);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener orden' });
    }
};

const create = async (req, res) => {
    try {
        const { proveedor_id, fecha, observaciones, detalles } = req.body;
        if (!proveedor_id || !detalles || !detalles.length) {
            return res.status(400).json({ message: 'Faltan datos: proveedor y detalles requeridos' });
        }

        // Calcular total
        let total = 0;
        for (const d of detalles) {
            total += d.cantidad * d.precio_unitario;
        }

        const ordenData = {
            proveedor_id,
            fecha,
            observaciones,
            total,
            usuario_id: 1 // temporal
        };

        const nuevaOrden = await ordenQueries.create(ordenData, detalles);
        res.status(201).json(nuevaOrden);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al crear orden', error: error.message });
    }
};

const cambiarEstado = async (req, res) => {
    try {
        const { estado } = req.body;
        if (!estado || !['pendiente', 'completada', 'cancelada'].includes(estado)) {
            return res.status(400).json({ message: 'Estado inválido' });
        }
        const orden = await ordenQueries.cambiarEstado(req.params.id, estado);
        if (!orden) return res.status(404).json({ message: 'Orden no encontrada' });
        res.json(orden);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al cambiar estado', error: error.message });
    }
};

const deleteOrden = async (req, res) => {
    try {
        const result = await ordenQueries.delete(req.params.id);
        if (!result) return res.status(404).json({ message: 'Orden no encontrada' });
        res.json({ message: 'Orden eliminada' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al eliminar orden', error: error.message });
    }
};

module.exports = { getAll, getById, create, cambiarEstado, delete: deleteOrden };