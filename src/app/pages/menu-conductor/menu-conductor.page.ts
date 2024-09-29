import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-menu-conductor',
  templateUrl: './menu-conductor.page.html',
  styleUrls: ['./menu-conductor.page.scss'],
})
export class MenuConductorPage {

  constructor(private navCtrl: NavController) {}

  addRide() {
    // Lógica para agregar un viaje
    this.navCtrl.navigateForward('/menu_auto'); // Asegúrate de tener la ruta configurada
  }

  viewRide() {
    // Lógica para ver el viaje actual
    this.navCtrl.navigateForward('/viaje-conductor'); // Asegúrate de tener la ruta configurada
  }

  viewRideHistory() {
    // Lógica para ver el historial de viajes
    this.navCtrl.navigateForward('/historial-conductor'); // Asegúrate de tener la ruta configurada
  }
  viewRideRute() {
    // Lógica para ver el historial de viajes
    this.navCtrl.navigateForward('/ruta-conductor'); // Asegúrate de tener la ruta configurada
  }
  goBack() {
    this.navCtrl.back();
  }
}
