import { Component } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  activeRide: any = null; // Ajusta el tipo según tu estructura de datos

  constructor(
    private navCtrl: NavController,
    private alertController: AlertController
  ) {}

  openLogin() {
    this.navCtrl.navigateForward('/login');
  }

  openRegistro() {
    this.navCtrl.navigateForward('/registro');
  }

  registerAsDriver() {
    // Implementa la lógica para registrar al usuario como conductor
    this.navCtrl.navigateForward('/menu_auto');
  }

  findRide() {
    // Implementa la lógica para buscar transporte
    this.navCtrl.navigateForward('/transporte');
  }

  cancelRide() {
    // Implementa la lógica para cancelar el viaje
    console.log('Viaje cancelado');
  }

  async openViaje() {
    const alert = await this.alertController.create({
      header: 'Selecciona una opción',
      message: 'Elige si eres conductor o pasajero.',
      buttons: [
        {
          text: 'Conductor',
          handler: () => {
            this.navCtrl.navigateForward('/viaje-conductor'); // Navega a la página de conductor
          }
        },
        {
          text: 'Pasajero',
          handler: () => {
            this.navCtrl.navigateForward('/ruta-pasajero'); // Navega a la página de pasajero
          }
        },
        {
          text: 'Cancelar',
          role: 'cancel'
        }
      ]
    });

    await alert.present();
  }
}
