const productoQueries = require('../models/queries/producto.queries');
console.log('🔥 productoQueries:', productoQueries);
console.log('🔥 getAll existe?', typeof productoQueries.getAll);





// Obtener todos los productos
const getAll = async (req, res) => {
    try {
        const productos = await productoQueries.getAll();
        res.json(productos);
    } catch (error) {
        console.error('Error en getAll productos:', error);
        res.status(500).json({ message: 'Error al obtener productos', error: error.message });
    }
};

// Obtener un producto por ID
const getById = async (req, res) => {
    const { id } = req.params;
    try {
        const producto = await productoQueries.getById(id);
        if (!producto) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        res.json(producto);
    } catch (error) {
        console.error('Error en getById:', error);
        res.status(500).json({ message: 'Error al obtener producto', error: error.message });
    }
};

// Crear producto
const create = async (req, res) => {
    try {
        // Los campos del formulario vienen en req.body
        const productoData = { ...req.body };
        
        // Si se subió una imagen, agregar la ruta
        if (req.file) {
            // Guardamos la ruta relativa para acceder vía /uploads
            productoData.imagen_url = `/uploads/${req.file.filename}`;
        } else {
            productoData.imagen_url = ''; // o null
        }

        // Validaciones básicas
        if (!productoData.codigo || !productoData.nombre || !productoData.precio) {
            return res.status(400).json({ message: 'Faltan campos requeridos: código, nombre, precio' });
        }

        // Verificar código duplicado
        const existe = await productoQueries.existsByCodigo(productoData.codigo);
        if (existe) {
            return res.status(400).json({ message: 'Ya existe un producto con ese código' });
        }

        const nuevoProducto = await productoQueries.create(productoData);
        res.status(201).json(nuevoProducto);
    } catch (error) {
        console.error('Error en create:', error);
        res.status(500).json({ message: 'Error al crear producto', error: error.message });
    }
};

// Actualizar producto
const update = async (req, res) => {
    const { id } = req.params;
    try {
        const productoData = { ...req.body };

        // Si se subió una nueva imagen, actualizar la ruta
        if (req.file) {
            productoData.imagen_url = `/uploads/${req.file.filename}`;
        }

        // Verificar si existe
        const existente = await productoQueries.getById(id);
        if (!existente) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        // Verificar código duplicado (excepto el mismo)
        if (productoData.codigo && productoData.codigo !== existente.codigo) {
            const existe = await productoQueries.existsByCodigo(productoData.codigo, id);
            if (existe) {
                return res.status(400).json({ message: 'Ya existe otro producto con ese código' });
            }
        }

        const productoActualizado = await productoQueries.update(id, productoData);
        res.json(productoActualizado);
    } catch (error) {
        console.error('Error en update:', error);
        res.status(500).json({ message: 'Error al actualizar producto', error: error.message });
    }
};

// Eliminar producto
const deleteProduct = async (req, res) => {
    const { id } = req.params;
    try {
        // Verificar si existe
        const existente = await productoQueries.getById(id);
        if (!existente) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        await productoQueries.delete(id);
        res.json({ message: 'Producto eliminado correctamente' });
    } catch (error) {
        console.error('Error en delete:', error);
        res.status(500).json({ message: 'Error al eliminar producto', error: error.message });
    }
};

module.exports = {
    getAll,
    getById,
    create,
    update,
    delete: deleteProduct
};