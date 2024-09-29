import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HistorialPasajeroPageRoutingModule } from './historial-pasajero-routing.module';

import { HistorialPasajeroPage } from './historial-pasajero.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HistorialPasajeroPageRoutingModule
  ],
  declarations: [HistorialPasajeroPage]
})
export class HistorialPasajeroPageModule {}
