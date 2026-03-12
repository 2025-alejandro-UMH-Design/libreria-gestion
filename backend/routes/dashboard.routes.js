const express = require('express');
const router = express.Router();

router.get('/resumen', (req, res) => {

  res.json({
    productos: 128,
    proveedores: 22,
    ordenes: 41,
    stockBajo: 7
  });

});

router.get('/stock-bajo', (req, res) => {

  res.json([
    { codigo:'LIB-001', nombre:'Cuaderno universitario', stockActual:3, stockMinimo:10, categoria:'Papelería'},
    { codigo:'LIB-014', nombre:'Lápiz HB', stockActual:8, stockMinimo:20, categoria:'Escritura'}
  ]);

});

router.get('/ordenes-recientes', (req, res) => {

  res.json([
    { id:101, proveedor:'Distribuidora Escolar', fecha:'2026-03-10', estado:'Pendiente', total:3250 },
    { id:102, proveedor:'Papeles y Más', fecha:'2026-03-09', estado:'Completada', total:4870 }
  ]);

});

module.exports = router;