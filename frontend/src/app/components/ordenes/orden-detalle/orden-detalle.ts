import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { OrdenService } from '../../../services/orden.service';
import { Orden } from '../../../models/orden.model';

@Component({
  selector: 'app-orden-detalle',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './orden-detalle.html',
  styleUrls: ['./orden-detalle.css']
})
export class OrdenDetalleComponent implements OnInit {
  orden?: Orden;

  constructor(
    private route: ActivatedRoute,
    private ordenService: OrdenService
  ) { }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.ordenService.getOrden(id).subscribe(data => {
        this.orden = data;
      });
    }
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