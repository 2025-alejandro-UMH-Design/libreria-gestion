import { Routes } from '@angular/router';
import { ProductoListComponent } from './components/productos/producto-lista/producto-lista';
import { ProductoFormComponent } from './components/productos/producto-form/producto-form';
import { OrdenListComponent } from './components/ordenes/orden-lista/orden-lista';
import { OrdenFormComponent } from './components/ordenes/orden-form/orden-form';
import { OrdenDetalleComponent } from './components/ordenes/orden-detalle/orden-detalle';
import { ProveedorListComponent } from './components/proveedores/proveedor-lista/proveedor-lista';
import { ProveedorFormComponent } from './components/proveedores/proveedor-form/proveedor-form';

export const routes: Routes = [
 { path: '', redirectTo: '/productos', pathMatch: 'full' }, // Redirige a productos
  { path: 'productos', component: ProductoListComponent },
  { path: 'productos/nuevo', component: ProductoFormComponent },
  { path: 'productos/editar/:id', component: ProductoFormComponent },
  { path: 'proveedores', component: ProveedorListComponent },
  { path: 'proveedores/nuevo', component: ProveedorFormComponent },
  { path: 'proveedores/editar/:id', component: ProveedorFormComponent },
  { path: 'ordenes', component: OrdenListComponent },
  { path: 'ordenes/nueva', component: OrdenFormComponent },
  { path: 'ordenes/:id', component: OrdenDetalleComponent },
];