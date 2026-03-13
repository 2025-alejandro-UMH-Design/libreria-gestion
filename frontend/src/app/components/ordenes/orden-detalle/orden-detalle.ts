import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { OrdenService } from '../../../services/orden.service';
import { Orden } from '../../../models/orden.model';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-orden-detalle',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './orden-detalle.html',
  styleUrls: ['./orden-detalle.css']
})
export class OrdenDetalleComponent implements OnInit {
  @Input() ordenId?: number; // Para recibir el ID cuando se usa en modal
  orden?: Orden;

  constructor(
    private route: ActivatedRoute,
    private ordenService: OrdenService,
    public activeModal: NgbActiveModal, // Para controlar el modal
    private cdr: ChangeDetectorRef // inyectar

  ) { }

  ngOnInit(): void {
  console.log('Modal recibió ID:', this.ordenId);
  if (this.ordenId) {
    this.cargarOrden(this.ordenId);
  } else {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    console.log('ID desde ruta:', id);
    if (id) this.cargarOrden(id);
  }
}

cargarOrden(id: number): void {
  this.ordenService.getOrden(id).subscribe({
    next: (data) => {
      console.log('Datos recibidos:', data);
      this.orden = data;
      this.cdr.detectChanges(); // forzar actualización
    },
    error: (err) => console.error('Error al cargar orden:', err)
  });
}

  onImageError(event: Event): void {
  (event.target as HTMLImageElement).src = 'assets/no-image.png';
}

  getBadgeClass(estado: string): string {
    switch(estado) {
      case 'pendiente': return 'bg-warning';
      case 'completada': return 'bg-success';
      case 'cancelada': return 'bg-danger';
      default: return 'bg-secondary';
    }
  }
}