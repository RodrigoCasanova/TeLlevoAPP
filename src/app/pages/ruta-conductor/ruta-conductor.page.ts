import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-ruta-conductor',
  templateUrl: './ruta-conductor.page.html',
  styleUrls: ['./ruta-conductor.page.scss'],
})
export class RutaConductorPage {
  ride = {
    destination: 'Duoc UC Concepción',
  };

  pickupPoints = [
    { location: 'Avenida O\'Higgins 1234', time: '18:15', image: 'assets/img/Luis.jpeg' },
    { location: 'Calle Prat 5678', time: '18:30', image: 'assets/img/paillan.jpeg' },
    { location: 'Calle Colón 9876', time: '18:45', image: 'assets/img/carlos.jpeg' },
  ];

  constructor(private navCtrl: NavController) {}

  goBack() {
    this.navCtrl.back();
  }
}
