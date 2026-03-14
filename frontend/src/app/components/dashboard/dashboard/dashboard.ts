import { Component, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core'; // Añadir ChangeDetectorRef
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DashboardService, Totales, ProductoStockBajo, VentaEmpleado, ProductoMasVendido, OrdenPorMes } from '../../../services/dashboard.service';
import Chart from 'chart.js/auto';
import * as XLSX from 'xlsx';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit, AfterViewInit {
  totales: Totales = { totalProductos: 0, totalProveedores: 0, totalOrdenes: 0 };
  stockTotal: ProductoStockBajo[] = [];
  ventasEmpleados: VentaEmpleado[] = [];          // Para la tabla de empleados
  productosMasVendidos: ProductoMasVendido[] = [];
  ordenesPorMes: OrdenPorMes[] = [];
  loading = true;
  loadingStock = true;
  loadingVentas = true;          // Nueva variable para controlar carga de ventas
  loadingProductos = true;
  
  fechaInicio: string = '';
  fechaFin: string = '';
  chart: Chart | null = null;


  
constructor(
  private dashboardService: DashboardService,
  private cdr: ChangeDetectorRef
) {}

  ngOnInit(): void {
    this.cargarTotales();
    this.cargarStockTotal();
    this.cargarVentasEmpleados();    // <-- Llamar al nuevo método
    this.cargarProductosMasVendidos();
    this.cargarOrdenesPorMes();
  }

  ngAfterViewInit(): void {
    // Si el gráfico no se creó en cargarOrdenesPorMes, lo creamos aquí (por si acaso)
    if (this.ordenesPorMes.length > 0 && !this.chart) {
      this.crearGrafico();
    }
  }
  
  cargarTotales(): void {
    this.dashboardService.getTotales().subscribe({
      next: (data) => {
        this.totales = data;
        this.cdr.detectChanges(); // Forzar actualización
      },
      error: (err) => console.error('Error en totales', err)
    });
  }

  cargarStockTotal(): void {
    this.dashboardService.getStockTotal().subscribe({
      next: (data) => {
        this.stockTotal = data;
        this.loadingStock = false;
        this.checkAllLoaded();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error en stock total', err);
        this.loadingStock = false;
        this.checkAllLoaded();
        this.cdr.detectChanges();
      }
    });
  }

cargarVentasEmpleados(): void {
  this.dashboardService.getVentasPorEmpleado().subscribe({
    next: (data) => {
      this.ventasEmpleados = data;
      this.loadingVentas = false;
    },
    error: (err) => {
      console.error('Error', err);
      this.loadingVentas = false;
    }
  });
}

  cargarProductosMasVendidos(): void {
    this.dashboardService.getProductosMasVendidos().subscribe({
      next: (data) => {
        this.productosMasVendidos = data;
        this.loadingProductos = false;
        this.checkAllLoaded();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error en productos más vendidos', err);
        this.loadingProductos = false;
        this.checkAllLoaded();
        this.cdr.detectChanges();
      }
    });
  }

  cargarOrdenesPorMes(fechaInicio?: string, fechaFin?: string): void {
    this.dashboardService.getOrdenesPorMes(fechaInicio, fechaFin).subscribe({
      next: (data) => {
        this.ordenesPorMes = data;
        this.crearGrafico();
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error en órdenes por mes', err)
    });
  }

  checkAllLoaded(): void {
    if (!this.loadingStock && !this.loadingVentas && !this.loadingProductos) {
      this.loading = false;
      this.cdr.detectChanges(); // Forzar detección cuando todas las cargas terminen
    }
  }

  crearGrafico(): void {
    const canvas = document.getElementById('ordenesChart') as HTMLCanvasElement;
    if (!canvas) return;

    if (this.chart) this.chart.destroy();

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const labels = this.ordenesPorMes.map(o => `${meses[o.mes - 1]} ${o.año}`);
    const datos = this.ordenesPorMes.map(o => o.total_ordenes);
    const montos = this.ordenesPorMes.map(o => o.monto_total);

    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Número de órdenes',
            data: datos,
            borderColor: 'rgb(75, 192, 192)',
            backgroundColor: 'rgba(75, 192, 192, 0.1)',
            tension: 0.1,
            fill: true,
            pointBackgroundColor: 'rgb(75, 192, 192)',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointRadius: 5,
            pointHoverRadius: 7,
            yAxisID: 'y',
          },
          {
            label: 'Monto total ($)',
            data: montos,
            borderColor: 'rgb(255, 159, 64)',
            backgroundColor: 'rgba(255, 159, 64, 0.1)',
            tension: 0.1,
            fill: true,
            pointBackgroundColor: 'rgb(255, 159, 64)',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6,
            yAxisID: 'y1',
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: { display: true, position: 'top', labels: { usePointStyle: true, boxWidth: 6 } },
          tooltip: { enabled: true, backgroundColor: 'rgba(0,0,0,0.8)', titleColor: '#fff', bodyColor: '#ddd', borderColor: '#ccc', borderWidth: 1 }
        },
        scales: {
          y: {
            type: 'linear',
            display: true,
            position: 'left',
            beginAtZero: true,
            ticks: { stepSize: 1 },
            title: { display: true, text: 'Órdenes' }
          },
          y1: {
            type: 'linear',
            display: true,
            position: 'right',
            beginAtZero: true,
            grid: { drawOnChartArea: false },
            ticks: { callback: (value) => '$' + value },
            title: { display: true, text: 'Monto ($)' }
          },
          x: {
            title: { display: true, text: 'Mes' },
            grid: { display: false }
          }
        }
      }
    });
  }

  aplicarFiltro(): void {
    if (!this.fechaInicio || !this.fechaFin) {
      alert('Selecciona ambas fechas');
      return;
    }
    this.cargarOrdenesPorMes(this.fechaInicio, this.fechaFin);
  }

  limpiarFiltro(): void {
    this.fechaInicio = '';
    this.fechaFin = '';
    this.cargarOrdenesPorMes();
  }

  getBadgeClass(estado: string): string {
    switch(estado) {
      case 'pendiente': return 'bg-warning';
      case 'completada': return 'bg-success';
      case 'cancelada': return 'bg-danger';
      default: return 'bg-secondary';
    }
  }

  exportarStockTotal(): void {
  if (!this.stockTotal || this.stockTotal.length === 0) {
    alert('No hay datos de stock para exportar.');
    return;
  }
  const datos = this.stockTotal.map(p => ({
    Código: p.codigo,
    Nombre: p.nombre,
    'Stock actual': p.stock_actual,
    'Stock mínimo': p.stock_minimo,
    Faltante: p.cantidad_faltante
  }));
  const ws = XLSX.utils.json_to_sheet(datos);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'StockTotal');
  XLSX.writeFile(wb, `stock_total_${new Date().toISOString().slice(0,10)}.xlsx`);
}

