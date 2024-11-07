import { Injectable, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Usuario } from 'src/app/interfaces/iusuario';
import { IAuto } from '../interfaces/iauto';
import { doc, deleteDoc } from '@angular/fire/firestore';


@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore
  ) { }

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
    // Usamos el UID del usuario como referencia en la colección 'autos'
    const carId = this.firestore.createId();  // Crea un ID único para el auto
    await this.firestore.collection('autos').doc(carId).set({
      ...car,
      userId: uid // Asociamos el auto al usuario logueado mediante su UID
    });
    console.log('Auto guardado en Firestore');
  } catch (error) {
    console.error('Error al guardar el auto en Firestore:', error);
    throw error;
  }
}
getCarsForUser() {
  return new Promise<IAuto[]>((resolve, reject) => {
    this.firestore.collection('autos').snapshotChanges().subscribe({
      next: (snapshot) => {
        const cars = snapshot.map((doc: any) => {
          const data = doc.payload.doc.data() as IAuto;
          data.id = doc.payload.doc.id; // Agregar el ID del documento
          return data;
        });
        resolve(cars); // Resuelve con la lista de autos
      },
      error: (error) => {
        reject(error); // Rechaza con el error
      }
    });
  });
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


  // FirebaseService

}