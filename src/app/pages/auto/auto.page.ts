import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { FirebaseService } from 'src/app/services/firebase.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';  // Importar AngularFireAuth

@Component({
  selector: 'app-auto',
  templateUrl: './auto.page.html',
  styleUrls: ['./auto.page.scss'],
})
export class AutoPage {
  car = {
    brand: '',
    model: '',
    year: '',
    color: '',
    plate: '',
    description: ''
  };

  brandModels: { [key: string]: string[] } = {
    toyota: ['Corolla', 'Camry', 'Hilux'],
    nissan: ['Versa', 'X-Trail', 'Frontier'],
    hyundai: ['Elantra', 'Tucson', 'Sonata'],
    chevrolet: ['Sail', 'Tracker', 'Camaro'],
    ford: ['Fiesta', 'Focus', 'Escape'],
    renault: ['Duster', 'Sandero', 'Koleos'],
    kia: ['Rio', 'Sportage', 'Seltos'],
    volkswagen: ['Gol', 'Tiguan', 'Polo'],
    peugeot: ['208', '3008', '5008'],
    honda: ['Civic', 'HR-V', 'CR-V'],
    otro: []
  };

  models: string[] = [];
  years: string[] = Array.from({ length: new Date().getFullYear() - 1989 }, (_, i) => (1990 + i).toString());

  constructor(
    private navCtrl: NavController, 
    private firebaseService: FirebaseService,
    private afAuth: AngularFireAuth  // Inyectar AngularFireAuth
  ) {}

  updateModels(event: any) {
    const selectedBrand = event.detail.value;
    this.models = this.brandModels[selectedBrand] || [];
  }

  // Guardar el auto en Firestore
  async saveCar() {
    if (this.car.brand && this.car.model && this.car.year && this.car.color && this.car.plate) {
      try {
        const userCredential = await this.afAuth.currentUser; // Obtener el usuario logueado
        if (userCredential) {
          const uid = userCredential.uid;  // Obtener el UID del usuario logueado
  
          const newCar = {
            brand: this.car.brand,
            model: this.car.model,
            year: this.car.year,
            color: this.car.color,
            plate: this.car.plate,
            description: this.car.description,
          };
  
          // Llamar al servicio de Firebase para guardar el auto con el UID del usuario
          await this.firebaseService.saveCarData(uid, newCar);
          console.log('Auto guardado en Firebase');
          this.navCtrl.back();  // Regresar a la página anterior
        } else {
          console.error('Usuario no logueado');
        }
      } catch (error) {
        console.error('Error al guardar el auto en Firebase: ', error);
      }
    } else {
      console.error('Todos los campos son requeridos');
    }
  }
  

  goBack() {
    this.navCtrl.back();
  }
}
