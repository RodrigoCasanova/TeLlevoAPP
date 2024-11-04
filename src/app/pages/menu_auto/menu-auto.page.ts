import { Component } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { LocaldbService } from 'src/app/services/localdb.service';

@Component({
  selector: 'app-menu-auto',
  templateUrl: './menu-auto.page.html',
  styleUrls: ['./menu-auto.page.scss'],
})
export class MenuAutoPage {
  cars: any[] = []; // Inicializamos el array vacío
  selectedCar: any;

  constructor(
    private navCtrl: NavController,
    private alertController: AlertController,
    private localdb: LocaldbService // Inyectamos el servicio
  ) {}

  ionViewWillEnter() {
    this.loadCars(); // Cargar autos cada vez que la página se muestra
  }
  
  async loadCars() {
    const storedCars = await this.localdb.obtener('carList') || [];
    if (!Array.isArray(storedCars)) {
      console.error('Los autos guardados no son un array');
      this.cars = []; // Reinicia la lista si no es un array
    } else {
      this.cars = storedCars;
    }
    console.log('Autos cargados:', this.cars); // Verifica que se estén cargando
  }

  addCar() {
    this.navCtrl.navigateForward('/auto'); // Navegar a la página de agregar auto
  }

  editCar(car: any) {
    console.log('Editar auto', car);
    // Implementar la lógica para editar el auto
  }

  async confirmDelete(car: any) {
    const alert = await this.alertController.create({
      header: 'Confirmación',
      message: `¿Estás seguro que quieres eliminar el auto ${car.brand} ${car.model}?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Cancelado');
          }
        },
        {
          text: 'Eliminar',
          handler: () => {
            this.deleteCar(car);
          }
        }
      ]
    });

    await alert.present();
  }

  async deleteCar(car: any) {
    console.log('Eliminar auto', car);
    this.cars = this.cars.filter(c => c !== car);
    
    // Guardar la nueva lista en el storage
    await this.localdb.guardar('carList', this.cars);
    this.selectedCar = null; // Resetear selección después de eliminar
  }

  async offerTransport() {
    if (this.selectedCar) {
      // Guardar el auto seleccionado para ofrecer transporte
      const carData = {
        brand: this.selectedCar.brand,
        model: this.selectedCar.model,
        color: this.selectedCar.color,
        plate: this.selectedCar.plate,
      };

      // Guardar los datos del auto en el LocaldbService
      await this.localdb.guardar('selectedCar', carData);
      
      // Navegar a la página del conductor
      this.navCtrl.navigateForward('/conductor');
      console.log('Ofrecer transporte para el auto seleccionado', carData);
    } else {
      console.error('No hay auto seleccionado para ofrecer transporte.');
    }
  }

  updateSelectedCar(car: any) {
    this.selectedCar = this.cars.find(c => c.selected);
  }

  goBack() {
    this.navCtrl.back(); // Simplemente regresa a la página anterior
  }
}
