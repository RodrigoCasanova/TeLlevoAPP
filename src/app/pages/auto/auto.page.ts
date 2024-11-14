import { Component } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
import { FirebaseService } from 'src/app/services/firebase.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';

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
    private afAuth: AngularFireAuth,
    private alertController: AlertController
  ) {}

  updateModels(event: any) {
    const selectedBrand = event.detail.value;
    this.models = this.brandModels[selectedBrand] || [];
  }

  // Método para mostrar una alerta con el mensaje de error
  async showAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Error',
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }

  // Guardar el auto en Firestore con validación de patente
  async saveCar() {
    // Expresión regular para validar el formato de la patente chilena
    const platePattern = /^[A-Z]{2}\d{4}$|^[A-Z]{2}\d{3}[A-Z]$/;

    // Validación de campos
    if (!this.car.brand || !this.car.model || !this.car.year || !this.car.color || !this.car.plate) {
      this.showAlert('Todos los campos son requeridos');
      return;
    }

    // Validación de formato de patente
    if (!platePattern.test(this.car.plate.toUpperCase())) {
      this.showAlert('La patente debe tener un formato válido, como "AB1234" o "AB123C"');
      return;
    }

    try {
      const userCredential = await this.afAuth.currentUser;
      if (userCredential) {
        const uid = userCredential.uid;

        const newCar = {
          brand: this.car.brand,
          model: this.car.model,
          year: this.car.year,
          color: this.car.color,
          plate: this.car.plate,
          description: this.car.description,
        };

        await this.firebaseService.saveCarData(uid, newCar);
        console.log('Auto guardado en Firebase');
        this.navCtrl.back();
      } else {
        console.error('Usuario no logueado');
      }
    } catch (error) {
      console.error('Error al guardar el auto en Firebase: ', error);
    }
  }

  goBack() {
    this.navCtrl.back();
  }
}
