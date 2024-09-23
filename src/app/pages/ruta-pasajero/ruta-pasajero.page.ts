import { Component } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router'; // Importa Router para la navegación

@Component({
  selector: 'app-ruta-pasajero',
  templateUrl: './ruta-pasajero.page.html',
  styleUrls: ['./ruta-pasajero.page.scss'],
})
export class RutaPasajeroPage {
  ride = {
    driverLocation: 'Duoc UC Concepción',
    destination: 'Penco',
    uwu: 'Disponible',
    departureTime: '10:00',
    carPlate: 'ABC123', // Agregada la patente del auto
    carColor: 'Rojo',   // Agregado el color del auto
  };

  costPerKm = 250; // Costo por kilómetro
  distance = 6; // Distancia estimada en kilómetros
  totalCost = this.costPerKm * this.distance; // Cálculo del costo total

  constructor(private navCtrl: NavController, private alertController: AlertController, private router: Router) {}

  goBack() {
    this.navCtrl.back();
  }

  async shareLocation() {
    this.navCtrl.navigateForward('/home');
  }

  navigateToChat() {
    this.router.navigate(['/chat']); // Ajusta la ruta según tu configuración
  }
  
}
