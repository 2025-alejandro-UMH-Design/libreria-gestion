import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Orden, EstadoOrden } from '../models/orden.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrdenService {
  private apiUrl = `${environment.apiUrl}/ordenes`;

  constructor(private http: HttpClient) { }

  getOrdenes(): Observable<Orden[]> {
    return this.http.get<Orden[]>(this.apiUrl);
  }

  getOrden(id: number): Observable<Orden> {
    return this.http.get<Orden>(`${this.apiUrl}/${id}`);
  }

  createOrden(orden: any): Observable<Orden> {
    return this.http.post<Orden>(this.apiUrl, orden);
  }

  cambiarEstado(id: number, estado: EstadoOrden): Observable<Orden> {
    return this.http.patch<Orden>(`${this.apiUrl}/${id}/estado`, { estado });
  }

  deleteOrden(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}