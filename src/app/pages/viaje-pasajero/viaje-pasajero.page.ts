import { Component, OnInit } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { FirebaseService } from 'src/app/services/firebase.service';
import emailjs from 'emailjs-com';

declare var google: any;

@Component({
  selector: 'app-viaje-pasajero',
  templateUrl: './viaje-pasajero.page.html',
  styleUrls: ['./viaje-pasajero.page.scss'],
})
export class ViajePasajeroPage implements OnInit {
  ride: any;
  conductorName: string = '';
  startPosition = { lat: -36.79448680693151, lng: -73.06436871720969 }; // Ubicación de inicio (Duoc UC)
  endPosition: any;
  map: any;
  directionsService: any;
  directionsRenderer: any;
  hasActiveTrip: boolean = false; // Nueva variable para verificar si el usuario tiene un viaje activo

  constructor(
    private navCtrl: NavController,
    private alertController: AlertController,
    private route: ActivatedRoute,
    private router: Router,
    private firebaseService: FirebaseService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params && params['ride']) {
        this.ride = JSON.parse(params['ride']);
        this.updateDestinationCoordinates(this.ride.location);
        this.initMap();
        this.getConductorDetails(this.ride.userId);
        this.checkActiveTrip();  // Verifica si ya hay un viaje activo
      }
    });
  }

  async getConductorDetails(userId: string) {
    try {
      const userData = await this.firebaseService.getUserData(userId);
      if (userData) {
        this.conductorName = `${userData.nombre} ${userData.apellido || ''}`;
      } else {
        this.conductorName = 'Conductor desconocido';
      }
    } catch (error) {
      this.conductorName = 'Conductor desconocido';
    }
  }

  initMap() {
    this.map = new google.maps.Map(document.getElementById('map'), {
      center: this.startPosition,
      zoom: 10,
    });

    this.directionsService = new google.maps.DirectionsService();
    this.directionsRenderer = new google.maps.DirectionsRenderer({
      polylineOptions: {
        strokeColor: 'blue',
        strokeOpacity: 0.7,
        strokeWeight: 6,
      },
    });
    this.directionsRenderer.setMap(this.map);

    if (this.endPosition) {
      this.calculateAndDisplayRoute();
      this.placeMarkers();
    }
  }

  calculateAndDisplayRoute() {
    if (!this.endPosition) return;

    this.directionsService.route(
      {
        origin: this.startPosition,
        destination: this.endPosition,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (response: any, status: any) => {
        if (status === 'OK') {
          this.directionsRenderer.setDirections(response);
          this.placeMarkers();
        } else {
          window.alert('Directions request failed due to ' + status);
        }
      }
    );
  }

  placeMarkers() {
    new google.maps.Marker({
      position: this.startPosition,
      map: this.map,
      title: 'Ubicación Actual (Duoc UC)',
    });

    if (this.endPosition) {
      new google.maps.Marker({
        position: this.endPosition,
        map: this.map,
        title: 'Destino: ' + this.ride.destination,
      });
    }
  }

  updateDestinationCoordinates(destination: string) {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: destination }, (results: any, status: any) => {
      if (status === google.maps.GeocoderStatus.OK && results[0]) {
        this.endPosition = results[0].geometry.location;
        this.calculateAndDisplayRoute();
        this.placeMarkers();
      }
    });
  }

  // Método para verificar si el usuario ya tiene un viaje activo
  async checkActiveTrip() {
    const userId = this.ride.pasajeroIDs[0]; // Asegúrate de usar el ID correcto del pasajero.
    const activeTrip = await this.firebaseService.getActiveTripForUser(userId);
    if (activeTrip) {
      this.hasActiveTrip = true; // El usuario tiene un viaje activo
    } else {
      this.hasActiveTrip = false; // El usuario no tiene un viaje activo
    }
  }

  async startTrip() {
    if (this.hasActiveTrip) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Ya tienes un viaje agendado. No puedes reservar otro hasta que lo hayas completado.',
        buttons: ['OK'],
      });
      await alert.present();
      return;
    }
  
    if (this.ride.seats > 0) {
      const confirmAlert = await this.alertController.create({
        header: 'Confirmar Viaje',
        message: '¿Seguro que quieres tomar este viaje?',
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            handler: () => {
              console.log('El pasajero ha cancelado la reserva.');
            },
          },
          {
            text: 'Aceptar',
            handler: async () => {
              this.ride.seats -= 1;
              this.ride.pasajeroIDs = this.ride.pasajeroIDs || [];
  
              try {
                const user = await this.firebaseService.currentUser;
                const userData = await this.firebaseService.getUserData(user.uid);
  
                const pasajeroNombre = userData?.nombre || 'Pasajero';
                const pasajeroEmail = await this.firebaseService.getCurrentUserEmail();
  
                await this.firebaseService.updateTransportSeatsAndPassengers(this.ride.id, this.ride.seats, this.ride.pasajeroIDs);
  
                const mensajeNotificacion = `${pasajeroNombre} ha reservado tu viaje.`;
                await this.firebaseService.sendNotification(this.ride.userId, mensajeNotificacion);
  
                // Enviar el correo al conductor con el correo del pasajero
                this.enviarCorreoAlConductor(pasajeroNombre, pasajeroEmail);  // Usamos el correo del pasajero
  
                const successAlert = await this.alertController.create({
                  header: '¡Viaje Aceptado!',
                  message: `${pasajeroNombre} ha sido agregado al viaje. El conductor será notificado.`,
                  buttons: ['OK'],
                });
                await successAlert.present();
  
                this.router.navigate(['/ruta-pasajero'], {
                  queryParams: {
                    ride: JSON.stringify(this.ride),
                  },
                });
              } catch (error) {
                console.error('Error al actualizar los asientos y agregar al pasajero:', error);
              }
            },
          },
        ],
      });
  
      await confirmAlert.present();
    } else {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'No hay asientos disponibles para este viaje.',
        buttons: ['OK'],
      });
      await alert.present();
    }
  }
  
  enviarCorreoAlConductor(pasajeroNombre: string, pasajeroEmail: string) {
    const mensajeCorreo = `Reserva para el viaje a ${this.ride.location} el ${this.ride.startDateTime}`;
  
    const templateParams = {
      from_name: pasajeroNombre,         // Nombre del pasajero
      from_email: pasajeroEmail,         // Correo del pasajero
      to_name: this.conductorName,       // Nombre del conductor
      message: mensajeCorreo,            // Detalles del viaje
    };
  
    emailjs.send('service_717m0hn', 'template_3fcbq6z', templateParams, 'o0XtQY9cZmqfClwTh')
      .then((response) => {
        console.log('Correo enviado exitosamente:', response);
      })
      .catch((error) => {
        console.error('Error al enviar el correo:', error);
      });
  }
  

  goBack() {
    this.navCtrl.back();
  }
}
