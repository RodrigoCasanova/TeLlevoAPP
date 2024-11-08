import { Component } from '@angular/core';
import { FirebaseService } from '../../services/firebase.service'; // Asegúrate de importar el servicio correctamente
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  usr = {
    email: '',      // Cambiado de username a email
    password: ''
  };

  constructor(
    private firebaseService: FirebaseService,
    private router: Router
  ) {}

  async logear() {
    try {
      // Usamos el servicio de Firebase para hacer login
      const userCredential = await this.firebaseService.loginUser(this.usr.email, this.usr.password); // Usamos email en vez de username
      console.log('Usuario logueado:', userCredential);

      // Guardar los datos de inicio de sesión en localStorage
      localStorage.setItem('usuario', JSON.stringify(this.usr));

      // Redirigimos al usuario después del login exitoso
      this.router.navigate(['/home']);
    } catch (error) {
      console.error('Error al iniciar sesión: ', error);
      alert('Error en el login: ' + error.message);
    }
  }
}
