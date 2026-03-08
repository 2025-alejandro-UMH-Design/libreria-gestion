// src/middlewares/validationMiddleware.js
const { validateEmail: validateEmailFormat, validatePassword, validateNombre } = require('../utils/validators');

// Middleware para validar login
const validateLogin = (req, res, next) => {
  // Verificar que req.body existe
  if (!req.body) {
    return res.status(400).json({
      error: 'Error de validación',
      details: ['No se recibieron datos en el body']
    });
  }

  const { email, password } = req.body;
  const errors = [];

  // Validar email
  if (!email) {
    errors.push('Email es requerido');
  } else if (!validateEmailFormat(email)) {
    errors.push('Email inválido');
  }

  // Validar password
  if (!password) {
    errors.push('Contraseña es requerida');
  } else if (!validatePassword(password)) {
    errors.push('La contraseña debe tener al menos 6 caracteres');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      error: 'Error de validación',
      details: errors
    });
  }

  next();
};

// Middleware para validar registro
const validateRegister = (req, res, next) => {
  // Verificar que req.body existe
  if (!req.body) {
    return res.status(400).json({
      error: 'Error de validación',
      details: ['No se recibieron datos en el body']
    });
  }

  const { nombre, email, password, rol } = req.body;
  const errors = [];

  // Validar nombre
  if (!nombre) {
    errors.push('Nombre es requerido');
  } else if (!validateNombre(nombre)) {
    errors.push('El nombre debe tener entre 2 y 100 caracteres');
  }

  // Validar email
  if (!email) {
    errors.push('Email es requerido');
  } else if (!validateEmailFormat(email)) {
    errors.push('Email inválido');
  }

  // Validar password
  if (!password) {
    errors.push('Contraseña es requerida');
  } else if (!validatePassword(password)) {
    errors.push('La contraseña debe tener al menos 6 caracteres');
  }

  // Validar rol (si viene)
  if (rol && !['admin', 'empleado'].includes(rol)) {
    errors.push('Rol debe ser admin o empleado');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      error: 'Error de validación',
      details: errors
    });
  }

  next();
};

// Middleware para validar email (para otras rutas)
const validateEmail = (req, res, next) => {
  // Verificar que req.body existe
  if (!req.body) {
    return res.status(400).json({
      error: 'Error de validación',
      details: ['No se recibieron datos en el body']
    });
  }

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email es requerido' });
  }

  if (!validateEmailFormat(email)) {
    return res.status(400).json({ error: 'Email inválido' });
  }

  next();
};

module.exports = {
  validateLogin,
  validateRegister,
  validateEmail
};