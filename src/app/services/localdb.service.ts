import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class LocaldbService {
  private _storage: Storage | null = null;

  constructor(private storage: Storage) {
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
}
