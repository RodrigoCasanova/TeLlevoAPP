import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RutaPasajeroPage } from './ruta-pasajero.page';

const routes: Routes = [
  {
    path: '',
    component: RutaPasajeroPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RutaPasajeroPageRoutingModule {}
