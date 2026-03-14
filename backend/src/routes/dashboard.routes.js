const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard.controller'); // Asegúrate de que la ruta sea correcta

// Si quieres eliminar la autenticación temporalmente, comenta o borra estas líneas:
// const authMiddleware = require('../middlewares/authMiddleware');
// const rolesMiddleware = require('../middlewares/rolesMiddleware');
// router.use(authMiddleware.verificarToken);
// router.use(rolesMiddleware(['admin']));

router.get('/totales', dashboardController.getTotales);
router.get('/stock-bajo', dashboardController.getStockBajo);
router.get('/ultimas-ordenes', dashboardController.getUltimasOrdenes);

module.exports = router;