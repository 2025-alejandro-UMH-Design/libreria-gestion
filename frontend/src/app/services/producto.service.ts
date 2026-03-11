import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Producto } from '../models/producto.model';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  // Datos mock
  private productos: Producto[] = [
    {
      id: 1,
      codigo: 'LIB001',
      nombre: 'Cien años de soledad',
      descripcion: 'Novela de Gabriel García Márquez',
      precio: 350.00,
      stock_minimo: 5,
      stock_actual: 12,
      categoria: 'Novela',
      imagen_url: ''
    },
    {
      id: 2,
      codigo: 'TEC002',
      nombre: 'Aprende Angular',
      descripcion: 'Guía práctica de Angular',
      precio: 450.00,
      stock_minimo: 3,
      stock_actual: 2,
      categoria: 'Tecnología',
      imagen_url: ''
    }
  ];

  constructor() { }

  getProductos(): Observable<Producto[]> {
    return of(this.productos);
  }

  getProducto(id: number): Observable<Producto | undefined> {
    const producto = this.productos.find(p => p.id === id);
    return of(producto);
  }

  createProducto(producto: Producto): Observable<Producto> {
    const newId = this.productos.length + 1;
    const nuevo = { ...producto, id: newId };
    this.productos.push(nuevo);
    return of(nuevo);
  }

  updateProducto(id: number, producto: Producto): Observable<Producto | null> {
    const index = this.productos.findIndex(p => p.id === id);
    if (index !== -1) {
      this.productos[index] = { ...producto, id };
      return of(this.productos[index]);
    }
    return of(null);
  }

  deleteProducto(id: number): Observable<boolean> {
    const index = this.productos.findIndex(p => p.id === id);
    if (index !== -1) {
      this.productos.splice(index, 1);
      return of(true);
    }
    return of(false);
  }
}