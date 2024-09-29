import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage {
  isLoggedIn = false; // Cambia a true cuando el usuario inicie sesión
  showProfileMenu = false; // Controla la visibilidad del menú de perfil
  activeRide: any = null; // Ajusta el tipo según tu estructura de datos

  constructor(private navCtrl: NavController) {}

  // Mostrar u ocultar el menú de perfil
  toggleProfileMenu() {
    this.showProfileMenu = !this.showProfileMenu;
  }

  // Navegar a la página de inicio de sesión
  openLogin() {
    this.navCtrl.navigateForward('/login');
    this.showProfileMenu = false; // Oculta el menú después de seleccionar la opción
  }

  // Navegar a la página de registro
  openRegistro() {
    this.navCtrl.navigateForward('/registro');
    this.showProfileMenu = false; // Oculta el menú después de seleccionar la opción
  }

  // Navegar a la página de perfil
  viewProfile() {
    this.navCtrl.navigateForward('/perfil');
    this.showProfileMenu = false; // Oculta el menú después de seleccionar la opción
  }

  // Lógica para cerrar sesión
  logout() {
    this.isLoggedIn = false; // Simulación de cierre de sesión
    this.showProfileMenu = false; // Oculta el menú después de seleccionar la opción
    console.log('Sesión cerrada');
    // Aquí puedes agregar la lógica real de cierre de sesión si es necesario
  }

  // Lógica para registrar como conductor
  registerAsDriver() {
    this.navCtrl.navigateForward('/menu-conductor');
  }

  // Lógica para buscar transporte
  findRide() {
    this.navCtrl.navigateForward('/menu-pasajero');
  }

  // Cancelar el viaje
  cancelRide() {
    console.log('Viaje cancelado');
  }

  // Navegar a la página del viaje
  openViaje() {
    this.navCtrl.navigateForward('/viaje');
  }
}
