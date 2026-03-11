import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductoService } from '../../../services/producto.service';
import { Producto } from '../../../models/producto.model';

@Component({
  selector: 'app-producto-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './producto-form.html',
  styleUrls: ['./producto-form.css']
})
export class ProductoFormComponent implements OnInit {
  productoForm: FormGroup;
  isEdit = false;
  productoId?: number;
  imagenPreview: string | ArrayBuffer | null = null;
  imagenFile: File | null = null;

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
      imagen_url: [''] // campo oculto para la URL existente
    });
  }

  ngOnInit(): void {
    this.productoId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.productoId) {
      this.isEdit = true;
      this.productoService.getProducto(this.productoId).subscribe(producto => {
        if (producto) {
          this.productoForm.patchValue(producto);
          if (producto.imagen_url) {
            this.imagenPreview = producto.imagen_url;
          }
        }
      });
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.imagenFile = file;
      // Vista previa
      const reader = new FileReader();
      reader.onload = () => {
        this.imagenPreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    if (this.productoForm.invalid) return;

    const formData = new FormData();
    formData.append('codigo', this.productoForm.get('codigo')?.value);
    formData.append('nombre', this.productoForm.get('nombre')?.value);
    formData.append('descripcion', this.productoForm.get('descripcion')?.value || '');
    formData.append('precio', this.productoForm.get('precio')?.value);
    formData.append('stock_minimo', this.productoForm.get('stock_minimo')?.value);
    formData.append('stock_actual', this.productoForm.get('stock_actual')?.value);
    formData.append('categoria', this.productoForm.get('categoria')?.value || '');
    if (this.imagenFile) {
      formData.append('imagen', this.imagenFile);
    }

    if (this.isEdit && this.productoId) {
      this.productoService.updateProducto(this.productoId, formData).subscribe(() => {
        this.router.navigate(['/productos']);
      });
    } else {
      this.productoService.createProducto(formData).subscribe(() => {
        this.router.navigate(['/productos']);
      });
    }
  }

  cancelar(): void {
    this.router.navigate(['/productos']);
  }
}