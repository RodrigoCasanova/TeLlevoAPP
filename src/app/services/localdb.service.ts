import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { IAuto } from '../interfaces/iauto';
import { Observable } from 'rxjs'; // Aquí importas Observable

@Injectable({
  providedIn: 'root'
})
export class LocaldbService {
  private _storage: Storage | null = null;

  constructor(
    private storage: Storage,
    private auth: AngularFireAuth,
    private firestore: AngularFirestore
  ) {
    this.init();
  }

  async init() {
    this._storage = await this.storage.create();
  }

  public async guardar(key: string, value: any) {
    await this.ensureInitialized();
    return this._storage?.set(key, value);
  }

  public async obtener(key: string) {
    await this.ensureInitialized();
    return this._storage?.get(key);
  }

  private async ensureInitialized() {
    if (!this._storage) {
      this._storage = await this.storage.create();
    }
  }

  async isOnline(): Promise<boolean> {
    return navigator.onLine;
  }

  async getCurrentUserId(): Promise<string | null> {
    const user = await this.auth.currentUser;
    return user ? user.uid : null;
  }

  public async guardarEnFirebase(collection: string, car: IAuto) {
    const userId = await this.getCurrentUserId();
    if (userId) {
      return this.firestore.collection(`users/${userId}/${collection}`).add(car);
    } else {
      throw new Error('Usuario no autenticado');
    }
  }

  // Cargar autos desde Firebase y devolver un Observable
  public obtenerAutosDesdeFirebase(): Observable<IAuto[]> {
    return this.firestore.collection<IAuto>(`users/${this.getCurrentUserId()}/cars`).valueChanges();
  }
  public async eliminarAutoDesdeFirebase(carId: string): Promise<void> {
    const userId = await this.getCurrentUserId();
    if (userId) {
      await this.firestore.collection(`users/${userId}/cars`).doc(carId).delete();
    } else {
      throw new Error('Usuario no autenticado');
    }
  }
}
