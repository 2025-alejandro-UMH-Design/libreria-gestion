import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProveedorService } from '../../../services/proveedor.service';
import { Proveedor } from '../../../models/proveedor.model';

@Component({
  selector: 'app-proveedor-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
templateUrl: './proveedor-lista.html',
  styleUrls: ['./proveedor-lista.css']
})
export class ProveedorListComponent implements OnInit {
  proveedores: Proveedor[] = [];

  constructor(private proveedorService: ProveedorService) { }

  ngOnInit(): void {
    this.cargarProveedores();
  }

  cargarProveedores(): void {
    this.proveedorService.getProveedores().subscribe(data => {
      this.proveedores = data;
    });
  }

  eliminarProveedor(id: number | undefined): void {
    if (id && confirm('¿Eliminar proveedor?')) {
      this.proveedorService.deleteProveedor(id).subscribe(() => {
        this.cargarProveedores();
      });
    }
  }
}