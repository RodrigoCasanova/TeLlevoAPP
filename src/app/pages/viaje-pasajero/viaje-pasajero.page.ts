import { Component, OnInit } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-viaje-pasajero',
  templateUrl: './viaje-pasajero.page.html',
  styleUrls: ['./viaje-pasajero.page.scss'],
})
export class ViajePasajeroPage implements OnInit {
  ride = {
    driverName: 'Jose Paillan',
    currentLocation: 'Concepción',
    destination: 'Duoc UC Concepción',
    departureTime: '10:00',
    estimatedArrival: '10:30',
  };

  constructor(
    private navCtrl: NavController,
    private alertController: AlertController
  ) {}

  ngOnInit() {}

  goBack() {
    this.navCtrl.back();
  }

  async startTrip() {
    const alert = await this.alertController.create({
      header: 'Ubicación Compartida',
      message: 'Tu ubicación ha sido compartida.',
      buttons: [
        {
          text: 'Volver al Home',
          handler: () => {
            this.navCtrl.navigateRoot('/home');
          }
        }
      ]
    });

    await alert.present();
  }
}
