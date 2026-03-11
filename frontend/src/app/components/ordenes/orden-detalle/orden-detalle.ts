import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { OrdenService } from '../../../services/orden.service';
import { Orden } from '../../../models/orden.model';
import { ModalImagenComponent } from '../../shared/modal-imagen/modal-imagen.component';

@Component({
  selector: 'app-orden-detalle',
  standalone: true,
  imports: [CommonModule, RouterModule, ModalImagenComponent],
  templateUrl: './orden-detalle.html',
  styleUrls: ['./orden-detalle.css']
})
export class OrdenDetalleComponent implements OnInit {
  orden?: Orden;

  constructor(
    private route: ActivatedRoute,
    private ordenService: OrdenService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.ordenService.getOrden(id).subscribe(data => {
        this.orden = data;
      });
    }
  }

  abrirModalImagen(producto: any): void {
    const modalRef = this.modalService.open(ModalImagenComponent);
    modalRef.componentInstance.imagenUrl = producto.imagen_url;
    modalRef.componentInstance.productoNombre = producto.nombre;
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