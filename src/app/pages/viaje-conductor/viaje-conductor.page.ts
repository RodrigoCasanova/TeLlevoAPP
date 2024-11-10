import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; // Usamos Router en lugar de NavController
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
    availableSeats: 4,  // Número de asientos disponibles (puede ser ajustado por el conductor)
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
    private router: Router, // Usamos Router en lugar de NavController
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
        const dateString = params['departureTime']; // Ejemplo: '21/11/2024 07:29'
        const [day, month, year, hour, minute] = dateString.split(/[/ :]/);
        const formattedTime = new Date(+year, +month - 1, +day, +hour, +minute);
  
        // Usar DatePipe para formatear la fecha
        const formattedDepartureTime = this.datePipe.transform(formattedTime, 'HH:mm');
        this.ride.departureTime = formattedDepartureTime ? formattedDepartureTime : 'Sin Hora';
  
        this.ride.costPerKm = params['cost'];
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

  confirmPassenger(passenger: any) {
    if (this.ride.availableSeats > 0 && passenger.status === 'Pendiente de Confirmación') {
      passenger.status = 'Confirmado';  // Cambiar el estado del pasajero
      this.ride.availableSeats--;  // Reducir los asientos disponibles
    } else if (passenger.status !== 'Pendiente de Confirmación') {
      if (passenger.status === 'Cancelado') {
        this.showAlert('Este pasajero ya ha sido cancelado y no puede ser confirmado.');
      } else {
        this.showAlert('Este pasajero ya ha sido confirmado.');
      }
    } else {
      this.showAlert('No hay asientos disponibles para más pasajeros.');
    }
  }
  
  rejectPassenger(passenger: any) {
    if (passenger.status === 'Confirmado') {
      this.ride.availableSeats++;  // Restaurar un asiento si se cancela un pasajero confirmado
    }
    passenger.status = 'Cancelado';  // Cambiar el estado del pasajero a 'Cancelado'
  }

  // Verifica si todos los pasajeros han sido confirmados o rechazados
  canScheduleTrip(): boolean {
    return this.passengers.every(
      (passenger) => passenger.status === 'Confirmado' || passenger.status === 'Cancelado'
    );
  }

  // Dentro de la función scheduleTrip() en ViajeConductorPage
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
