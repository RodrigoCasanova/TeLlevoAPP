import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HistorialConductorPage } from './historial-conductor.page';

const routes: Routes = [
  {
    path: '',
    component: HistorialConductorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HistorialConductorPageRoutingModule {}
