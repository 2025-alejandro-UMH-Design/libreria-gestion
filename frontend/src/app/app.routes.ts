import { Routes } from '@angular/router';
import { ProductoListComponent } from './components/productos/producto-lista/producto-lista';
import { ProductoFormComponent } from './components/productos/producto-form/producto-form';
import { OrdenListComponent } from './components/ordenes/orden-lista/orden-lista';
import { OrdenFormComponent } from './components/ordenes/orden-form/orden-form';
import { OrdenDetalleComponent } from './components/ordenes/orden-detalle/orden-detalle';

export const routes: Routes = [
  { path: 'productos', component: ProductoListComponent },
  { path: 'productos/nuevo', component: ProductoFormComponent },
  { path: 'productos/editar/:id', component: ProductoFormComponent },
  { path: 'ordenes', component: OrdenListComponent },
  { path: 'ordenes/nueva', component: OrdenFormComponent },
  { path: 'ordenes/:id', component: OrdenDetalleComponent },
  // otras rutas...
];
