import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; 
import { AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-viaje-conductor',
  templateUrl: './viaje-conductor.page.html',
  styleUrls: ['./viaje-conductor.page.scss'],
})
export class ViajeConductorPage implements OnInit {
  // Datos del viaje
  ride: any = {
    startLocation: '',
    destination: '',
    departureTime: '',
    costPerKm: 0,
    availableSeats: '',  // Número de asientos disponibles (puede ser ajustado por el conductor)
  };
  
  passengers: any[] = [
    {
      name: 'Luis Ilufin',
      image: 'assets/img/Luis.jpeg',
      location: 'Ubicación Luis',
    },
    {
      name: 'Jose Paillan',
      image: 'assets/img/paillan.jpeg',
      location: 'Ubicación Jose',
    },
    {
      name: 'Carlos Cartes',
      image: 'assets/img/carlos.jpeg',
      location: 'Ubicación Carlos',
    },
  ];

  constructor(
    private router: Router,
    private alertController: AlertController,
    private route: ActivatedRoute,
    private datePipe: DatePipe,
    private navCtrl: NavController
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      if (params) {
        this.ride.startLocation = params['startLocation'];
        this.ride.destination = params['destination'] || 'Duoc UC Concepcion';
        
        // Asegúrate de convertir el string de fecha en un objeto Date
        const dateString = params['departureTime']; 
        const [day, month, year, hour, minute] = dateString.split(/[/ :]/);
        const formattedTime = new Date(+year, +month - 1, +day, +hour, +minute);
    
        const formattedDepartureTime = this.datePipe.transform(formattedTime, 'HH:mm');
        this.ride.departureTime = formattedDepartureTime ? formattedDepartureTime : 'Sin Hora';
    
        this.ride.costPerKm = params['cost'];
        this.ride.availableSeats = parseInt(params['availableSeats'], 10);  // Asigna los asientos disponibles
      }
    });
  }

  goBack() {
    this.navCtrl.back(); // Simplemente regresa a la página anterior
  }

  async showAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Error',
      message: message,
      buttons: ['OK'],
    });

    await alert.present();
  }

  // Verifica si todos los pasajeros han sido confirmados o rechazados
  canScheduleTrip(): boolean {
    return this.passengers.length <= this.ride.availableSeats;
  }

  async scheduleTrip() {
    const alert = await this.alertController.create({
      header: 'Confirmar Viaje',
      message: '¿Estás seguro de programar el viaje con los pasajeros seleccionados?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Confirmar',
          handler: () => {
            // Solo pasamos startLocation como destino
            this.router.navigate(['/ruta-conductor'], {
              queryParams: {
                destination: this.ride.startLocation,  // Pasamos solo el destino
              },
            });
          },
        },
      ],
    });

    await alert.present();
  }
}
  