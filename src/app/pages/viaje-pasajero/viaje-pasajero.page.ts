import { Component, OnInit } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { FirebaseService } from 'src/app/services/firebase.service';

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
  // Método para verificar si el usuario ya tiene un viaje activo
  async checkActiveTrip() {
    
      // Asegúrate de pasar el userId real, por ejemplo, el ID del pasajero actual
      const userId = this.ride.pasajeroIDs; // Reemplaza esto con el ID correcto, tal vez 'this.ride.pasajeroIDs[0]' si estás buscando al primer pasajero.
      const activeTrip = await this.firebaseService.getActiveTripForUser(userId);
      
      if (activeTrip) {
        this.hasActiveTrip = true; // El usuario tiene un viaje activo
      } else {
        this.hasActiveTrip = false; // El usuario no tiene un viaje activo
      }
    
      
    
  }
  //listo


  async startTrip() {
    if (this.hasActiveTrip) {
      // Si el usuario tiene un viaje activo, mostramos un mensaje de alerta
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Ya tienes un viaje agendado. No puedes reservar otro hasta que lo hayas completado.',
        buttons: ['OK'],
      });
      await alert.present();
      return;
    }
  
    if (this.ride.seats > 0) {
      // Disminuir los asientos disponibles en la base de datos
      this.ride.seats -= 1;
  
      // Agregar el ID del pasajero al viaje
      this.ride.pasajeroIDs = this.ride.pasajeroIDs || []; // Inicializa si no existe
      
  
      try {
        // Actualiza los datos del viaje en la base de datos (colección transports)
        await this.firebaseService.updateTransportSeatsAndPassengers(this.ride.id, this.ride.seats, this.ride.pasajeroIDs);
  
        // Navegar a la página de ruta para el pasajero, pasando los detalles del viaje y los pasajeros
        this.router.navigate(['/ruta-pasajero'], {
          queryParams: {
            ride: JSON.stringify(this.ride),
          },
        });
      } catch (error) {
        console.error('Error al actualizar los asientos y agregar al pasajero:', error);
      }
    } else {
      // Si no hay asientos disponibles, muestra un mensaje de error
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'No hay asientos disponibles para este viaje.',
        buttons: ['OK'],
      });
      await alert.present();
    }
  }
  
  

  goBack() {
    this.navCtrl.back();
  }
}
