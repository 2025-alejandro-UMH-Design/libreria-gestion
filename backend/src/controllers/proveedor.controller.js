const proveedorQueries = require('../models/queries/proveedor.queries');

const getAll = async (req, res) => {
    try {
        const proveedores = await proveedorQueries.getAll();
        res.json(proveedores);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener proveedores' });
    }
};

const getById = async (req, res) => {
    try {
        const proveedor = await proveedorQueries.getById(req.params.id);
        if (!proveedor) return res.status(404).json({ message: 'Proveedor no encontrado' });
        res.json(proveedor);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener proveedor' });
    }
};

const create = async (req, res) => {
    try {
        const proveedor = await proveedorQueries.create(req.body);
        res.status(201).json(proveedor);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al crear proveedor' });
    }
};

const update = async (req, res) => {
    try {
        const proveedor = await proveedorQueries.update(req.params.id, req.body);
        if (!proveedor) return res.status(404).json({ message: 'Proveedor no encontrado' });
        res.json(proveedor);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al actualizar proveedor' });
    }
};

const deleteProveedor = async (req, res) => {
    try {
        const result = await proveedorQueries.delete(req.params.id);
        if (!result) return res.status(404).json({ message: 'Proveedor no encontrado' });
        res.json({ message: 'Proveedor eliminado' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al eliminar proveedor' });
    }
};

module.exports = { getAll, getById, create, update, delete: deleteProveedor };