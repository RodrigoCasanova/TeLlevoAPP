import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { FirebaseService } from 'src/app/services/firebase.service';
import { Usuario } from 'src/app/interfaces/iusuario';

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
  };

  // Variable para controlar el spinner de carga
  isLoading = false;

  constructor(
    private firebaseService: FirebaseService,
    private toastController: ToastController,
    private alertController: AlertController,
    private router: Router
  ) { }
 // Variable para controlar el spinner de carga
  ngOnInit() {
    // Variable para controlar el spinner de carga
  }

  async presentToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 1500,
      position: 'top',
      color: color
    });
    await toast.present();
  }

  validateEmail(email: string): boolean {
    return email.endsWith('@duocuc.cl');
  }

  async registrar() {
    if (!this.validateEmail(this.usr.correo)) {
      this.presentToast('El correo debe pertenecer a duocuc.', 'danger');
      return;
    }

    if (this.usr.password.length < 6) {
      this.presentToast('La contraseña debe tener al menos 6 caracteres.', 'danger');
      return;
    }

    // Activar el spinner mientras se realiza el registro
    this.isLoading = true;

    try {
      // Llamamos al servicio Firebase para crear el usuario
      const userCredential = await this.firebaseService.registerUser(this.usr.username, this.usr.password, this.usr.correo);
      if (userCredential) {
        // Guardamos los datos adicionales en Firestore usando el uid del usuario
        const uid = userCredential.user?.uid;  // Obtener el uid del usuario
        if (uid) {
          await this.firebaseService.saveUserData(uid, this.usr); // Pasar el uid al guardar los datos

          // Guardar los datos del usuario en localStorage
          localStorage.setItem('usuario', JSON.stringify(this.usr));

          this.presentAlert();
        } else {
          throw new Error('No se pudo obtener el UID del usuario');
        }
      }
    } catch (error) {
      console.error('Error al registrar el usuario: ', error);
      this.presentToast('Hubo un error al registrar el usuario', 'danger');
    } finally {
      // Desactivar el spinner después de que el proceso se complete
      this.isLoading = false;
    }
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: '¡Registro exitoso!',
      message: 'Ahora puedes iniciar sesión en la aplicación.',
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
