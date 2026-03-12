import { Router } from 'express';

const router = Router();

let proveedores: any[] = [];

/* OBTENER TODOS LOS PROVEEDORES */
router.get('/', (req, res) => {
    res.json(proveedores);
});

/* OBTENER PROVEEDOR POR ID */
router.get('/:id', (req, res) => {
    const id = Number(req.params.id);
    const proveedor = proveedores.find(p => p.id === id);

    if (!proveedor) {
        return res.status(404).json({ mensaje: 'Proveedor no encontrado' });
    }

    res.json(proveedor);
});

/* CREAR PROVEEDOR */
router.post('/', (req, res) => {
    const nuevoProveedor = {
        id: proveedores.length + 1,
        ...req.body
    };

    proveedores.push(nuevoProveedor);

    res.status(201).json({
        mensaje: 'Proveedor creado',
        proveedor: nuevoProveedor
    });
});

/* ACTUALIZAR PROVEEDOR */
router.put('/:id', (req, res) => {
    const id = Number(req.params.id);
    const index = proveedores.findIndex(p => p.id === id);

    if (index === -1) {
        return res.status(404).json({ mensaje: 'Proveedor no encontrado' });
    }

    proveedores[index] = {
        ...proveedores[index],
        ...req.body
    };

    res.json({
        mensaje: 'Proveedor actualizado',
        proveedor: proveedores[index]
    });
});

/* ELIMINAR PROVEEDOR */
router.delete('/:id', (req, res) => {
    const id = Number(req.params.id);
    const index = proveedores.findIndex(p => p.id === id);

    if (index === -1) {
        return res.status(404).json({ mensaje: 'Proveedor no encontrado' });
    }

    const eliminado = proveedores.splice(index, 1);

    res.json({
        mensaje: 'Proveedor eliminado',
        proveedor: eliminado
    });
});

export default router;