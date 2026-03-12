import { Pool } from '../config/db';

export interface Producto {
    id?: number;
    codigo: string;
    nombre: string;
    descripcion: string;
    precio: number;
    stock_minimo: number;
    stock_actual: number;
    categoria: string;
    imagen_url?: string;
}

// Funciones básicas para el CRUD
export const getProductos = async () => {
    const pool = Pool();
    const result = await pool.query('SELECT * FROM productos');
    return result.rows;
};