import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-ruta-conductor',
  templateUrl: './ruta-conductor.page.html',
  styleUrls: ['./ruta-conductor.page.scss'],
})
export class RutaConductorPage {
  ride = {
    destination: 'Penco',
  };

  pickupPoints = [
    { location: 'DuocUC Concepción', time: '13:15', image: 'assets/img/Luis.jpeg' },
    { location: 'DuocUC Concepción', time: '13:15', image: 'assets/img/paillan.jpeg' },
    { location: 'DuocUC Concepción', time: '13:15', image: 'assets/img/carlos.jpeg' },
  ];

  constructor(private navCtrl: NavController) {}

  goBack() {
    this.navCtrl.back();
  }

  goHome() {
    this.navCtrl.navigateRoot('/home');
  }
}
