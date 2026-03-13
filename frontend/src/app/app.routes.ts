import { Routes } from '@angular/router';
import { ProductoListComponent } from './components/productos/producto-lista/producto-lista';
import { ProductoFormComponent } from './components/productos/producto-form/producto-form';
import { ProveedorListComponent } from './components/proveedores/proveedor-lista/proveedor-lista';
import { ProveedorFormComponent } from './components/proveedores/proveedor-form/proveedor-form';
import { OrdenListComponent } from './components/ordenes/orden-lista/orden-lista';
import { OrdenFormComponent } from './components/ordenes/orden-form/orden-form';
import { OrdenDetalleComponent } from './components/ordenes/orden-detalle/orden-detalle';
import { DashboardComponent } from './components/dashboard/dashboard/dashboard';
import { LoginComponent } from './components/auth/login/login';
import { RegisterComponent } from './components/auth/register/register';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegisterComponent },
  { path: '', redirectTo: '/productos', pathMatch: 'full' }, // o '/login' si prefieres
  { path: 'productos', component: ProductoListComponent, canActivate: [AuthGuard] },
  { path: 'productos/nuevo', component: ProductoFormComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: ['admin'] } },
  { path: 'productos/editar/:id', component: ProductoFormComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: ['admin'] } },
  { path: 'proveedores', component: ProveedorListComponent, canActivate: [AuthGuard] },
  { path: 'proveedores/nuevo', component: ProveedorFormComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: ['admin'] } },
  { path: 'proveedores/editar/:id', component: ProveedorFormComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: ['admin'] } },
  { path: 'ordenes', component: OrdenListComponent, canActivate: [AuthGuard] },
  { path: 'ordenes/nueva', component: OrdenFormComponent, canActivate: [AuthGuard] },
  { path: 'ordenes/:id', component: OrdenDetalleComponent, canActivate: [AuthGuard] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: ['admin'] } },
];