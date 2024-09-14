import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-transporte',
  templateUrl: './transporte.page.html',
  styleUrls: ['./transporte.page.scss'],
})
export class TransportePage {

  constructor(private navCtrl: NavController) {}

  searchTransport() {
    // Implementa la lógica para buscar transporte
    console.log('Buscando transporte...');
  }
  goBack() {
    this.navCtrl.back();
  }
}
