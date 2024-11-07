import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { FirebaseService } from 'src/app/services/firebase.service'; // Asegúrate de que el servicio esté importado
import { AngularFireAuth } from '@angular/fire/compat/auth'; // Importamos el servicio de autenticación de Firebase

@Component({
  selector: 'app-historial-conductor',
  templateUrl: './historial-conductor.page.html',
  styleUrls: ['./historial-conductor.page.scss'],
})
export class HistorialConductorPage implements OnInit {
  viajes: any[] = []; // Array para almacenar los viajes del usuario
  expandedIndices: Set<number> = new Set(); // Para manejar la expansión de detalles de los pasajeros

  constructor(
    private navCtrl: NavController,
    private firebaseService: FirebaseService, // Servicio para interactuar con Firebase
    private afAuth: AngularFireAuth // Servicio para obtener el usuario autenticado
  ) {}

  ngOnInit() {
    this.loadViajes(); // Cargar los viajes cuando el componente se inicializa
  }

  // Función para cargar los viajes del usuario autenticado
  async loadViajes() {
    try {
      const user = await this.afAuth.currentUser; // Obtenemos el usuario logueado
      if (user) {
        // Llamamos al servicio Firebase para obtener los viajes del usuario logueado
        const userTransports = await this.firebaseService.getUserTransports(user.uid); 
        this.viajes = userTransports; // Asignamos los viajes a la variable viajes
      } else {
        console.log('No se pudo obtener el usuario actual');
      }
    } catch (error) {
      console.error('Error al cargar los viajes:', error); // Manejo de errores
    }
  }

  // Función para controlar la expansión de los detalles de los pasajeros
  togglePassengerDetails(index: number) {
    if (this.expandedIndices.has(index)) {
      this.expandedIndices.delete(index);
    } else {
      this.expandedIndices.add(index);
    }
  }

  // Función para navegar hacia atrás
  goBack() {
    this.navCtrl.back();
  }
}
