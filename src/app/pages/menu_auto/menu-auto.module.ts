import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MenuAutoPageRoutingModule } from './menu-auto-routing.module';

import { MenuAutoPage } from './menu-auto.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MenuAutoPageRoutingModule
  ],
  declarations: [MenuAutoPage]
})
export class MenuAutoPageModule {}
