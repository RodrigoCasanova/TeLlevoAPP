import { Component, OnInit } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router'; // Incluir Router
import { FirebaseService } from 'src/app/services/firebase.service'; // Asegúrate de importar tu servicio de Firebase

declare var google: any;

@Component({
  selector: 'app-viaje-pasajero',
  templateUrl: './viaje-pasajero.page.html',
  styleUrls: ['./viaje-pasajero.page.scss'],
})
export class ViajePasajeroPage implements OnInit {
  ride: any;
  conductorName: string = '';
  carDetails = {
    brand: 'Toyota',
    model: 'Corolla',
    licensePlate: 'AB123CD',
    color: 'Blanco',
  };
  startPosition = { lat: -36.79448680693151, lng: -73.06436871720969 }; // Ubicación de inicio (Duoc UC)
  endPosition: any;
  map: any;
  directionsService: any;
  directionsRenderer: any;

  constructor(
    private navCtrl: NavController,
    private alertController: AlertController,
    private route: ActivatedRoute,
    private router: Router, // Agregar Router aquí
    private firebaseService: FirebaseService // Inyectar servicio de Firebase
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params && params['ride']) {
        this.ride = JSON.parse(params['ride']);
        console.log(this.ride); // Verifica los valores de 'ride'
        this.updateDestinationCoordinates(this.ride.location); // Actualiza las coordenadas del destino
        this.initMap(); // Inicializa el mapa

        // Obtener nombre y apellido del conductor a través del userId
        this.getConductorDetails(this.ride.userId);
      }
    });
  }

  // Obtener detalles del conductor desde Firebase
  async getConductorDetails(userId: string) {
    try {
      const userData = await this.firebaseService.getUserData(userId); // Obtener los datos del usuario
      if (userData) {
        this.conductorName = `${userData.nombre} ${userData.apellido || ''}`; // Combinar nombre y apellido
      } else {
        this.conductorName = 'Conductor desconocido'; // En caso de no encontrar al conductor
      }
    } catch (error) {
      console.error('Error al obtener datos del conductor:', error);
      this.conductorName = 'Conductor desconocido'; // Si hay error, mostrar desconocido
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

  startTrip() {
    // Pasar los datos del viaje a la página RutaPasajeroPage
    this.router.navigate(['/ruta-pasajero'], {
      queryParams: {
        ride: JSON.stringify(this.ride),
      },
    });
  }

  goBack() {
    this.navCtrl.back(); // Regresa a la página anterior
  }
}
