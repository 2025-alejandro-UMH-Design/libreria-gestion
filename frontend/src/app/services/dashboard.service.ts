import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Totales {
  totalProductos: number;
  totalProveedores: number;
  totalOrdenes: number;
}

export interface VentaEmpleado {
  id: number;
  nombre: string;
  email: string;
  total_ordenes: number;
  monto_total: number;
}

export interface ProductoStockBajo {
  id: number;
  codigo: string;
  nombre: string;
  stock_actual: number;
  stock_minimo: number;
  cantidad_faltante: number;
}

export interface UltimaOrden {
  id: number;
  fecha_orden: string;
  estado: string;
  total: number;
  proveedor: string; // o proveedor_nombre según tu backend
}

export interface OrdenPorMes {
  año: number;
  mes: number;
  total_ordenes: number;
  monto_total: number; // Asegúrate de que exista
}

export interface ProductoMasVendido {
  id: number;
  codigo: string;
  nombre: string;
  cantidad_vendida: number;
  monto_total: number;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = `${environment.apiUrl}/dashboard`;

  constructor(private http: HttpClient) { }

  getTotales(): Observable<Totales> {
    return this.http.get<Totales>(`${this.apiUrl}/totales`);
  }
getStockTotal(): Observable<ProductoStockBajo[]> {
  return this.http.get<ProductoStockBajo[]>(`${this.apiUrl}/stock-total`);
}
  getStockBajo(): Observable<ProductoStockBajo[]> {
    return this.http.get<ProductoStockBajo[]>(`${this.apiUrl}/stock-bajo`);
  }

  getUltimasOrdenes(): Observable<UltimaOrden[]> {
    return this.http.get<UltimaOrden[]>(`${this.apiUrl}/ultimas-ordenes`);
  }

  getVentasPorEmpleado(): Observable<VentaEmpleado[]> {
  return this.http.get<VentaEmpleado[]>(`${this.apiUrl}/ventas-por-empleado`);
}

  getOrdenesPorMes(fechaInicio?: string, fechaFin?: string): Observable<OrdenPorMes[]> {
  let url = `${this.apiUrl}/ordenes-por-mes`;
  if (fechaInicio && fechaFin) {
    url += `?fecha_inicio=${fechaInicio}&fecha_fin=${fechaFin}`;
  }
  return this.http.get<OrdenPorMes[]>(url);
}

getProductosMasVendidos(): Observable<ProductoMasVendido[]> {
  return this.http.get<ProductoMasVendido[]>(`${this.apiUrl}/productos-mas-vendidos`);
}
}