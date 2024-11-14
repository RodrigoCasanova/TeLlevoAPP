import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FirebaseApp, initializeApp } from 'firebase/app';
import { Firestore, getFirestore, doc, getDoc } from 'firebase/firestore'; // Cambié las importaciones a Firebase v9

import { environment } from 'src/environments/environment'; // Asegúrate de que esto se importe correctamente

import { LocalNotifications } from '@capacitor/local-notifications';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  showProfileMenu = false; // Controla la visibilidad del menú de perfil
  activeRide: any = null; // Ajusta el tipo según tu estructura de datos
  currentUser: any = null; // Inicializa como null
  firestore: Firestore; // Define la variable firestore para inyectarla
  firebaseApp: FirebaseApp; // FirebaseApp

  constructor(
    private navCtrl: NavController,
    private afAuth: AngularFireAuth
  ) {
    // Inicializa Firebase con la configuración de environment.ts
    this.firebaseApp = initializeApp(environment.firebaseConfig);
    // Inicializa Firestore con la instancia de FirebaseApp
    this.firestore = getFirestore(this.firebaseApp);
  }

  ngOnInit() {
    // Obtener el usuario logueado desde Firebase
    this.afAuth.authState.subscribe(async user => {
      if (user) {
        // Si el usuario está logueado, obtenemos sus datos desde Firestore
        const userRef = doc(this.firestore, `users/${user.uid}`);
        try {
          const userDoc = await getDoc(userRef);
          if (userDoc.exists()) {
            this.currentUser = userDoc.data();
          } else {
            console.log('No se encontraron datos del usuario.');
          }
        } catch (error) {
          console.error('Error al obtener el documento:', error);
        }
      } else {
        console.log('Usuario no logueado');
      }
    });
  }

  // Mostrar u ocultar el menú de perfil
  toggleProfileMenu() {
    this.showProfileMenu = !this.showProfileMenu;
  }

  // Navegar a la página de perfil
  viewProfile() {
    this.navCtrl.navigateForward('/perfil');
    this.showProfileMenu = false; // Oculta el menú después de seleccionar la opción
  }

  // Lógica para cerrar sesión
  logout() {
    this.afAuth.signOut().then(() => {
      this.currentUser = null; // Limpia los datos del usuario
      this.navCtrl.navigateRoot('/login'); // Redirige al usuario a la página de inicio de sesión
    });
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
  

// Solicita permisos para enviar notificaciones
async requestPermission() {
  const permission = await LocalNotifications.requestPermissions();
  if (permission.display === 'granted') {
    console.log('Permiso de notificación concedido');
  } else {
    console.log('Permiso de notificación denegado');
  }
}
}
