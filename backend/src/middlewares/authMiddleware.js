// src/middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');

const authMiddleware = {
    // Verificar token JWT
    async verificarToken(req, res, next) {
        try {
            const authHeader = req.headers.authorization;
            
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return res.status(401).json({ 
                    error: 'Token no proporcionado',
                    details: 'El encabezado de autorización debe tener el formato: Bearer <token>' 
                });
            }

            const token = authHeader.split(' ')[1];

            // Verificar token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            // Verificar que el usuario aún existe en la BD
            const usuario = await Usuario.findById(decoded.id);
            if (!usuario) {
                return res.status(401).json({ 
                    error: 'Usuario no encontrado' 
                });
            }

            // Adjuntar usuario al request
            req.user = decoded;
            next();

        } catch (error) {
            if (error.name === 'JsonWebTokenError') {
                return res.status(401).json({ error: 'Token inválido' });
            }
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({ error: 'Token expirado' });
            }
            
            console.error('Error en autenticación:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    },

    // Verificar rol de administrador
    esAdmin(req, res, next) {
        if (req.user.rol !== 'admin') {
            return res.status(403).json({ 
                error: 'Acceso denegado. Se requieren permisos de administrador' 
            });
        }
        next();
    },

    // Verificar rol de empleado o admin
    esEmpleado(req, res, next) {
        if (req.user.rol !== 'empleado' && req.user.rol !== 'admin') {
            return res.status(403).json({ 
                error: 'Acceso denegado. Se requieren permisos de empleado' 
            });
        }
        next();
    },

    // Verificar que el usuario sea el propietario o admin
    esPropietarioOAmin(req, res, next) {
        const userId = req.params.id || req.body.userId;
        
        if (req.user.rol === 'admin' || req.user.id === userId) {
            return next();
        }
        
        return res.status(403).json({ 
            error: 'No tienes permiso para realizar esta acción' 
        });
    }
};

const verificarToken = (req, res, next) => {
    // Temporal: simular usuario autenticado con rol admin
    req.user = { id: 1, rol: 'admin' };
    next();
};

const esAdmin = (req, res, next) => {
    // Temporal: permitir siempre
    next();
};

module.exports = authMiddleware;