import { Injectable, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Usuario } from 'src/app/interfaces/iusuario';
import { IAuto } from '../interfaces/iauto';
import { doc, deleteDoc } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';  // Importar 'map' de RxJS
import { Observable } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(
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
      const transportRef = this.firestore.collection('transports').doc();
      await transportRef.set({
        userId,
        plate,
        ...transportData,
        createdAt: new Date().toISOString(),
      });
  
      console.log('Transporte guardado con éxito');
    } catch (error) {
      console.error('Error al guardar el transporte en Firestore:', error);
      throw error;
    }
  }
  
  
  
  // FirebaseService
  async getUserTransports(uid: string): Promise<any[]> {
    try {
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
    return this.firestore.collection('transports').get().pipe(
      map(snapshot => snapshot.docs.map(doc => doc.data()))
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

  getSelectedCarByPlate(plate: string): Observable<any> {
    const cleanedPlate = String(plate).trim();
    console.log('Patente limpia:', cleanedPlate);
  
    if (!cleanedPlate) {
      console.error('La patente es inválida');
      return new Observable(); // Si la patente está vacía o inválida, devuelve un observable vacío
    }
  
    return this.firestore.collection('selectedCars', ref => ref.where('plate', '==', cleanedPlate)).valueChanges();
  }

  

  

  // FirebaseService

}