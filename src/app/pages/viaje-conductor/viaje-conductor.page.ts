import { Component, OnInit } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-viaje-conductor',
  templateUrl: './viaje-conductor.page.html',
  styleUrls: ['./viaje-conductor.page.scss'],
})
export class ViajeConductorPage implements OnInit {
  ride: any = {
    startLocation: '',
    destination: '',
    departureTime: '',
    costPerKm: 0,
  };

  passengers: any[] = [
    {
      name: 'Luis Ilufin',
      image: 'assets/img/Luis.jpeg',
      location: 'Ubicación Luis',
      status: 'Pendiente de Confirmación',
    },
    {
      name: 'Jose Paillan',
      image: 'assets/img/paillan.jpeg',
      location: 'Ubicación Jose',
      status: 'Pendiente de Confirmación',
    },
    {
      name: 'Carlos Cartes',
      image: 'assets/img/carlos.jpeg',
      location: 'Ubicación Carlos',
      status: 'Pendiente de Confirmación',
    },
  ];

  constructor(
    private navCtrl: NavController,
    private alertController: AlertController,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.ride.startLocation = params["destination"] || 'Duoc UC Concepcion';
      this.ride.destination = params["location"] ;
      this.ride.departureTime = params["startDateTime"];
      this.ride.costPerKm = params["cost"];
    });
  }

  goBack() {
    this.navCtrl.back();
  }

  confirmPassenger(passenger: any) {
    passenger.status = 'Confirmado';
  }

  rejectPassenger(passenger: any) {
    passenger.status = 'Cancelado';
  }

  canScheduleTrip(): boolean {
    return this.passengers.every(passenger => passenger.status === 'Confirmado' || passenger.status === 'Cancelado');
  }

  async scheduleTrip() {
    const alert = await this.alertController.create({
      header: 'Confirmar Viaje',
      message: '¿Estás seguro de programar el viaje con los pasajeros confirmados?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Confirmar',
          handler: () => {
            // Pasar solo el destino como parámetro de la ruta
            this.navCtrl.navigateForward('/ruta-conductor', {
              queryParams: { location: this.ride.destination }
            });
          },
        },
      ],
    });
  
    await alert.present();
  }
}  