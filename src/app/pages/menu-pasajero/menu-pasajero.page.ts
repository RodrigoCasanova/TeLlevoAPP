import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-menu-pasajero',
  templateUrl: './menu-pasajero.page.html',
  styleUrls: ['./menu-pasajero.page.scss'],
})
export class MenuPasajeroPage {

  constructor(private navCtrl: NavController) {}

  scheduleRide() {
    // Lógica para agendar un viaje
    this.navCtrl.navigateForward('/transporte'); // Cambia la ruta según tu configuración
  }

  viewRide() {
    // Lógica para ver un viaje
    this.navCtrl.navigateForward('/ver-viaje'); // Cambia la ruta según tu configuración
  }

  viewRideHistory() {
    // Lógica para ver historial de viajes
    this.navCtrl.navigateForward('/historial-pasajero'); // Cambia la ruta según tu configuración
  }

  viewRideRute() {
    // Lógica para ver la ruta de un viaje
    this.navCtrl.navigateForward('/ruta-pasajero'); // Cambia la ruta según tu configuración
  }
  goBack() {
    this.navCtrl.navigateBack('/home');
  }
}
