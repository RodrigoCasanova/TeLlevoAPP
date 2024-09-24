import { Component, OnInit } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-transporte',
  templateUrl: './transporte.page.html',
  styleUrls: ['./transporte.page.scss'],
})
export class TransportePage implements OnInit {
  selectedLocation: string = 'all';
  rides: any[] = [
    {
      driverName: 'Jose Paillan',
      driverImage: 'assets/img/paillan.jpeg',
      destination: 'Duoc UC Concepción',
      uwu: 3,
      departureTime: '13:00',
      costPerKm: 200,
      location: 'penco',
    },
    {
      driverName: 'Jose Vasquez',
      driverImage: 'assets/img/jose.jpeg',
      destination: 'Duoc UC Concepción',
      uwu: 1,
      departureTime: '18:30',
      costPerKm: 250,
      location: 'San Pedro',
    },
    {
      driverName: 'Luis ilufin',
      driverImage: 'assets/img/Luis.jpeg',
      destination: 'Duoc UC Concepción',
      uwu: 2,
      departureTime: '15:30',
      costPerKm: 220,
      location: 'talcahuano',
    },
    {
      driverName: 'Carlos Cartes',
      driverImage: 'assets/img/carlos.jpeg',
      destination: 'Duoc UC Concepción',
      uwu: 0,
      departureTime: '19:30',
      costPerKm: 230,
      location: 'Penco',
    },
    {
      driverName: 'Matias Gonzalez',
      driverImage: 'assets/img/mati.jpeg',
      destination: 'Duoc UC Concepción',
      uwu: 4,
      departureTime: '22:00',
      costPerKm: 240,
      location: 'Chiguayante',
    },
  ];
  filteredRides: any[] = [];

  constructor(private navCtrl: NavController, private alertController: AlertController) {}

  ngOnInit() {
    this.filterRides();
  }

  filterRides() {
    const now = new Date();
    const filtered = this.rides.filter(ride => {
      const rideTime = new Date();
      const [hours, minutes] = ride.departureTime.split(':').map(Number);
      rideTime.setHours(hours, minutes);
  
      return (
        (this.selectedLocation === 'all' || ride.location.toLowerCase() === this.selectedLocation.toLowerCase()) &&
        rideTime >= now &&
        ride.destination === 'Duoc UC Concepción' &&
        ride.uwu > 0 // Asegúrate de que haya asientos disponibles
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
            // Mostrar la segunda alerta después de la confirmación
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
