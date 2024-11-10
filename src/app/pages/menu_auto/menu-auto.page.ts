import { Component } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { FirebaseService } from 'src/app/services/firebase.service';  // Inyectar el servicio Firebase
import { IAuto } from 'src/app/interfaces/iauto';  // Asegúrate de tener esta interfaz definida
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-menu-auto',
  templateUrl: './menu-auto.page.html',
  styleUrls: ['./menu-auto.page.scss'],
})
export class MenuAutoPage {
  cars: IAuto[] = []; // Lista de autos que se cargará desde Firebase
  selectedCar: IAuto | null = null; // Auto seleccionado

  constructor(
    private navCtrl: NavController, // Para navegación
    private alertController: AlertController, // Para mostrar alertas
    private firebaseService: FirebaseService // Servicio para interactuar con Firebase
  ) {}

  // Llamada para cargar los autos cuando la página está por aparecer
  ionViewWillEnter() {
    this.loadCars(); // Cargar los autos
    
  }
  

  // Función para cargar los autos desde Firebase
  async loadCars() {
    try {
      const user = await this.firebaseService.currentUser;
      if (user) {
        this.cars = await this.firebaseService.getCarsForUser(user.uid);
        this.cars.forEach(car => {
          console.log(`Auto cargado: ${car.plate}`);  // Depuración para verificar la patente
        });
      } else {
        console.error('Usuario no autenticado');
      }
    } catch (error) {
      console.error('Error al cargar los autos:', error);
    }
  }
  
  

  // Función para agregar un nuevo auto (navega hacia la página de auto)
  addCar() {
    this.navCtrl.navigateForward('/auto'); // Navegar a la página de agregar auto
  }

  // Función para editar los detalles de un auto (en este caso solo se muestra un log)
  editCar(car: IAuto) {
    console.log('Editar auto', car);
    // Aquí puedes agregar la lógica para editar el auto (si es necesario)
  }

  // Función para confirmar la eliminación de un auto
  async confirmDelete(car: IAuto) {
    const alert = await this.alertController.create({
      header: 'Confirmación',
      message: `¿Estás seguro que quieres eliminar el auto ${car.brand} ${car.model}?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Eliminación cancelada');
          }
        },
        {
          text: 'Eliminar',
          handler: () => {
            this.deleteCar(car); // Si confirma, elimina el auto
          }
        }
      ]
    });

    await alert.present(); // Muestra la alerta
  }

  // Función para eliminar un auto
  async deleteCar(car: IAuto) {
    try {
      await this.firebaseService.deleteCar(car.id); // Elimina el auto de Firebase usando el ID
      this.loadCars(); // Recarga la lista de autos
      console.log('Auto eliminado:', car);
    } catch (error) {
      console.error('Error al eliminar el auto:', error); // Manejo de errores
    }
  }

  // Actualiza el auto seleccionado
  updateSelectedCar(car: IAuto) {
    this.selectedCar = car.selected ? car : null;  
    console.log('Auto seleccionado:', this.selectedCar);
  }

  // Función para ofrecer transporte con el auto seleccionado
  async offerTransport() {
    if (this.selectedCar) {
      if (!this.selectedCar.plate) {
        console.error('La patente del auto está vacía');
        return;  // Detiene la ejecución si la patente está vacía
      }
      // Guardar los datos del auto seleccionado en el local storage
      await this.firebaseService.saveSelectedCar(this.selectedCar);
      // Navegar a la página del conductor, pasando la patente como queryParams
      this.navCtrl.navigateForward('/conductor', {
        queryParams: { plate: this.selectedCar.plate }
      });
      console.log('Ofrecer transporte para el auto seleccionado:', this.selectedCar);
    } else {
      console.error('No hay auto seleccionado para ofrecer transporte');
    }
  }
  
  

  // Función para navegar hacia atrás
  goBack() {
    this.navCtrl.back(); // Simplemente regresa a la página anterior
  }
  
  
  

}
