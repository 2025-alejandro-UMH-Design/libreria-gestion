import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { OrdenService } from '../../../services/orden.service';
import { ProveedorService } from '../../../services/proveedor.service';
import { ProductoService } from '../../../services/producto.service';
import { Proveedor } from '../../../models/proveedor.model';
import { Producto } from '../../../models/producto.model';

@Component({
  selector: 'app-orden-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './orden-form.html',
  styleUrls: ['./orden-form.css']
})
export class OrdenFormComponent implements OnInit {
  ordenForm: FormGroup;
  proveedores: Proveedor[] = [];
  productos: Producto[] = [];

  constructor(
    private fb: FormBuilder,
    private ordenService: OrdenService,
    private proveedorService: ProveedorService,
    private productoService: ProductoService,
    private router: Router
  ) {
    this.ordenForm = this.fb.group({
      proveedor_id: ['', Validators.required],
      fecha: [new Date().toISOString().substring(0,10), Validators.required],
      observaciones: [''],
      detalles: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.cargarProveedores();
    this.cargarProductos();
    this.agregarDetalle(); // Agregar una línea por defecto
  }

  cargarProveedores(): void {
this.proveedorService.getProveedores().subscribe((data: Proveedor[]) => this.proveedores = data);
  }

  cargarProductos(): void {
this.productoService.getProductos().subscribe((data: Producto[]) => this.productos = data);
  }

  get detallesArray(): FormArray {
    return this.ordenForm.get('detalles') as FormArray;
  }

  agregarDetalle(): void {
    const detalleForm = this.fb.group({
      producto_id: ['', Validators.required],
      cantidad: [1, [Validators.required, Validators.min(1)]],
      precio_unitario: [{ value: '', disabled: true }] // Se llena al seleccionar producto
    });
    this.detallesArray.push(detalleForm);
  }

  eliminarDetalle(index: number): void {
    this.detallesArray.removeAt(index);
  }

  onProductoChange(index: number): void {
    const productoId = this.detallesArray.at(index).get('producto_id')?.value;
    const producto = this.productos.find(p => p.id === Number(productoId));
    if (producto) {
      this.detallesArray.at(index).get('precio_unitario')?.setValue(producto.precio);
    }
  }

  calcularTotal(): number {
    let total = 0;
    for (let i = 0; i < this.detallesArray.length; i++) {
      const detalle = this.detallesArray.at(i);
      const cantidad = detalle.get('cantidad')?.value || 0;
      const productoId = detalle.get('producto_id')?.value;
      const producto = this.productos.find(p => p.id === Number(productoId));
      if (producto) {
        total += cantidad * producto.precio;
      }
    }
    return total;
  }

  onSubmit(): void {
    if (this.ordenForm.invalid) return;

    const formValue = this.ordenForm.value;
    const detalles = formValue.detalles.map((d: any) => {
      const producto = this.productos.find(p => p.id === Number(d.producto_id));
      return {
        producto_id: d.producto_id,
        cantidad: d.cantidad,
        precio_unitario: producto!.precio
      };
    });

    const ordenData = {
      proveedor_id: formValue.proveedor_id,
      fecha: formValue.fecha,
      observaciones: formValue.observaciones,
      detalles: detalles
    };

    this.ordenService.createOrden(ordenData).subscribe(() => {
      this.router.navigate(['/ordenes']);
    });
  }

  cancelar(): void {
    this.router.navigate(['/ordenes']);
  }
}