import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/compat/firestore'; // Firebase Firestore
import { AngularFireAuth } from '@angular/fire/compat/auth'; // Firebase Authentication
import { Observable } from 'rxjs';

@Component({
  selector: 'app-historial-pasajero',
  templateUrl: './historial-pasajero.page.html',
  styleUrls: ['./historial-pasajero.page.scss'],
})
export class HistorialPasajeroPage implements OnInit {
  currentPassengerId: string;  // Almacenará el ID del pasajero logueado
  passengerRides: any[] = [];  // Almacena los viajes como un array

  constructor(
    private navCtrl: NavController,
    private firestore: AngularFirestore,  // Servicio de Firestore
    private afAuth: AngularFireAuth  // Servicio de Firebase Authentication
  ) {}

  ngOnInit() {
    // Obtener el ID del pasajero logueado
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.currentPassengerId = user.uid;  // Almacenar el ID del usuario logueado
        console.log("ID del pasajero logueado:", this.currentPassengerId); // Verifica el ID del usuario logueado

        // Obtener los transportes del pasajero logueado desde Firebase
        this.getPassengerTransports(this.currentPassengerId).then(data => {
          console.log("Viajes encontrados:", data);
          this.passengerRides = data; // Asignamos los transportes obtenidos

          // Guardar los viajes en localStorage
          this.saveToLocalStorage(data);
        }).catch(error => {
          console.error("Error al obtener los viajes:", error);
        });
      } else {
        console.log('No hay usuario logueado');
      }
    });
  }

  // Función para obtener los transportes del pasajero
  async getPassengerTransports(uid: string): Promise<any[]> {
    try {
      console.log('Buscando transportes para el pasajero con UID:', uid);
  
      // Consultamos los transportes donde el UID del pasajero está en la lista 'pasajeroIDs'
      const querySnapshot = await this.firestore.collection('transports', ref => ref.where('pasajeroIDs', 'array-contains', uid)).get().toPromise();
  
      // Mapeamos los documentos de la consulta
      const transports = await Promise.all(querySnapshot.docs.map(async (doc) => {
        const data = doc.data() as { [key: string]: any };
  
        // Obtener el nombre del conductor usando el userId
        const driverName = await this.getConductorNameById(data["userId"]);
  
        // Asegúrese de convertir startDateTime a un objeto Date
        const departureTime = new Date(data["startDateTime"]);
  
        return {
          id: doc.id,
          driverName: driverName ? `${driverName.nombre} ${driverName.apellido}` : 'Desconocido', // Nombre del conductor
          destination: data["location"], // 'location' como destino
          departureTime: departureTime, // Utiliza el objeto Date directamente
          cost: data["cost"], // Tarifa
          drivers: [], // Lista vacía para los conductores
          showDrivers: false // Para controlar la visibilidad de la lista de conductores
        };
      }));
  
      console.log('Viajes encontrados:', transports);
      return transports;  // Retorna los viajes que tienen al pasajero en la lista
    } catch (error) {
      console.error('Error al obtener los viajes del pasajero:', error);
      throw error;
    }
  }
  

  // Obtener el nombre del conductor por su UID
  async getConductorNameById(uid: string): Promise<{ nombre: string, apellido: string } | null> {
    try {
      const userData = await this.getUserData(uid); // Obtener los datos del usuario por su UID
      if (userData) {
        // Retornar el nombre y apellido del conductor
        return {
          nombre: userData.nombre,
          apellido: userData.apellido || ''
        };
      } else {
        return null; // Si no se encuentran datos, retornar null
      }
    } catch (error) {
      console.error('Error al obtener el nombre y apellido del conductor:', error);
      return null;
    }
  }

  // Obtener los datos del usuario por su UID
  getUserData(uid: string): Promise<any> {
    return this.firestore.collection('users').doc(uid).get().toPromise().then(doc => doc.data());
  }

  // Alterna la visibilidad de la lista de conductores
  toggleDriverList(rideId: string) {
    const ride = this.passengerRides.find(r => r.id === rideId);
    if (ride) {
      ride.showDrivers = !ride.showDrivers; // Alterna la visibilidad de la lista de conductores
    }
  }

  // Función para guardar los viajes en localStorage
  saveToLocalStorage(data: any[]) {
    try {
      localStorage.setItem('passengerRides', JSON.stringify(data));
      console.log('Viajes guardados en localStorage:', data);
    } catch (error) {
      console.error('Error al guardar en localStorage:', error);
    }
  }

  // Función para volver a la página anterior
  goBack() {
    this.navCtrl.back(); // Navega a la página anterior
  }
}
