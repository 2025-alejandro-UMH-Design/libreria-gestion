import { Pool } from '../config/db';

export interface Proveedor {
    id?: number;
    nombre: string;
    contacto: string;
    telefono: string;
    email: string;
    direccion: string;
}

export const getProveedores = async () => {
    const pool = Pool();
    const result = await pool.query('SELECT * FROM proveedores');
    return result.rows;
};