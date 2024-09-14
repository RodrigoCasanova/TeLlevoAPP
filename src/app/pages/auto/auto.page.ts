import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';

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

  // Lista de años desde 1990 hasta el año actual
  years: string[] = Array.from({ length: new Date().getFullYear() - 1989 }, (_, i) => (1990 + i).toString());

  // Lista de colores
  colors: string[] = ['Blanco', 'Negro', 'Gris', 'Rojo', 'Azul', 'Verde', 'Amarillo', 'Otro'];

  constructor(private navCtrl: NavController) {}

  // Actualiza la lista de modelos cuando se selecciona una marca
  updateModels(event: any) {
    const selectedBrand = event.detail.value;
    this.models = this.brandModels[selectedBrand] || [];
  }

  saveCar() {
    if (this.car.model === 'otro') {
      // Si se selecciona "Otro", podrías agregar una lógica para pedir el modelo personalizado al usuario
      console.log('Modelo personalizado:', this.car.model);
    }
    console.log('Detalles del auto guardados:', this.car);
  }

  goBack() {
    this.navCtrl.back(); // Regresar a la página anterior
  }
}
