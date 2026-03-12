import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms'; // <-- Importar FormsModule
import { OrdenService } from '../../../services/orden.service';
import { Orden, EstadoOrden } from '../../../models/orden.model';

@Component({
  selector: 'app-orden-lista',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule], // <-- Agregar FormsModule
  templateUrl: './orden-lista.html',
  styleUrls: ['./orden-lista.css']
})
export class OrdenListComponent implements OnInit {
  ordenes: Orden[] = [];
  filtroEstado: string = '';

  constructor(private ordenService: OrdenService) { }

  ngOnInit(): void {
    this.cargarOrdenes();
  }

  cargarOrdenes(): void {
    this.ordenService.getOrdenes().subscribe(data => {
      this.ordenes = data;
    });
  }

  get ordenesFiltradas(): Orden[] {
    if (!this.filtroEstado) return this.ordenes;
    return this.ordenes.filter(o => o.estado === this.filtroEstado);
  }

  cambiarEstado(id: number | undefined, nuevoEstado: EstadoOrden): void {
    if (!id) return;
    this.ordenService.cambiarEstado(id, nuevoEstado).subscribe(() => {
  this.cargarOrdenes();
});
  }

  getBadgeClass(estado: EstadoOrden): string {
    switch(estado) {
      case 'pendiente': return 'bg-warning';
      case 'completada': return 'bg-success';
      case 'cancelada': return 'bg-danger';
      default: return 'bg-secondary';
    }
  }
}