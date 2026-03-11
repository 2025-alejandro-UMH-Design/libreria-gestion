import { Producto } from './producto.model';

export interface DetalleOrden {
  id?: number;
  producto: Producto;
  cantidad: number;
  precio_unitario: number;
}