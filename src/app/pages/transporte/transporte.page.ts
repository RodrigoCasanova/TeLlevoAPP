import { Component, OnInit } from '@angular/core';
import { LocaldbService } from 'src/app/services/localdb.service';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { FirebaseService } from 'src/app/services/firebase.service';  // Importa el servicio
import { IAuto } from 'src/app/interfaces/iauto';  // Asegúrate de que el tipo de dato esté correctamente importado
import { Usuario } from 'src/app/interfaces/iusuario';

@Component({
  selector: 'app-transporte',
  templateUrl: './transporte.page.html',
  styleUrls: ['./transporte.page.scss'],
})
export class TransportePage implements OnInit {
  selectedLocation: string = 'all';
  rides: any[] = [];
  filteredRides: any[] = [];
  
  // Propiedades para almacenar la información del auto
  carBrand: string = '';
  carModel: string = '';
  carColor: string = '';
  carPlate: string = '';

  constructor(
    private navCtrl: NavController,
    private localDbService: LocaldbService,
    private alertController: AlertController,
    private route: ActivatedRoute,
    private firebaseService: FirebaseService  // Añadido FirebaseService
  ) {}

  async ngOnInit() {
    try {
      const user = await this.firebaseService.currentUser;
      const uid = user ? user.uid : null;
  
      if (uid) {
        const firebaseRides = await this.firebaseService.getCarsForUser(uid);
  
        if (firebaseRides) {
          this.rides = firebaseRides;
          this.filterRides(); // Filtra los viajes para mostrarlos en pantalla
          console.log('Rides cargados desde Firebase:', this.rides); // Para ver los datos en consola
        } else {
          console.log('No se encontraron rides en Firebase');
        }
      } else {
        console.log('No se encontró UID del usuario.');
      }
  
      // Cargar el auto seleccionado desde el almacenamiento local
      const savedCar = await this.localDbService.obtener('selectedCar');
      if (savedCar) {
        this.carBrand = savedCar.brand || '';
        this.carModel = savedCar.model || '';
        this.carColor = savedCar.color || '';
        this.carPlate = savedCar.plate || '';
      }
    } catch (error) {
      console.error('Error al cargar los datos en ngOnInit:', error);
    }
  }

  // Método para cargar autos desde Firebase
  async loadCarsFromFirebase() {
    try {
      const currentUser = await this.firebaseService.currentUser;
      if (currentUser) {
        const cars: IAuto[] = await this.firebaseService.getCarsForUser(currentUser.uid);
        if (cars.length > 0) {
          const car = cars[0];  // Puedes personalizar esto para mostrar el auto deseado
          this.carBrand = car.brand;
          this.carModel = car.model;
          this.carColor = car.color;
          this.carPlate = car.plate;
        }
      }
    } catch (error) {
      console.error('Error al cargar los autos desde Firebase:', error);
    }
  }

  filterRides() {
    const now = new Date();
    const filtered = this.rides.filter(ride => {
      const rideTime = new Date(ride.startDateTime);
      return (
        (this.selectedLocation === 'all' || ride.location.toLowerCase() === this.selectedLocation.toLowerCase()) &&
        rideTime >= now &&
        ride.seats > 0
      );
    });
    this.filteredRides = filtered;
  }

  async startRide(ride: any) {
    const alert = await this.alertController.create({
      header: 'Confirmación',
      message: '¿Estás seguro de que quieres solicitar este viaje?',
      buttons: [
        { text: 'Cancelar', role: 'cancel', cssClass: 'secondary' },
        {
          text: 'Aceptar',
          handler: async () => {
            const proceedAlert = await this.alertController.create({
              header: 'Solicitud Aceptada',
              message: '¡Tu solicitud ha sido aceptada! ¿Quieres ir a tu viaje?',
              buttons: [
                { text: 'Cancelar', role: 'cancel', cssClass: 'secondary' },
                {
                  text: 'Ir al Viaje',
                  handler: () => {
                    this.navCtrl.navigateForward('/viaje-pasajero', {
                      queryParams: { ride: JSON.stringify(ride) },
                    });
                  },
                },
              ],
            });
            await proceedAlert.present();
          },
        },
      ],
    });
    await alert.present();
  }

  goBack() {
    this.navCtrl.back();
  }
}
