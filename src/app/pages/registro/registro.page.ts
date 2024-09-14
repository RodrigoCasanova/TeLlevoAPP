import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-registro',  // Cambiado a 'registro'
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage {

  constructor(private navCtrl: NavController) {}

  register() {
    // Lógica de registro
    console.log('Registrando usuario');
    this.navCtrl.navigateForward('/home');
  }
  goBack() {
    this.navCtrl.back();
  }
}
