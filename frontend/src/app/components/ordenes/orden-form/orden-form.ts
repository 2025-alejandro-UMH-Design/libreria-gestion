import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { OrdenService } from '../../../services/orden.service';
import { Producto } from '../../../models/producto.model';
import { Proveedor } from '../../../models/proveedor.model';
import { Orden } from '../../../models/orden.model';

@Component({
  selector: 'app-orden-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './orden-form.html',
  styleUrls: ['./orden-form.css']
})
export class OrdenFormComponent implements OnInit {
  ordenForm: FormGroup;
  productos: Producto[] = [];
  proveedores: Proveedor[] = [];

  constructor(
    private fb: FormBuilder,
    private ordenService: OrdenService,
    private router: Router
  ) {
    this.ordenForm = this.fb.group({
      proveedorId: ['', Validators.required],
      fecha: [new Date().toISOString().substring(0,10), Validators.required],
      detalles: this.fb.array([])
    });
  }

  ngOnInit(): void {
    // Cargar listas para selects
    this.ordenService.getProveedoresMock().subscribe(data => this.proveedores = data);
    this.ordenService.getProductosMock().subscribe(data => this.productos = data);
    this.agregarDetalle(); // Agregar una línea por defecto
  }

  get detallesArray(): FormArray {
    return this.ordenForm.get('detalles') as FormArray;
  }

  agregarDetalle(): void {
    const detalleForm = this.fb.group({
      productoId: ['', Validators.required],
      cantidad: [1, [Validators.required, Validators.min(1)]],
      precio_unitario: [{ value: '', disabled: true }] // Se llena al seleccionar producto
    });
    this.detallesArray.push(detalleForm);
  }

  eliminarDetalle(index: number): void {
    this.detallesArray.removeAt(index);
  }

  onProductoChange(index: number): void {
    const productoId = this.detallesArray.at(index).get('productoId')?.value;
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
      const productoId = detalle.get('productoId')?.value;
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
    const proveedor = this.proveedores.find(p => p.id === Number(formValue.proveedorId));
    if (!proveedor) return;

    const detalles = formValue.detalles.map((d: any) => {
      const producto = this.productos.find(p => p.id === Number(d.productoId));
      return {
        producto: producto!,
        cantidad: d.cantidad,
        precio_unitario: producto!.precio
      };
    });

    const nuevaOrden: Orden = {
      fecha: new Date(formValue.fecha),
      proveedor: proveedor,
      estado: 'pendiente',
      total: this.calcularTotal(),
      detalles: detalles
    };

    this.ordenService.createOrden(nuevaOrden).subscribe(() => {
      this.router.navigate(['/ordenes']);
    });
  }

  cancelar(): void {
    this.router.navigate(['/ordenes']);
  }
}