import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RutaConductorPage } from './ruta-conductor.page';

const routes: Routes = [
  {
    path: '',
    component: RutaConductorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RutaConductorPageRoutingModule {}
