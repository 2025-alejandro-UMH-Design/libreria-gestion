// backend/src/middlewares/rolesMiddleware.js
const rolesMiddleware = (allowedRoles) => {
    return (req, res, next) => {
        const usuario = req.usuario; // asumiendo que authMiddleware agrega req.usuario
        if (!usuario) {
            return res.status(401).json({ message: 'No autenticado' });
        }
        if (!allowedRoles.includes(usuario.rol)) {
            return res.status(403).json({ message: 'No tienes permisos para esta acción' });
        }
        next();
    };
};
module.exports = rolesMiddleware;