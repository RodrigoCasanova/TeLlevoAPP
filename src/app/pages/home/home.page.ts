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
  currentUser: any = null; // Almacena los datos del usuario actual

  constructor(private navCtrl: NavController) { }

  ngOnInit() {
    this.checkLoginStatus();
  }

  checkLoginStatus() {
    this.isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (this.isLoggedIn) {
      this.currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    }
  }

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
  // Lógica para cerrar sesión
  logout() {
    localStorage.removeItem('isLoggedIn'); // Elimina el estado de inicio de sesión
    localStorage.removeItem('currentUser'); // Elimina los datos del usuario
    this.isLoggedIn = false; // Actualiza el estado
    this.currentUser = null; // Limpia los datos del usuario
    this.showProfileMenu = false; // Oculta el menú después de seleccionar la opción
    console.log('Sesión cerrada');
    this.navCtrl.navigateRoot('/login'); // Redirige al usuario a la página de inicio de sesión
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
