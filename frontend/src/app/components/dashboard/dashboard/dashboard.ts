import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService, Totales, ProductoStockBajo, UltimaOrden  } from '../../../services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {
  totales: Totales = { totalProductos: 0, totalProveedores: 0, totalOrdenes: 0 };
  stockBajo: ProductoStockBajo[] = [];
   ultimasOrdenes: UltimaOrden[] = [];
  loadingTotales = true;
  loadingStock = true;
loadingOrdenes = true;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.cargarTotales();
    this.cargarStockBajo();
    this.cargarUltimasOrdenes();

  }

  cargarTotales(): void {
    this.dashboardService.getTotales().subscribe({
      next: (data) => {
        this.totales = data;
        this.loadingTotales = false;
      },
      error: (err) => {
        console.error('Error al cargar totales', err);
        this.loadingTotales = false;
      }
    });
  }

  cargarStockBajo(): void {
    this.dashboardService.getStockBajo().subscribe({
      next: (data) => {
        this.stockBajo = data;
        this.loadingStock = false;
      },
      error: (err) => {
        console.error('Error al cargar stock bajo', err);
        this.loadingStock = false;
      }
    });
  }

  cargarUltimasOrdenes(): void {
  this.dashboardService.getUltimasOrdenes().subscribe({
    next: (data) => {
      this.ultimasOrdenes = data;
      this.loadingOrdenes = false;
    },
    error: (err) => {
      console.error('Error al cargar últimas órdenes', err);
      this.loadingOrdenes = false;
    }
  });
}
}