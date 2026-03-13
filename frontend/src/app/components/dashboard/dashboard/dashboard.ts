import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService, Totales, ProductoStockBajo } from '../../../services/dashboard.service'; // Ruta correcta

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

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.dashboardService.getTotales().subscribe((data: Totales) => {
      this.totales = data;
    });
    this.dashboardService.getStockBajo().subscribe((data: ProductoStockBajo[]) => {
      this.stockBajo = data;
    });
  }
}