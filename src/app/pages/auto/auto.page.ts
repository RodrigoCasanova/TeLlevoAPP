import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { LocaldbService } from 'src/app/services/localdb.service';

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

  // Modelos disponibles para cada marca
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

  constructor(private navCtrl: NavController, private localdb: LocaldbService) {}

  updateModels(event: any) {
    const selectedBrand = event.detail.value;
    this.models = this.brandModels[selectedBrand] || [];
  }

  saveCar() {
    if (this.car.brand && this.car.model && this.car.year && this.car.color && this.car.plate) {
      const newCar = {
        brand: this.car.brand,
        model: this.car.model,
        year: this.car.year,
        color: this.car.color,
        plate: this.car.plate,
        description: this.car.description,
      };
  
      this.localdb.obtener('carList').then(storedCars => {
        const cars = storedCars || [];
        cars.push(newCar); // Agrega el nuevo auto a la lista
        this.localdb.guardar('carList', cars).then(() => {
          console.log('Auto guardado:', newCar);
          this.navCtrl.back(); // Regresa a la página anterior
          // Aquí llamas a loadCars si es necesario, o puedes emitir un evento
        });
      });
    } else {
      console.error('Todos los campos son requeridos');
    }
  }
  
  

  goBack() {
    this.navCtrl.back();
  }
}
