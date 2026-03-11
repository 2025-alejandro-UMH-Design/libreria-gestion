import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal-imagen',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal-imagen.component.html',
  styleUrls: ['./modal-imagen.component.css']
})
export class ModalImagenComponent {
  @Input() imagenUrl: string = '';
  @Input() productoNombre: string = '';

  constructor(public activeModal: NgbActiveModal) {}
}