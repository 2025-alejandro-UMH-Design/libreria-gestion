import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthApiService, User } from '../../../services/auth-api.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit {
  user: User | null = null;

  totalProductos = 120;
  totalProveedores = 18;
  totalOrdenes = 36;
  productosStockBajo = 7;

  constructor(
    private authService: AuthApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getUser();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}