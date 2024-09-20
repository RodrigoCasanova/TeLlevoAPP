import { Component, OnInit } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-viaje-pasajero',
  templateUrl: './viaje-pasajero.page.html',
  styleUrls: ['./viaje-pasajero.page.scss'],
})
export class ViajePasajeroPage  {
  ride = {
    driverName: 'Jose Paillan',
    currentLocation: 'DuocUC Concepción',
    destination: 'Penco',
    uwu: 'Disponible',
    departureTime: '13:00',
    estimatedArrival: '13:30',
  };

  constructor(
    private navCtrl: NavController,
    private alertController: AlertController
  ) {}


  goBack() {
    this.navCtrl.back();
  }

  async startTrip() {
    const alert = await this.alertController.create({
      header: 'Viaje Aceptado',
      message: 'Ubicación del Automovil compartida.',
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
