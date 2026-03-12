// server.js
const path = require('path');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
require('dotenv').config();


// Importar rutas
const authRoutes = require('./src/routes/authRoutes');
const productoRoutes = require('./src/routes/producto.routes'); // Asegurar que existe
const ordenRoutes = require('./src/routes/orden.routes');
const proveedorRoutes = require('./src/routes/proveedor.routes');
const dashboardRoutes = require('./routes/dashboard.routes');

const app = express();
const PORT = process.env.PORT || 3000;

// Rate limiting
const limiter = rateLimit({
  windowMs: process.env.RATE_LIMIT_WINDOW_MS || 900000,
  max: process.env.RATE_LIMIT_MAX_REQUESTS || 100,
  message: 'Demasiadas peticiones, intenta más tarde'
});

// Middlewares globales
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : '*',
  credentials: true
}));
app.use(compression());
app.use(morgan('dev'));


app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
  setHeaders: (res, filePath) => {
    res.set('Access-Control-Allow-Origin', 'http://localhost:4200'); // o '*' para pruebas
    res.set('Cross-Origin-Resource-Policy', 'cross-origin');
  }
}));
// Aplicar rate limiting a rutas de auth
app.use('/api/auth', limiter);

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/productos', productoRoutes);
app.use('/uploads', express.static('uploads'));
app.use('/api/ordenes', ordenRoutes);
app.use('/api/proveedores', proveedorRoutes);
app.use('/api/dashboard', dashboardRoutes);


// Ruta de salud
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'API funcionando correctamente',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Manejador de rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Ruta no encontrada',
    message: `No se encontró la ruta ${req.originalUrl}`
  });
});

// Manejador de errores global
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Error interno del servidor',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📚 Documentación: http://localhost:${PORT}/api/health`);
});

module.exports = app;