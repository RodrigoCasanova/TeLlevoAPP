import { Component, OnInit } from '@angular/core';
import { LocaldbService } from 'src/app/services/localdb.service';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

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
    private route: ActivatedRoute // Asegúrate de tener esto
  ) {}

  async ngOnInit() {
    // Cargar los viajes ofrecidos al inicializar la página
    const savedTrips = await this.localDbService.obtener('transportData');
    if (savedTrips) {
      this.rides = savedTrips; // Asigna los viajes a la variable rides
      this.filterRides(); // Filtra los viajes
    }

    // Obtener los parámetros de la URL (opcional, si se están pasando datos de la navegación)
    this.route.queryParams.subscribe(params => {
      this.carBrand = params['brand'] || '';
      this.carModel = params['model'] || '';
      this.carColor = params['color'] || '';
      this.carPlate = params['plate'] || '';
    });

    // Cargar los datos del auto guardados
    const savedCar = await this.localDbService.obtener('selectedCar');
    if (savedCar) {
      this.carBrand = savedCar.brand || '';
      this.carModel = savedCar.model || '';
      this.carColor = savedCar.color || '';
      this.carPlate = savedCar.plate || '';
    }
  }

  filterRides() {
    const now = new Date();
    const filtered = this.rides.filter(ride => {
      const rideTime = new Date(ride.startDateTime); // Usamos el tiempo de inicio del viaje
      return (
        (this.selectedLocation === 'all' || ride.location.toLowerCase() === this.selectedLocation.toLowerCase()) &&
        rideTime >= now && // Verifica que la hora del viaje no haya pasado
        ride.seats > 0 // Verifica que haya asientos disponibles
      );
    });
    this.filteredRides = filtered;
  }

  async startRide(ride: any) {
    const alert = await this.alertController.create({
      header: 'Confirmación',
      message: '¿Estás seguro de que quieres solicitar este viaje?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Aceptar',
          handler: async () => {
            // Lógica para manejar la solicitud del viaje
            const proceedAlert = await this.alertController.create({
              header: 'Solicitud Aceptada',
              message: '¡Tu solicitud ha sido aceptada! ¿Quieres ir a tu viaje?',
              buttons: [
                {
                  text: 'Cancelar',
                  role: 'cancel',
                  cssClass: 'secondary',
                },
                {
                  text: 'Ir al Viaje',
                  handler: () => {
                    // Redirigir a la página de detalles del viaje
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
