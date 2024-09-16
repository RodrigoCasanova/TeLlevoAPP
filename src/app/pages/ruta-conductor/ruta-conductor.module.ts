import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RutaConductorPageRoutingModule } from './ruta-conductor-routing.module';

import { RutaConductorPage } from './ruta-conductor.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RutaConductorPageRoutingModule
  ],
  declarations: [RutaConductorPage]
})
export class RutaConductorPageModule {}
