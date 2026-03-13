const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/authMiddleware');
const { validateLogin, validateRegister } = require('../middlewares/validationMiddleware');

// Rutas públicas
router.post('/login', validateLogin, authController.login);
router.post('/register', validateRegister, authController.register);
router.post('/verify-token', authController.verifyToken);

// Rutas protegidas
router.post('/change-password',
    authMiddleware.verificarToken,
    authController.changePassword
);

router.get('/perfil',
    authMiddleware.verificarToken,
    (req, res) => {
        res.json(req.user);
    }
);

module.exports = router;