// src/app/services/orden.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Orden, EstadoOrden } from '../models/orden.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrdenService {
  private apiUrl = `${environment.apiUrl}/ordenes`;

  constructor(private http: HttpClient) { }

  getOrdenes(): Observable<Orden[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map(data => data.map(item => ({
        id: item.id,
        fecha: new Date(item.fecha_orden),
        proveedor: item.proveedor_nombre ? { id: item.proveedor_id, nombre: item.proveedor_nombre } : null,
        estado: item.estado,
        total: Number(item.total),
        detalles: [] // No se incluyen en el listado general
      })))
    );
  }

getOrden(id: number): Observable<Orden> {
  return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
    map(item => {
      // Construir proveedor
      let proveedor = null;
      if (item.proveedor) {
        proveedor = { id: item.proveedor.id, nombre: item.proveedor.nombre };
      } else if (item.proveedor_id) {
        proveedor = { id: item.proveedor_id, nombre: item.proveedor_nombre };
      }

      // Construir detalles
      const detalles = item.detalles ? item.detalles.map((d: any) => ({
        id: d.id,
        producto: {
          id: d.producto_id,
          nombre: d.producto_nombre || d.producto?.nombre,
          imagen_url: d.imagen_url || d.producto?.imagen_url
        },
        cantidad: Number(d.cantidad),
        precio_unitario: Number(d.precio_unitario)
      })) : [];

      return {
        id: item.id,
        fecha: new Date(item.fecha_orden),
        proveedor,
        estado: item.estado,
        total: Number(item.total),
        detalles
      };
    })
  );
}

  createOrden(orden: any): Observable<Orden> {
    return this.http.post<Orden>(this.apiUrl, orden);
  }

  cambiarEstado(id: number, estado: EstadoOrden): Observable<Orden> {
    // CORRECCIÓN: Usar this.http.patch, no this.ordenService...
    return this.http.patch<Orden>(`${this.apiUrl}/${id}/estado`, { estado });
  }

  deleteOrden(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}