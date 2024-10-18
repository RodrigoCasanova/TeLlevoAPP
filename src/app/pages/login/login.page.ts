import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Usuario } from 'src/app/interfaces/iusuario';
import { LocaldbService } from 'src/app/services/localdb.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  usr: Usuario = {
    username: '',
    password: '',
    nombre: '',
    apellido: '',
    correo: ''
  }

  constructor(private db: LocaldbService, private router: Router, private toastController: ToastController) { }

  ngOnInit() { }

  async presentToast(position: 'top' | 'middle' | 'bottom') {
    const toast = await this.toastController.create({
      message: 'El usuario o clave incorrecto',
      duration: 1500,
      position: position,
      color: 'danger',
      header: 'Error!',
      cssClass: 'textoast',
    });

    await toast.present();
  }

  logear() {
    let buscado = this.db.obtener(this.usr.username);

    buscado.then(datos => {
      console.log('Datos buscados:', datos); // Verifica los datos que se están buscando
      if (datos !== null) {
        if (datos.username === this.usr.username && datos.password === this.usr.password) {
          console.log('Inicio de sesión exitoso'); // Verifica si el inicio de sesión fue exitoso
          
          // Guardar el estado de inicio de sesión y los detalles del usuario en localStorage
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('currentUser', JSON.stringify(datos)); // Guarda todos los datos del usuario
          
          this.router.navigate(['/home']);
        } else {
          this.presentToast('top');
        }
      } else {
        this.presentToast('top');
      }
    });
  }
}
