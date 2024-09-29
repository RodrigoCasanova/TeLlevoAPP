import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MenuPasajeroPageRoutingModule } from './menu-pasajero-routing.module';

import { MenuPasajeroPage } from './menu-pasajero.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MenuPasajeroPageRoutingModule
  ],
  declarations: [MenuPasajeroPage]
})
export class MenuPasajeroPageModule {}
