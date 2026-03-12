import { Router } from 'express';

const router = Router();

let productos: any[] = [];

/* OBTENER TODOS LOS PRODUCTOS */
router.get('/', (req, res) => {
    res.json(productos);
});

/* OBTENER UN PRODUCTO POR ID */
router.get('/:id', (req, res) => {
    const id = Number(req.params.id);
    const producto = productos.find(p => p.id === id);

    if (!producto) {
        return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }

    res.json(producto);
});

/* CREAR PRODUCTO */
router.post('/', (req, res) => {
    const nuevoProducto = {
        id: productos.length + 1,
        ...req.body
    };

    productos.push(nuevoProducto);

    res.status(201).json({
        mensaje: 'Producto creado',
        producto: nuevoProducto
    });
});

/* ACTUALIZAR PRODUCTO */
router.put('/:id', (req, res) => {
    const id = Number(req.params.id);
    const index = productos.findIndex(p => p.id === id);

    if (index === -1) {
        return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }

    productos[index] = {
        ...productos[index],
        ...req.body
    };

    res.json({
        mensaje: 'Producto actualizado',
        producto: productos[index]
    });
});

/* ELIMINAR PRODUCTO */
router.delete('/:id', (req, res) => {
    const id = Number(req.params.id);
    const index = productos.findIndex(p => p.id === id);

    if (index === -1) {
        return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }

    const eliminado = productos.splice(index, 1);

    res.json({
        mensaje: 'Producto eliminado',
        producto: eliminado
    });
});

export default router;