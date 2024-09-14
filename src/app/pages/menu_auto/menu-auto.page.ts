import { Component } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-menu-auto',
  templateUrl: './menu-auto.page.html',
  styleUrls: ['./menu-auto.page.scss'],
})
export class MenuAutoPage {
  cars = [
    { make: 'Toyota', model: 'Corolla', year: 2020, color: 'Blanco', licensePlate: 'ABC123', selected: false },
    // Agrega más autos según sea necesario
  ];

  selectedCar: any;

  constructor(
    private navCtrl: NavController,
    private alertController: AlertController
  ) {}

  addCar() {
    // Lógica para agregar un auto
    this.navCtrl.navigateForward('/auto');
  }

  editCar(car: any) {
    // Lógica para editar un auto
    console.log('Editar auto', car);
  }

  async confirmDelete(car: any) {
    const alert = await this.alertController.create({
      header: 'Confirmación',
      message: `¿Estás seguro que quieres eliminar el auto ${car.make} ${car.model}?`,
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

  deleteCar(car: any) {
    // Lógica para eliminar el auto
    console.log('Eliminar auto', car);
    this.cars = this.cars.filter(c => c !== car);
    this.selectedCar = null; // Resetear selección después de eliminar
  }

  offerTransport() {
    if (this.selectedCar) {
      this.navCtrl.navigateForward('/conductor');
      console.log('Ofrecer transporte para el auto seleccionado', this.selectedCar);
      // Aquí puedes redirigir a la página de oferta de transporte o realizar cualquier otra acción
    }
  }

  updateSelectedCar(car: any) {
    this.selectedCar = this.cars.find(c => c.selected);
  }
  goBack() {
    this.navCtrl.back();
  }
}
