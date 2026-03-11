import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { ProductoService } from '../../../services/producto.service';
import { Producto } from '../../../models/producto.model';

@Component({
  selector: 'app-producto-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,  // Para usar formGroup, formControl, etc.
    RouterModule          // Para routerLink y navegación
  ],
  templateUrl: './producto-form.html',
  styleUrls: ['./producto-form.css']
})
export class ProductoFormComponent implements OnInit {
  productoForm: FormGroup;
  isEdit = false;
  productoId?: number;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private productoService: ProductoService
  ) {
    this.productoForm = this.fb.group({
      codigo: ['', Validators.required],
      nombre: ['', Validators.required],
      descripcion: [''],
      precio: [0, [Validators.required, Validators.min(0)]],
      stock_minimo: [0, [Validators.required, Validators.min(0)]],
      stock_actual: [0, [Validators.required, Validators.min(0)]],
      categoria: [''],
      imagen_url: ['']
    });
  }

  ngOnInit(): void {
    this.productoId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.productoId) {
      this.isEdit = true;
      this.productoService.getProducto(this.productoId).subscribe(producto => {
        if (producto) {
          this.productoForm.patchValue(producto);
        }
      });
    }
  }

  onSubmit(): void {
    if (this.productoForm.invalid) return;

    const producto: Producto = this.productoForm.value;
    if (this.isEdit && this.productoId) {
      this.productoService.updateProducto(this.productoId, producto).subscribe(() => {
        this.router.navigate(['/productos']);
      });
    } else {
      this.productoService.createProducto(producto).subscribe(() => {
        this.router.navigate(['/productos']);
      });
    }
  }

  cancelar(): void {
    this.router.navigate(['/productos']);
  }
}
