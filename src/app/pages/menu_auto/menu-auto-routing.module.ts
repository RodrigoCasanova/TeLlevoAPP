import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MenuAutoPage } from './menu-auto.page';

const routes: Routes = [
  {
    path: '',
    component: MenuAutoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MenuAutoPageRoutingModule {}
