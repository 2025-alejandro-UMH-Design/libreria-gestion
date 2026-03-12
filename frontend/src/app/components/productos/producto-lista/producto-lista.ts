import { Component, OnInit } from '@angular/core';
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