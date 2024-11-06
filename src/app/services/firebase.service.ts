import { Injectable, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Usuario } from 'src/app/interfaces/iusuario';

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

  // Guardar los datos del usuario en Firestore
  // Guardar los datos del usuario en Firestore
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
}
