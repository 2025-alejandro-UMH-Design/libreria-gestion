// backend/scripts/create-admin.js
const bcrypt = require('bcrypt');
const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function createAdmin() {
  console.log('🔧 Conectando a la base de datos...');
  
  const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  });

  try {
    // Probar conexión
    await pool.query('SELECT NOW()');
    console.log('✅ Conexión exitosa a PostgreSQL');

    const password = 'Admin123';
    const saltRounds = 10;
    
    console.log(`\n🔐 Generando hash para contraseña: ${password}`);
    const password_hash = await bcrypt.hash(password, saltRounds);
    console.log('🔑 Hash generado:', password_hash);

    // Verificar si el usuario ya existe
    const checkUser = await pool.query(
      'SELECT * FROM usuarios WHERE email = $1',
      ['admin@libreria.com']
    );

    if (checkUser.rows.length > 0) {
      console.log('\n⚠️  El usuario ya existe. Actualizando password...');
      
      // Actualizar usuario existente
      const updateQuery = `
        UPDATE usuarios 
        SET password_hash = $1, nombre = $2 
        WHERE email = $3 
        RETURNING id, nombre, email, rol
      `;
      
      const result = await pool.query(updateQuery, [
        password_hash,
        'Admin Principal',
        'admin@libreria.com'
      ]);
      
      console.log('✅ Usuario actualizado:', result.rows[0]);
    } else {
      console.log('\n📝 Creando nuevo usuario admin...');
      
      // Insertar nuevo usuario
      const insertQuery = `
        INSERT INTO usuarios (nombre, email, password_hash, rol) 
        VALUES ($1, $2, $3, $4)
        RETURNING id, nombre, email, rol
      `;

      const result = await pool.query(insertQuery, [
        'Admin Principal',
        'admin@libreria.com',
        password_hash,
        'admin'
      ]);

      console.log('✅ Admin creado:', result.rows[0]);
    }

    // Verificar que el login funciona
    const verifyUser = await pool.query(
      'SELECT * FROM usuarios WHERE email = $1',
      ['admin@libreria.com']
    );
    
    const verifyHash = verifyUser.rows[0].password_hash;
    const testPassword = await bcrypt.compare('Admin123', verifyHash);
    
    console.log(`\n🔐 Verificación de login:`);
    console.log(`   Email: admin@libreria.com`);
    console.log(`   Password: Admin123`);
    console.log(`   Resultado: ${testPassword ? '✅ Válido' : '❌ Inválido'}`);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await pool.end();
    console.log('\n👋 Conexión cerrada');
  }
}

createAdmin();