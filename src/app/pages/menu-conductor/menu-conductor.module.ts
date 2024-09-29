import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MenuConductorPageRoutingModule } from './menu-conductor-routing.module';

import { MenuConductorPage } from './menu-conductor.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MenuConductorPageRoutingModule
  ],
  declarations: [MenuConductorPage]
})
export class MenuConductorPageModule {}
