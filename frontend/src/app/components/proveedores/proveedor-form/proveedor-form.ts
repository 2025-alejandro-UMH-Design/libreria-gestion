import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProveedorService } from '../../../services/proveedor.service';
import { Proveedor } from '../../../models/proveedor.model';

@Component({
  selector: 'app-proveedor-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './proveedor-form.html',
  styleUrls: ['./proveedor-form.css']
})
export class ProveedorFormComponent implements OnInit {
  proveedorForm: FormGroup;
  isEdit = false;
  proveedorId?: number;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private proveedorService: ProveedorService
  ) {
    this.proveedorForm = this.fb.group({
      nombre: ['', Validators.required],
      contacto: [''],
      telefono: [''],
      email: ['', Validators.email],
      direccion: ['']
    });
  }

  ngOnInit(): void {
    this.proveedorId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.proveedorId) {
      this.isEdit = true;
      this.proveedorService.getProveedor(this.proveedorId).subscribe(proveedor => {
        if (proveedor) {
          this.proveedorForm.patchValue(proveedor);
        }
      });
    }
  }

  onSubmit(): void {
    if (this.proveedorForm.invalid) return;

    const proveedor: Proveedor = this.proveedorForm.value;
    if (this.isEdit && this.proveedorId) {
      this.proveedorService.updateProveedor(this.proveedorId, proveedor).subscribe(() => {
        this.router.navigate(['/proveedores']);
      });
    } else {
      this.proveedorService.createProveedor(proveedor).subscribe(() => {
        this.router.navigate(['/proveedores']);
      });
    }
  }

  cancelar(): void {
    this.router.navigate(['/proveedores']);
  }
}