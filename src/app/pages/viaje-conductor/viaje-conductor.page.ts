import { Component } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-viaje-conductor',
  templateUrl: './viaje-conductor.page.html',
  styleUrls: ['./viaje-conductor.page.scss'],
})
export class ViajeConductorPage {
  ride: any = {
    startLocation: 'Duoc UC Concepción',
    destination: 'Penco',
    departureTime: '18:30',
    costPerKm: 1500,
  };

  passengers: any[] = [
    {
      name: 'Luis Ilufin',
      image: 'assets/img/Luis.jpeg',
      location: 'Ubicación Luis',
      status: 'Pendiente de Confirmación',
    },
    {
      name: 'Jose Paillan',
      image: 'assets/img/paillan.jpeg',
      location: 'Ubicación Jose',
      status: 'Pendiente de Confirmación',
    },
    {
      name: 'Carlos Cartes',
      image: 'assets/img/carlos.jpeg',
      location: 'Ubicación Carlos',
      status: 'Pendiente de Confirmación',
    },
  ];

  constructor(
    private navCtrl: NavController,
    private alertController: AlertController
  ) {}

  goBack() {
    this.navCtrl.back();
  }

  confirmPassenger(passenger: any) {
    passenger.status = 'Confirmado';
  }

  rejectPassenger(passenger: any) {
    passenger.status = 'Cancelado';
  }

  canScheduleTrip(): boolean {
    // Check if every passenger's status is either "Confirmado" or "Cancelado"
    return this.passengers.every(passenger => passenger.status === 'Confirmado' || passenger.status === 'Cancelado');
  }

  async scheduleTrip() {
    const alert = await this.alertController.create({
      header: 'Confirmar Viaje',
      message: '¿Estás seguro de programar el viaje con los pasajeros confirmados?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Confirmar',
          handler: () => {
            // Navigate to the next page or handle scheduling logic
            this.navCtrl.navigateForward('/ruta-conductor'); // Cambia '/some-other-page' por la ruta deseada
          },
        },
      ],
    });

    await alert.present();
  }
}
