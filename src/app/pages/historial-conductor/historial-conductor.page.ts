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
    this.afAuth.onAuthStateChanged((user) => {
      if (user) {
        this.loadViajes();
      } else {
        console.log('Usuario no autenticado. Redirigiendo al inicio de sesión.');
        this.navCtrl.navigateRoot('/login'); // Reemplaza '/login' con la ruta de tu página de inicio de sesión
      }
    });
  }
  

  // Función para cargar los viajes del usuario autenticado
  async loadViajes() {
    try {
      const user = await this.afAuth.currentUser;
      if (user) {
        const userTransports = await this.firebaseService.getUserTransports(user.uid); 
        console.log('Datos de viajes obtenidos:', userTransports); // Para verificar los datos
  
        // Mapeo de datos desde Firebase a los campos que queremos mostrar en la UI
        this.viajes = userTransports.map((viaje: any) => ({
          id: viaje.carId || 'ID no especificado',
          destino: viaje.location || 'Destino no especificado', // Usando "location" como el destino
          horaSalida: new Date(viaje.startDateTime).toLocaleString() || 'Hora no especificada',
          tarifa: viaje.cost ? `${viaje.cost} CLP` : 'Tarifa no especificada', // Usando "cost" para la tarifa
          pasajeros: viaje.seats || 'Asientos no especificados',
          detallesPasajeros: [] // Agrega pasajeros si tienes esta información en otro lugar
        }));
      } else {
        console.log('No se pudo obtener el usuario actual');
      }
    } catch (error) {
      console.error('Error al cargar los viajes:', error);
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
