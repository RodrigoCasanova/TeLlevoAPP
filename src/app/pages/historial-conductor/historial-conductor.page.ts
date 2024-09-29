import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-historial-conductor',
  templateUrl: './historial-conductor.page.html',
  styleUrls: ['./historial-conductor.page.scss'],
})
export class HistorialConductorPage {
  viajes: any[] = [
    {
      id: 1,
      destino: 'Penco',
      horaSalida: '2024-09-25 18:00',
      tarifa: 1500,
      pasajeros: 3,
      detallesPasajeros: [
        { nombre: 'Matias', foto: 'assets/img/mati.jpeg' },
        { nombre: 'Jose', foto: 'assets/img/jose.jpeg' },
        { nombre: 'Luis', foto: 'assets/img/Luis.jpeg' },
      ],
    },
    {
      id: 2,
      destino: 'Penco',
      horaSalida: '2024-09-26 20:00',
      tarifa: 2000,
      pasajeros: 2,
      detallesPasajeros: [
        { nombre: 'Jose', foto: 'assets/img/jose.jpeg' },
        { nombre: 'Luis', foto: 'assets/img/Luis.jpeg' },
      ],
    },
  ];

  // Controlar la expansión de los pasajeros
  expandedIndices: Set<number> = new Set();

  togglePassengerDetails(index: number) {
    if (this.expandedIndices.has(index)) {
      this.expandedIndices.delete(index);
    } else {
      this.expandedIndices.add(index);
    }
  }

  constructor(private navCtrl: NavController) {}

  // Navegar de vuelta a la página anterior
  goBack() {
    this.navCtrl.back(); // O puedes usar navCtrl.navigateBack('/menu-conductor') si prefieres
  }
}
