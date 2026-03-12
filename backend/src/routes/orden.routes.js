const express = require('express');
const router = express.Router();
const ordenController = require('../controllers/orden.controller');

router.get('/', ordenController.getAll);
router.get('/:id', ordenController.getById);
router.post('/', ordenController.create);
router.patch('/:id/estado', ordenController.cambiarEstado);
router.delete('/:id', ordenController.delete);

module.exports = router;