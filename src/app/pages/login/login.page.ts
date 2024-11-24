import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from '../../services/firebase.service'; // Servicio de Firebase
import { LocaldbService } from '../../services/localdb.service'; // Servicio de almacenamiento local

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  usr = {
    email: '',
    password: ''
  };

  constructor(
    private firebaseService: FirebaseService,
    private localdbService: LocaldbService,  // Servicio de LocalStorage
    private router: Router
  ) {}

  async logear() {
    // Verificamos si el dispositivo tiene conexión a internet
    if (navigator.onLine) {
      try {
        // Intentamos hacer el login con Firebase
        const userCredential = await this.firebaseService.loginUser(this.usr.email, this.usr.password);
        console.log('Usuario logueado:', userCredential);

        // Guardamos las credenciales en LocalStorage para uso offline
        await this.localdbService.guardar('usuario', this.usr);
        await this.localdbService.guardar('isLoggedIn', 'true');

        // Redirigimos al usuario
        this.router.navigate(['/home']);
      } catch (error) {
        console.error('Error al iniciar sesión: ', error);
        alert('Error en el login: ' + error.message);
      }
    } else {
      // Si no hay conexión a internet, intentamos acceder usando los datos guardados en LocalStorage
      const storedUser = await this.localdbService.obtener('usuario');
      const isLoggedIn = await this.localdbService.obtener('isLoggedIn') === 'true';

      // Verificamos si el usuario está guardado y si las credenciales coinciden
      if (isLoggedIn && storedUser && storedUser.email === this.usr.email && storedUser.password === this.usr.password) {
        alert('Acceso offline concedido');
        this.router.navigate(['/home']);
      } else {
        alert('No se pudo iniciar sesión sin conexión. Por favor, inicia sesión en línea al menos una vez.');
      }
    }
  }
}
