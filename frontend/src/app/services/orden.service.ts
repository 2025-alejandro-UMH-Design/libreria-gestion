import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Orden, EstadoOrden } from '../models/orden.model';
import { Producto } from '../models/producto.model';
import { Proveedor } from '../models/proveedor.model';

@Injectable({
  providedIn: 'root'
})
export class OrdenService {
  // Datos mock de productos y proveedores (para simular relaciones)
  private productosMock: Producto[] = [
    { id: 1, codigo: 'LIB001', nombre: 'Cien años de soledad', descripcion: '', precio: 350, stock_minimo: 5, stock_actual: 12, categoria: 'Novela' },
    { id: 2, codigo: 'TEC002', nombre: 'Aprende Angular', descripcion: '', precio: 450, stock_minimo: 3, stock_actual: 2, categoria: 'Tecnología' }
  ];

  private proveedoresMock: Proveedor[] = [
    { id: 1, nombre: 'Distribuidora Libros S.A.', contacto: 'Juan Pérez', telefono: '555-1234', email: 'ventas@distlibros.com', direccion: 'Av. Siempre Viva 123' },
    { id: 2, nombre: 'Editorial Conocimiento', contacto: 'María García', telefono: '555-5678', email: 'contacto@editorialcono.com', direccion: 'Calle Falsa 456' }
  ];

  private ordenes: Orden[] = [
    {
      id: 1,
      fecha: new Date('2025-03-01'),
      proveedor: this.proveedoresMock[0],
      estado: 'pendiente',
      total: 800,
      detalles: [
        { producto: this.productosMock[0], cantidad: 2, precio_unitario: 350 },
        { producto: this.productosMock[1], cantidad: 1, precio_unitario: 450 }
      ]
    },
    {
      id: 2,
      fecha: new Date('2025-03-05'),
      proveedor: this.proveedoresMock[1],
      estado: 'completada',
      total: 900,
      detalles: [
        { producto: this.productosMock[1], cantidad: 2, precio_unitario: 450 }
      ]
    }
  ];

  constructor() { }

  getOrdenes(): Observable<Orden[]> {
    return of(this.ordenes);
  }

  getOrden(id: number): Observable<Orden | undefined> {
    const orden = this.ordenes.find(o => o.id === id);
    return of(orden);
  }

  createOrden(orden: Orden): Observable<Orden> {
    const newId = this.ordenes.length + 1;
    const nueva = { ...orden, id: newId };
    this.ordenes.push(nueva);
    return of(nueva);
  }

  updateEstado(id: number, estado: EstadoOrden): Observable<Orden | null> {
    const orden = this.ordenes.find(o => o.id === id);
    if (orden) {
      orden.estado = estado;
      return of(orden);
    }
    return of(null);
  }

  // Métodos auxiliares para obtener productos y proveedores (simulados)
  getProductosMock(): Observable<Producto[]> {
    return of(this.productosMock);
  }

  getProveedoresMock(): Observable<Proveedor[]> {
    return of(this.proveedoresMock);
  }
}