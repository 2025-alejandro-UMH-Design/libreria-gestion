// src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');
const { validateLogin, validateRegister } = require('../middlewares/validationMiddleware');

// Rutas públicas
router.post('/login', validateLogin, authController.login);
router.post('/verify-token', authController.verifyToken);

// Rutas protegidas
router.post('/register', 
    authMiddleware.verificarToken,
    authMiddleware.esAdmin,
    validateRegister,
    authController.register
);

router.post('/change-password',
    authMiddleware.verificarToken,
    authController.changePassword
);

// Ruta para obtener perfil del usuario autenticado
router.get('/perfil',
    authMiddleware.verificarToken,
    async (req, res) => {
        try {
            const usuario = await Usuario.findById(req.user.id);
            res.json(usuario);
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener perfil' });
        }
    }
);

module.exports = router;