exportarProductosMasVendidos(): void {
  if (!this.productosMasVendidos || this.productosMasVendidos.length === 0) {
    alert('No hay datos de productos más vendidos para exportar.');
    return;
  }
  const datos = this.productosMasVendidos.map(p => ({
    Código: p.codigo,
    Nombre: p.nombre,
    'Cantidad vendida': p.cantidad_vendida,
    'Monto total': p.monto_total
  }));
  const ws = XLSX.utils.json_to_sheet(datos);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'ProductosMasVendidos');
  XLSX.writeFile(wb, `productos_mas_vendidos_${new Date().toISOString().slice(0,10)}.xlsx`);
}

exportarVentasEmpleado(): void {
  if (!this.ventasEmpleados || this.ventasEmpleados.length === 0) {
    alert('No hay datos de ventas por empleado para exportar.');
    return;
  }
  const datos = this.ventasEmpleados.map(v => ({
    Empleado: v.nombre,
    Email: v.email,
    'Órdenes realizadas': v.total_ordenes,
    'Monto total': v.monto_total
  }));
  const ws = XLSX.utils.json_to_sheet(datos);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'VentasEmpleado');
  XLSX.writeFile(wb, `ventas_empleado_${new Date().toISOString().slice(0,10)}.xlsx`);
}


}