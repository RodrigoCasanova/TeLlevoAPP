import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HistorialConductorPageRoutingModule } from './historial-conductor-routing.module';

import { HistorialConductorPage } from './historial-conductor.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HistorialConductorPageRoutingModule
  ],
  declarations: [HistorialConductorPage]
})
export class HistorialConductorPageModule {}
