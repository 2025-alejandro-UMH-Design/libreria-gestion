import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService, RegisterResponse } from '../../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  loading = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['empleado', Validators.required] // Valor por defecto
    });

    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }
  }

onSubmit(): void {
  console.log('Formulario enviado', this.registerForm.value);
  if (this.registerForm.invalid) {
    console.log('Formulario inválido', this.registerForm.errors);
    this.registerForm.markAllAsTouched();
    return;
  }

    this.loading = true;
    this.successMessage = '';
    this.errorMessage = '';

this.authService.register(this.registerForm.value).subscribe({
  next: (response) => {
    this.loading = false;
    this.successMessage = response.message || 'Usuario registrado correctamente';
    // Auto-login
    this.authService.login({
      email: this.registerForm.value.email,
      password: this.registerForm.value.password
    }).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: (err) => {
        // Si el auto-login falla, redirigir al login manual
        setTimeout(() => this.router.navigate(['/login']), 1500);
      }
    });
  },
  error: (error) => {
    this.loading = false;
    this.errorMessage = error.error?.message || 'No se pudo registrar el usuario';
  }
});
  }
}