import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importa CommonModule que incluye currency pipe y otras directivas comunes
import { RouterModule } from '@angular/router'; // Importa RouterModule para routerLink
import { ProductoService } from '../../../services/producto.service';
import { Producto } from '../../../models/producto.model';

@Component({
  selector: 'app-producto-lista',
  standalone: true, // Asumo que es standalone, si no lo es, hay que ajustar el módulo contenedor
  imports: [
    CommonModule,    // Proporciona el pipe 'currency' y directivas como ngIf, ngFor
    RouterModule     // Proporciona las directivas routerLink, routerLinkActive, etc.
  ],
  templateUrl: './producto-lista.html',
  styleUrls: ['./producto-lista.css']
})
export class ProductoListComponent implements OnInit {
  productos: Producto[] = [];

  constructor(private productoService: ProductoService) { }

  ngOnInit(): void {
    this.cargarProductos();
  }

  cargarProductos(): void {
    this.productoService.getProductos().subscribe(data => {
      this.productos = data;
    });
  }

  eliminarProducto(id: number | undefined): void {
    if (id && confirm('¿Eliminar producto?')) {
      this.productoService.deleteProducto(id).subscribe(() => {
        this.cargarProductos();
      });
    }
  }
}