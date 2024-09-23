import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router'; // Importa Router para la navegación
@Component({
  selector: 'app-ruta-conductor',
  templateUrl: './ruta-conductor.page.html',
  styleUrls: ['./ruta-conductor.page.scss'],
})
export class RutaConductorPage {
  ride = {
    destination: 'Penco',
  };

  pickupPoints = [
    { location: 'DuocUC Concepción', time: '18:00', image: 'assets/img/Luis.jpeg' },
    { location: 'DuocUC Concepción', time: '18:00', image: 'assets/img/paillan.jpeg' },
    { location: 'DuocUC Concepción', time: '18:00', image: 'assets/img/carlos.jpeg' },
  ];

  constructor(private navCtrl: NavController, private router: Router) {}

  goBack() {
    this.navCtrl.back();
  }

  goHome() {
    this.navCtrl.navigateRoot('/home');
  }
  navigateToChat() {
    this.router.navigate(['/chat']); // Ajusta la ruta según tu configuración
  }
}
