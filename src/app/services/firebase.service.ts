import { Injectable, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Usuario } from 'src/app/interfaces/iusuario';
import { IAuto } from '../interfaces/iauto';
import { doc, deleteDoc } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';  // Importar 'map' de RxJS
import { Observable } from 'rxjs';
import { NavController, AlertController } from '@ionic/angular';



@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  afs: any;

  constructor(
    private navCtrl: NavController,
    private alertController: AlertController,
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore
  ) { }
  get currentUser() {
    return this.afAuth.currentUser;
  }

  // Registro de usuario
  async registerUser(username: string, password: string, email: string): Promise<any> {
    try {
      // Crear usuario en Firebase Authentication
      const userCredential = await this.afAuth.createUserWithEmailAndPassword(email, password);
      console.log('Usuario creado: ', userCredential);

      // Preparar los datos del usuario para Firestore
      const userData: Usuario = {
        username,
        password,  // Recuerda que no es recomendable guardar contraseñas, es solo para demostración
        nombre: '', // Campo vacío para llenar más tarde
        apellido: '',
        correo: email // Guardamos el correo
      };

      // Guardar los datos del usuario en Firestore usando el UID de Firebase Authentication
      await this.saveUserData(userCredential.user?.uid, userData);
      return userCredential;
    } catch (error) {
      console.error('Error al registrar el usuario:', error);
      throw error;
    }
  }


  async saveUserData(uid: string, userData: Usuario): Promise<void> {
    try {
      // Usamos el UID del usuario como ID del documento en Firestore




      await this.firestore.collection('users').doc(uid).set(userData);
      console.log('Usuario guardado en Firestore');
    } catch (error) {
      console.error('Error al guardar en Firestore: ', error);
      throw error;
    }
  }


  // Login de usuario
  async loginUser(correo: string, password: string): Promise<any> {
    try {
      const userCredential = await this.afAuth.signInWithEmailAndPassword(correo, password);
      return userCredential;
    } catch (error) {
      console.error('Error en el login: ', error);
      throw new Error('Error en el login: ' + error.message);
    }
  }

  // Obtener los datos del usuario desde Firestore
  async getUserData(uid: string): Promise<Usuario | null> {
    try {
      const userRef = this.firestore.collection('users').doc(uid);
      const userDoc = await userRef.get().toPromise();
      if (userDoc.exists) {
        return userDoc.data() as Usuario;
      } else {
        console.log('No se encontraron datos del usuario.');
        return null;
      }
    } catch (error) {
      console.error('Error al obtener los datos del usuario:', error);
      return null;
    }
  }
  // Función para guardar un auto en Firestore con el UID del usuario
  async saveCarData(uid: string, car: IAuto): Promise<void> {
    try {
      // Validar si los campos obligatorios están presentes
      if (!car.brand || !car.model || !car.year || !car.color || !car.plate) {
        throw new Error('Faltan campos obligatorios');
      }
  
      // Guardar el auto en la colección 'autos' y obtener la referencia del documento creado
      const carRef = await this.firestore.collection('autos').add({
        ...car,
        userId: uid,  // Asociamos el auto al usuario logueado mediante su UID
      });
  
      console.log('Auto guardado en Firestore con ID:', carRef.id);  // El ID generado automáticamente por Firebase
    } catch (error) {
      console.error('Error al guardar el auto en Firestore:', error);
      throw error;
    }
  }
  
  
  

  async getCarsForUser(uid: string): Promise<IAuto[]> {
    try {
      const snapshot = await this.firestore.collection('autos', ref => ref.where('userId', '==', uid)).get().toPromise();
      const cars = snapshot.docs.map(doc => {
        const data = doc.data() as IAuto;
        data.id = doc.id; // Agregar el ID del documento
        return data;
      });
      return cars; // Devuelve los autos del usuario
    } catch (error) {
      console.error('Error al obtener los autos del usuario:', error);
      throw error;
    }
  }

  async deleteCar(carId: string): Promise<void> {
    await this.firestore.collection('autos').doc(carId).delete();
  }
  addCar(car: IAuto) {
    return this.firestore.collection('autos').add(car);
  }
  saveSelectedCar(car: IAuto) {
    // Asumo que quieres guardar el auto en una colección 'selectedCars' o similar
    return this.firestore.collection('selectedCars').add({
      brand: car.brand,
      model: car.model,
      color: car.color,
      plate: car.plate,
      // Otros campos que desees almacenar...
    });
  }
  async saveTransportData(userId: string, plate: string, transportData: any) {
    try {
      // Crear el documento de transporte sin especificar un ID, lo cual genera un ID automáticamente
      const transportRef = await this.firestore.collection('transports').add({
        userId,
        plate,
        ...transportData,
        createdAt: new Date().toISOString(),
      });
  
      console.log('Transporte guardado con éxito con ID:', transportRef.id);
      return transportRef.id; // Devuelve el ID del transporte recién creado
    } catch (error) {
      console.error('Error al guardar el transporte en Firestore:', error);
      throw error;
    }
  }
  
  
  
  
  // FirebaseService
  async getUserTransports(uid: string): Promise<any[]> {
    try {
      console.log('Transporte guardado con éxito con ID:', uid);
      const querySnapshot = await this.firestore.collection('transports', ref => ref.where('userId', '==', uid)).get().toPromise();
      return querySnapshot.docs.map(doc => {
        const data = doc.data() as { [key: string]: any };
        return { id: doc.id, ...data };
      });
    } catch (error) {
      console.error('Error al obtener los viajes:', error);
      throw error;
    }
  }
  
  getAllRides() {
    return this.firestore.collection('transports').snapshotChanges().pipe(
      map(changes => 
        changes.map(doc => {
          const data = doc.payload.doc.data();
          const id = doc.payload.doc.id;
  
          if (data && typeof data === 'object') {
            return { id, ...data };  // Solo hace el spread si data es un objeto
          }
          return { id, data }; // Si no es un objeto, solo retorna el ID y los datos crudos
        })
      )
    );
  }
  
  
  
  async getConductorNameById(uid: string): Promise<{ nombre: string, apellido: string } | null> {
    try {
      const userData = await this.getUserData(uid); // Obtener los datos del usuario por su UID
      if (userData) {
        // Suponiendo que los datos contienen las propiedades 'nombre' y 'apellido'
        return {
          nombre: userData.nombre,  // Retornar el nombre del conductor
          apellido: userData.apellido || '',  // Retornar el apellido del conductor (si no existe, retornar cadena vacía)
        };
      } else {
        return null; // Si no se encuentran datos, retornar null
      }
    } catch (error) {
      console.error('Error al obtener el nombre y apellido del conductor:', error);
      return null; // Retornar null en caso de error
    }
  }
  
  // En FirebaseService

  getSelectedCarByPlate(plate: string) {
    return this.firestore.collection('selectedCars', ref => ref.where('plate', '==', plate)).valueChanges() as Observable<IAuto[]>;
  }
  
  

  async updateTransportStatus(transportId: string, statusData: any) {
    try {
      await this.firestore.collection('transports').doc(transportId).update(statusData);
      console.log('Estado del transporte actualizado con éxito');
    } catch (error) {
      console.error('Error al actualizar el estado del transporte', error);
      throw error;
    }
  }
  
  
  async updateTransportSeatsAndPassengers(transportId: string, newSeats: number, pasajeroIDs: string[]) {
    try {
      // Obtener el usuario logueado
      const currentUser = await this.afAuth.currentUser;
      if (!currentUser) {
        throw new Error('No hay un usuario logueado');
      }
  
      console.log('ID del transporte:', transportId);
      const transportRef = this.firestore.collection('transports').doc(transportId);
      const doc = await transportRef.get().toPromise();
  
      if (!doc.exists) {
        throw new Error('El documento del transporte no existe');
      }
  
      // Verificar si el usuario ya está en la lista de pasajeros
      if (pasajeroIDs.includes(currentUser.uid)) {
        // Mostrar una alerta si el usuario ya ha solicitado este viaje
        const alert = await this.alertController.create({
          header: 'Viaje ya solicitado',
          message: 'Ya has solicitado este viaje previamente. No puedes reservarlo nuevamente.',
          buttons: ['OK'],
        });
        await alert.present();
        throw new Error('Este pasajero ya ha solicitado este viaje');
      }
  
      // Agregar el ID del usuario logueado a la lista de pasajeros
      pasajeroIDs.push(currentUser.uid);
  
      // Actualizar los asientos y la lista de pasajeros
      await transportRef.update({
        seats: newSeats,
        pasajeroIDs: pasajeroIDs,  // Actualiza la lista de pasajeros con el nuevo ID
      });
  
      console.log('Asientos y pasajeros del transporte actualizados correctamente');
    } catch (error) {
      console.error('Error al actualizar los asientos y los pasajeros del transporte:', error);
      // Mostrar alerta de error
      

      throw error;
    }
  }
  
  
  getActiveTripForUser(userId: string): Promise<any> {
    return this.firestore
      .collection('transports', ref => ref.where('userId', '==', userId).where('status', '==', 'active'))
      .get()
      .toPromise()
      .then(querySnapshot => {
        return querySnapshot.empty ? null : querySnapshot.docs[0].data(); // Retorna el primer viaje activo
      });
  }
  
  



async getPassengerTransports(uid: string): Promise<any[]> {
  try {
    console.log('Buscando transportes para el pasajero con UID:', uid);
    
    // Consultamos los transportes donde el UID del pasajero está en la lista 'pasajeroIDs'
    const querySnapshot = await this.firestore.collection('transports', ref => ref.where('pasajeroIDs', 'array-contains', uid)).get().toPromise();
    
    // Mapeamos los documentos de la consulta
    const transports = querySnapshot.docs.map(doc => {
      const data = doc.data() as { [key: string]: any };
      return { id: doc.id, ...data };
    });

    console.log('Viajes encontrados:', transports);
    return transports;  // Retorna los viajes que tienen al pasajero en la lista
  } catch (error) {
    console.error('Error al obtener los viajes del pasajero:', error);
    throw error;
  }
}
  

  

  

  // FirebaseService

}