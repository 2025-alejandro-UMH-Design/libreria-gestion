// src/app/models/orden.model.ts
import { Proveedor } from './proveedor.model';
import { DetalleOrden } from './detalle-orden.model';

export type EstadoOrden = 'pendiente' | 'completada' | 'cancelada';

export interface Orden {
  id?: number;
  fecha: Date;
  proveedor: Pick<Proveedor, 'id' | 'nombre'> | null; // Solo necesitamos id y nombre, y puede ser nulo
  estado: EstadoOrden;
  total: number;
  detalles: DetalleOrden[];
}