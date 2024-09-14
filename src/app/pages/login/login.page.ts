import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {

  constructor(private navCtrl: NavController) {}

  login() {
    // Aquí puedes agregar la lógica de autenticación
    console.log('Iniciando sesión');
    // Navegar a la página principal o dashboard
    this.navCtrl.navigateForward('/home');
  }
  goBack() {
    this.navCtrl.back();
  }
}
