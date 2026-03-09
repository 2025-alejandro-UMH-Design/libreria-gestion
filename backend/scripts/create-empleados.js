// backend/scripts/create-empleados.js
const bcrypt = require('bcrypt');
const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function createEmpleados() {
  const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  });

  try {
    const empleados = [
      { nombre: 'Juan Pérez', email: 'juan@libreria.com', password: 'Empleado123' },
      { nombre: 'María García', email: 'maria@libreria.com', password: 'Maria2024' },
      { nombre: 'Carlos López', email: 'carlos@libreria.com', password: 'Carlos123' }
    ];

    for (const emp of empleados) {
      const password_hash = await bcrypt.hash(emp.password, 10);
      
      await pool.query(`
        INSERT INTO usuarios (nombre, email, password_hash, rol) 
        VALUES ($1, $2, $3, 'empleado')
        ON CONFLICT (email) DO UPDATE 
        SET password_hash = $3, nombre = $1
      `, [emp.nombre, emp.email, password_hash]);
      
      console.log(`✅ Empleado creado: ${emp.email} / ${emp.password}`);
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await pool.end();
  }
}

createEmpleados();