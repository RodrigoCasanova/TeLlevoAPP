import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MenuConductorPage } from './menu-conductor.page';

const routes: Routes = [
  {
    path: '',
    component: MenuConductorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MenuConductorPageRoutingModule {}
