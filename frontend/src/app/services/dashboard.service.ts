import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Totales {
  totalProductos: number;
  totalProveedores: number;
  totalOrdenes: number;
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

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = `${environment.apiUrl}/dashboard`;

  constructor(private http: HttpClient) { }

  getTotales(): Observable<Totales> {
    return this.http.get<Totales>(`${this.apiUrl}/totales`);
  }

  getStockBajo(): Observable<ProductoStockBajo[]> {
    return this.http.get<ProductoStockBajo[]>(`${this.apiUrl}/stock-bajo`);
  }

  getUltimasOrdenes(): Observable<UltimaOrden[]> {
    return this.http.get<UltimaOrden[]>(`${this.apiUrl}/ultimas-ordenes`);
  }
}