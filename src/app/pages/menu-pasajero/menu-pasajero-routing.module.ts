import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MenuPasajeroPage } from './menu-pasajero.page';

const routes: Routes = [
  {
    path: '',
    component: MenuPasajeroPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MenuPasajeroPageRoutingModule {}
