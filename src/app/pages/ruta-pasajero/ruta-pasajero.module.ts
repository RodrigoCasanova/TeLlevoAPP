import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RutaPasajeroPageRoutingModule } from './ruta-pasajero-routing.module';

import { RutaPasajeroPage } from './ruta-pasajero.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RutaPasajeroPageRoutingModule
  ],
  declarations: [RutaPasajeroPage]
})
export class RutaPasajeroPageModule {}
