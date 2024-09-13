import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  // Variable para mantener el estado del viaje activo
  activeRide: any = null; // Ajusta el tipo según tu estructura de datos

  constructor(private navCtrl: NavController) {}

  // Método para abrir la página de inicio de sesión
  openLogin() {
    this.navCtrl.navigateForward('/login');
  }

  // Método para abrir la página de registro
  openRegister() {
    this.navCtrl.navigateForward('/register');
  }

  // Método para registrar al usuario como conductor
  registerAsDriver() {
    // Implementa la lógica para registrar al usuario como conductor
    console.log('Usuario registrado como conductor');
  }

  // Método para buscar transporte
  findRide() {
    // Implementa la lógica para buscar transporte
    console.log('Búsqueda de transporte');
  }

  // Método para cancelar el viaje
  cancelRide() {
    // Implementa la lógica para cancelar el viaje
    console.log('Viaje cancelado');
  }
  onClick(){
    
  }
}
