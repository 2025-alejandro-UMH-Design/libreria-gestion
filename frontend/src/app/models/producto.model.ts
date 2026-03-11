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
  // Si el backend incluye proveedor_id o proveedor_nombre, agrégalos si es necesario
}