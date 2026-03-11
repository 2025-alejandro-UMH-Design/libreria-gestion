import { Proveedor } from './proveedor.model';
import { DetalleOrden } from './detalle-orden.model';

export type EstadoOrden = 'pendiente' | 'completada' | 'cancelada';

export interface Orden {
  id?: number;
  fecha: Date;
  proveedor: Proveedor;
  estado: EstadoOrden;
  total: number;
  detalles: DetalleOrden[];
}