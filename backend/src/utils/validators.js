// src/utils/validators.js
const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

const validatePassword = (password) => {
  return password && password.length >= 6;
};

const validateNombre = (nombre) => {
  return nombre && nombre.length >= 2 && nombre.length <= 100;
};

const validateRol = (rol) => {
  return rol && ['admin', 'empleado'].includes(rol);
};

module.exports = {
  validateEmail,
  validatePassword,
  validateNombre,
  validateRol
};