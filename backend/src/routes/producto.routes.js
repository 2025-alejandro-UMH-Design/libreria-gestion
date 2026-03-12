const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const authMiddleware = require('../middlewares/authMiddleware');
const rolesMiddleware = require('../middlewares/rolesMiddleware');

// Configuración de multer para subida de imágenes
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Cargar controlador
let productoController;
try {
    productoController = require('../controllers/producto.controller');
    console.log('✅ Controlador cargado. Propiedades:', Object.keys(productoController));
} catch (error) {
    console.error('❌ Error al cargar controlador:', error.message);
    productoController = {};
}

// Middleware de autenticación (comentado temporalmente para pruebas)
// router.use(authMiddleware.verificarToken);

// Rutas
router.get('/', (req, res) => {
    if (typeof productoController.getAll === 'function') {
        return productoController.getAll(req, res);
    }
    res.json({ message: 'getAll no implementado (mock)', productos: [] });
});

router.get('/:id', (req, res) => {
    if (typeof productoController.getById === 'function') {
        return productoController.getById(req, res);
    }
    res.json({ message: `getById no implementado para id ${req.params.id}`, producto: null });
});

// Para crear producto con imagen
router.post('/', 
    upload.single('imagen'), 
    (req, res) => {
        if (typeof productoController.create === 'function') {
            if (req.file) {
                req.body.imagen_url = 'uploads/' + req.file.filename; // ruta relativa
            }
            return productoController.create(req, res);
        }
        res.status(201).json({ message: 'create no implementado (mock)', producto: req.body });
    }
);

router.put('/:id', 
    upload.single('imagen'),
    (req, res) => {
        if (typeof productoController.update === 'function') {
            if (req.file) {
                req.body.imagen_url = 'uploads/' + req.file.filename;
            }
            return productoController.update(req, res);
        }
        res.json({ message: `update no implementado para id ${req.params.id}`, producto: req.body });
    }
);

router.delete('/:id', (req, res) => {
    if (typeof productoController.delete === 'function') {
        return productoController.delete(req, res);
    }
    res.json({ message: `delete no implementado para id ${req.params.id}` });
});

module.exports = router;