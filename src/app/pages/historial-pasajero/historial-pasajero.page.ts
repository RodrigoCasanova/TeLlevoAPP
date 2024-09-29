import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-historial-pasajero',
  templateUrl: './historial-pasajero.page.html',
  styleUrls: ['./historial-pasajero.page.scss'],
})
export class HistorialPasajeroPage {
  constructor(private navCtrl: NavController) {} // Inyecta el NavController

  passengerRides = [
    {
      id: 1,
      driverName: 'Carlos',
      destination: 'Penco',
      departureTime: '2024-09-29T17:00:00',
      cost: 3000,
      drivers: [
        { name: 'Carlos', image: 'assets/img/carlos.jpeg' },
      ],
      showDrivers: false,
      date: new Date('2024-09-29')
    },
    {
      id: 2,
      driverName: 'Jose',
      destination: 'Penco',
      departureTime: '2024-09-28T18:30:00',
      cost: 1500,
      drivers: [
        { name: 'Jose', image: 'assets/img/paillan.jpeg' },
      ],
      showDrivers: false,
      date: new Date('2024-09-28')
    },
    // Agrega más viajes según sea necesario
  ];

  toggleDriverList(rideId: number) {
    const ride = this.passengerRides.find(r => r.id === rideId);
    if (ride) {
      ride.showDrivers = !ride.showDrivers; // Alterna la visibilidad de la lista de conductores
    }
  }

  goBack() {
    this.navCtrl.back(); // Navega a la página anterior
  }
}
