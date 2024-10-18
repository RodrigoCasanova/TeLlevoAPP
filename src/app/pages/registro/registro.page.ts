import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { Usuario } from 'src/app/interfaces/iusuario';
import { LocaldbService } from 'src/app/services/localdb.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {
  
  usr: Usuario = {
    username: '',
    password: '',
    nombre: '',
    apellido: '',
    correo: ''
  }

  constructor(private db: LocaldbService,
              private toastController: ToastController,
              private alertController: AlertController,
              private router: Router) { }

  ngOnInit() {}

  async presentToast(position: 'top' | 'middle' | 'bottom') {
    const toast = await this.toastController.create({
      message: 'El usuario ya existe',
      duration: 1500,
      position: position,
      color: 'danger',
      header: 'Error!',
      cssClass: 'textoast',
    });

    await toast.present();
  }

  validateEmail(email: string): boolean {
    return email.endsWith('@duocuc.cl') || email.endsWith('@duoc.cl');
  }

  registrar() {
    if (!this.validateEmail(this.usr.correo)) {
      this.presentToast('top'); // Puedes personalizar el mensaje
      return;
    }

    let buscado = this.db.obtener(this.usr.username);
    
    buscado.then(datos => {
      if (datos === null) {
        // Guardar el usuario en LocalStorage
        this.db.guardar(this.usr.username, this.usr);
        this.presentAlert();
      } else {
        // Mostrar toast si el usuario ya existe
        this.presentToast('top');
      }
    }).catch(error => {
      console.error('Error al buscar el usuario:', error);
      this.presentToast('top'); // O podrías mostrar un toast diferente
    });
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Usuario Registrado con Éxito!!!',
      subHeader: '',
      message: 'Ahora puedes utilizar la aplicación',
      buttons: [{
        text: 'Continuar',
        handler: () => {
          this.router.navigate(['/login']);
        }
      }]
    });

    await alert.present();
  }
}
