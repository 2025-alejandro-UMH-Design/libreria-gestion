// src/controllers/authController.js
const bcrypt = require('bcrypt');
const Usuario = require('../models/usuario');
const { generateToken } = require('../utils/generateToken');
const { validateEmail, validatePassword, validateNombre } = require('../utils/validators');

const authController = {
  // Registro de usuario (solo admin)
  async register(req, res) {
    try {
      const { nombre, email, password, rol } = req.body;

      // Validaciones
      if (!nombre || !email || !password) {
        return res.status(400).json({
          error: 'Todos los campos son requeridos',
          details: {
            nombre: !nombre ? 'Nombre requerido' : null,
            email: !email ? 'Email requerido' : null,
            password: !password ? 'Contraseña requerida' : null
          }
        });
      }

      if (!validateNombre(nombre)) {
        return res.status(400).json({
          error: 'El nombre debe tener entre 2 y 100 caracteres'
        });
      }

      if (!validateEmail(email)) {
        return res.status(400).json({
          error: 'Formato de email inválido'
        });
      }

      if (!validatePassword(password)) {
        return res.status(400).json({
          error: 'La contraseña debe tener al menos 6 caracteres'
        });
      }

      // Verificar si el usuario ya existe
      const existingUser = await Usuario.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({
          error: 'El email ya está registrado'
        });
      }

      // Hashear contraseña
      const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10;
      const salt = await bcrypt.genSalt(saltRounds);
      const password_hash = await bcrypt.hash(password, salt);

      // Crear usuario
      const newUser = await Usuario.create({
        nombre,
        email,
        password_hash,
        rol: rol || 'empleado'
      });

      res.status(201).json({
        message: 'Usuario creado exitosamente',
        usuario: newUser
      });

    } catch (error) {
      console.error('Error en registro:', error);
      res.status(500).json({
        error: 'Error interno del servidor',
        message: error.message
      });
    }
  },

  // Login
  async login(req, res) {
    try {
      const { email, password } = req.body;

      // Validaciones básicas
      if (!email || !password) {
        return res.status(400).json({
          error: 'Email y contraseña son requeridos'
        });
      }

      // Buscar usuario
      const usuario = await Usuario.findByEmail(email);
      if (!usuario) {
        return res.status(401).json({
          error: 'Credenciales inválidas'
        });
      }

      // Verificar contraseña
      const passwordValida = await bcrypt.compare(password, usuario.password_hash);
      if (!passwordValida) {
        return res.status(401).json({
          error: 'Credenciales inválidas'
        });
      }

      // Actualizar último login
      await Usuario.updateLastLogin(usuario.id);

      // Generar token
      const token = generateToken({
        id: usuario.id,
        email: usuario.email,
        rol: usuario.rol
      });

      // Respuesta (sin datos sensibles)
      res.json({
        message: 'Login exitoso',
        token,
        usuario: {
          id: usuario.id,
          nombre: usuario.nombre,
          email: usuario.email,
          rol: usuario.rol
        }
      });

    } catch (error) {
      console.error('Error en login:', error);
      res.status(500).json({
        error: 'Error interno del servidor'
      });
    }
  },

  // Verificar token
  async verifyToken(req, res) {
    try {
      const token = req.headers.authorization?.split(' ')[1];

      if (!token) {
        return res.status(401).json({ valid: false });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const usuario = await Usuario.findById(decoded.id);

      if (!usuario) {
        return res.status(401).json({ valid: false });
      }

      res.json({
        valid: true,
        usuario: {
          id: usuario.id,
          nombre: usuario.nombre,
          email: usuario.email,
          rol: usuario.rol
        }
      });

    } catch (error) {
      res.status(401).json({ valid: false });
    }
  },

  // Cambiar contraseña
  async changePassword(req, res) {
    try {
      const { currentPassword, newPassword } = req.body;
      const userId = req.user.id;

      // Validar nueva contraseña
      if (!validatePassword(newPassword)) {
        return res.status(400).json({
          error: 'La nueva contraseña debe tener al menos 6 caracteres'
        });
      }

      // Obtener usuario con contraseña actual
      const usuario = await Usuario.findByEmail(req.user.email);
      if (!usuario) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      // Verificar contraseña actual
      const passwordValida = await bcrypt.compare(currentPassword, usuario.password_hash);
      if (!passwordValida) {
        return res.status(401).json({ error: 'Contraseña actual incorrecta' });
      }

      // Hashear nueva contraseña
      const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10;
      const salt = await bcrypt.genSalt(saltRounds);
      const newPasswordHash = await bcrypt.hash(newPassword, salt);

      // Actualizar contraseña
      await Usuario.changePassword(userId, newPasswordHash);

      res.json({ message: 'Contraseña actualizada exitosamente' });

    } catch (error) {
      console.error('Error cambiando contraseña:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  // Obtener perfil del usuario autenticado
  async getProfile(req, res) {
    try {
      const usuario = await Usuario.findById(req.user.id);
      res.json(usuario);
    } catch (error) {
      console.error('Error obteniendo perfil:', error);
      res.status(500).json({ error: 'Error al obtener perfil' });
    }
  }
};

module.exports = authController;