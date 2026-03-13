import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductoService } from '../../../services/producto.service';
import { Producto } from '../../../models/producto.model';
import { environment } from '../../../../environments/environment';


@Component({
  selector: 'app-producto-lista',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './producto-lista.html',
  styleUrls: ['./producto-lista.css']
})
export class ProductoListComponent implements OnInit {
  productos: Producto[] = [];
  baseUrl = environment.baseUrl;

  constructor(
    private productoService: ProductoService,
    private cdr: ChangeDetectorRef  // Inyecta ChangeDetectorRef
  ) { }
  ngOnInit(): void {
    this.cargarProductos();
  }

  onImageError(event: Event): void {
  (event.target as HTMLImageElement).src = 'assets/no-image.png';
}

  cargarProductos(): void {
    this.productoService.getProductos().subscribe(data => {
      this.productos = data;
      this.cdr.detectChanges(); // Forzar actualización de la vista
    });
  }

// src/app/components/productos/producto-lista/producto-lista.ts
eliminarProducto(id: number | undefined): void {
  if (!id) return;
  if (confirm('¿Estás seguro de eliminar este producto?')) {
    this.productoService.deleteProducto(id).subscribe({
      next: () => {
        this.cargarProductos(); // recargar la lista
      },
      error: (err) => {
        console.error('Error al eliminar:', err);
        // Verificar si el error es por restricción de clave foránea
        if (err.status === 500 && err.error?.error?.includes('violates foreign key')) {
          alert('No se puede eliminar el producto porque tiene órdenes de compra asociadas.');
        } else {
          alert('Ocurrió un error al intentar eliminar el producto.');
        }
      }
    });
  }
}
}