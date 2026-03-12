// src/models/Usuario.js
const db = require('../config/database');

class Usuario {
  // Crear nuevo usuario
  static async create({ nombre, email, password_hash, rol = 'empleado' }) {
    const query = `
      INSERT INTO usuarios (nombre, email, password_hash, rol)
      VALUES ($1, $2, $3, $4)
      RETURNING id, nombre, email, rol, created_at
    `;
    const values = [nombre, email, password_hash, rol];

    try {
      const result = await db.query(query, values);
      return result.rows[0];
    } catch (error) {
      if (error.code === '23505') { // Código de error por unique violation
        throw new Error('El email ya está registrado');
      }
      throw error;
    }
  }

  // Buscar usuario por email (para login)
  static async findByEmail(email) {
    const query = 'SELECT * FROM usuarios WHERE email = $1 AND activo = true';
    const result = await db.query(query, [email]);
    return result.rows[0];
  }

  // Buscar usuario por ID
  static async findById(id) {
    const query = `
      SELECT id, nombre, email, rol, created_at, last_login, activo
      FROM usuarios 
      WHERE id = $1 AND activo = true
    `;
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  // Actualizar último login
  static async updateLastLogin(id) {
    const query = 'UPDATE usuarios SET last_login = CURRENT_TIMESTAMP WHERE id = $1';
    await db.query(query, [id]);
  }

  // Listar todos los usuarios (solo admin)
  static async findAll(limit = 100, offset = 0) {
    const query = `
      SELECT id, nombre, email, rol, created_at, last_login, activo
      FROM usuarios
      ORDER BY created_at DESC
      LIMIT $1 OFFSET $2
    `;
    const result = await db.query(query, [limit, offset]);
    return result.rows;
  }

  // Actualizar usuario
  static async update(id, updates) {
    const allowedFields = ['nombre', 'email', 'rol', 'activo'];
    const fields = [];
    const values = [];
    let paramIndex = 1;

    Object.keys(updates).forEach(key => {
      if (allowedFields.includes(key)) {
        fields.push(`${key} = $${paramIndex}`);
        values.push(updates[key]);
        paramIndex++;
      }
    });

    if (fields.length === 0) return null;

    values.push(id);
    const query = `
      UPDATE usuarios 
      SET ${fields.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING id, nombre, email, rol, activo
    `;

    const result = await db.query(query, values);
    return result.rows[0];
  }

  // Cambiar contraseña
  static async changePassword(id, newPasswordHash) {
    const query = 'UPDATE usuarios SET password_hash = $1 WHERE id = $2';
    await db.query(query, [newPasswordHash, id]);
  }

  // Eliminar usuario (soft delete)
  static async delete(id) {
    const query = 'UPDATE usuarios SET activo = false WHERE id = $1 RETURNING id';
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  // Verificar si es admin
  static async isAdmin(userId) {
    const query = 'SELECT rol FROM usuarios WHERE id = $1';
    const result = await db.query(query, [userId]);
    return result.rows[0]?.rol === 'admin';
  }
}

module.exports = Usuario;