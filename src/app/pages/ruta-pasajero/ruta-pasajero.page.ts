import { Component } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-ruta-pasajero',
  templateUrl: './ruta-pasajero.page.html',
  styleUrls: ['./ruta-pasajero.page.scss'],
})
export class RutaPasajeroPage {
  ride = {
    driverLocation: 'Concepción',
    destination: 'Duoc UC Concepción',
    departureTime: '10:00',
  };

  costPerKm = 250; // Costo por kilómetro
  distance = 6; // Distancia estimada en kilómetros
  totalCost = this.costPerKm * this.distance; // Cálculo del costo total

  constructor(private navCtrl: NavController, private alertController: AlertController) {}

  goBack() {
    this.navCtrl.back();
  }

  async shareLocation() {
  
            this.navCtrl.navigateForward('/home');
 }
   
}
