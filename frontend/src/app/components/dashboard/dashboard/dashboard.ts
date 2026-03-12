import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { DashboardService } from '../../../services/dashboard.service';

interface ProductoStockBajo {
  codigo: string;
  nombre: string;
  stockActual: number;
  stockMinimo: number;
  categoria: string;
}

interface OrdenReciente {
  id: number;
  proveedor: string;
  fecha: string;
  estado: string;
  total: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit {

  adminName = 'Administrador';

  totalProductos = 0;
  totalProveedores = 0;
  totalOrdenes = 0;
  stockBajo = 0;
  usuariosActivos = 12;

  productosStockBajo: ProductoStockBajo[] = [];
  ordenesRecientes: OrdenReciente[] = [];

  porcentajeInventario = 82;
  porcentajeCompras = 68;
  porcentajeAbastecimiento = 74;

  cargandoResumen = false;
  cargandoStockBajo = false;
  cargandoOrdenes = false;

  constructor(
    private router: Router,
    private dashboardService: DashboardService
  ) {}

  ngOnInit(): void {
    this.cargarResumen();
    this.cargarStockBajo();
    this.cargarOrdenesRecientes();
  }

  cargarResumen(): void {
    this.cargandoResumen = true;

    this.dashboardService.getResumen().subscribe({
      next: (data: any) => {
        this.totalProductos = data.productos ?? 0;
        this.totalProveedores = data.proveedores ?? 0;
        this.totalOrdenes = data.ordenes ?? 0;
        this.stockBajo = data.stockBajo ?? 0;
        this.cargandoResumen = false;
      },
      error: (error: any) => {
        console.error('Error al cargar el resumen del dashboard:', error);
        this.cargandoResumen = false;
      }
    });
  }

  cargarStockBajo(): void {
    this.cargandoStockBajo = true;

    this.dashboardService.getStockBajo().subscribe({
      next: (data: ProductoStockBajo[]) => {
        this.productosStockBajo = data;
        this.cargandoStockBajo = false;
      },
      error: (error: any) => {
        console.error('Error al cargar productos con stock bajo:', error);
        this.cargandoStockBajo = false;
      }
    });
  }

  cargarOrdenesRecientes(): void {
    this.cargandoOrdenes = true;

    this.dashboardService.getOrdenesRecientes().subscribe({
      next: (data: OrdenReciente[]) => {
        this.ordenesRecientes = data;
        this.cargandoOrdenes = false;
      },
      error: (error: any) => {
        console.error('Error al cargar órdenes recientes:', error);
        this.cargandoOrdenes = false;
      }
    });
  }

  irAProductos(): void {
    this.router.navigate(['/productos']);
  }

  irAOrdenes(): void {
    this.router.navigate(['/ordenes']);
  }

  irANuevoProducto(): void {
    this.router.navigate(['/productos/nuevo']);
  }

  getEstadoClass(estado: string): string {
    switch (estado.toLowerCase()) {
      case 'completada':
        return 'badge-completada';
      case 'pendiente':
        return 'badge-pendiente';
      case 'cancelada':
        return 'badge-cancelada';
      default:
        return 'badge-default';
    }
  }
}