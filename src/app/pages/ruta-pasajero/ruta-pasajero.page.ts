import { Component, OnInit } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { FirebaseService } from 'src/app/services/firebase.service'; // Asegúrate de que tienes el servicio importado
import { IAuto } from 'src/app/interfaces/iauto'; // Importa la interfaz IAuto

declare var google: any;

@Component({
  selector: 'app-ruta-pasajero',
  templateUrl: './ruta-pasajero.page.html',
  styleUrls: ['./ruta-pasajero.page.scss'],
})
export class RutaPasajeroPage implements OnInit {
  ride: any; // Aquí almacenamos los datos del viaje
  carDetails: IAuto | null = null;  // Para almacenar los detalles del auto
  conductorName: string = '';
  startPosition = { lat: -36.79448680693151, lng: -73.06436871720969 }; // Ubicación de inicio (Duoc UC)
  endPosition: any;
  map: any;
  directionsService: any;
  directionsRenderer: any;
  plate: string = '';  // Campo para la patente

  constructor(
    private navCtrl: NavController,
    private alertController: AlertController,
    private route: ActivatedRoute,
    private firebaseService: FirebaseService  // Inyectamos el servicio Firebase
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params && params['ride']) {
        this.ride = JSON.parse(params['ride']);
        console.log(this.ride);
        this.updateDestinationCoordinates(this.ride.location);

        // Guardar los datos del viaje en localStorage
        localStorage.setItem('selectedRide', JSON.stringify(this.ride));

        // Llamar a la función para obtener detalles del auto usando la patente
        this.getSelectedCarByPlate(this.ride.plate).subscribe(
          (data) => {
            console.log('Datos obtenidos:', data);
            if (data && data.length > 0) {
              this.carDetails = data[0]; // Asumimos que `data` es un array y tomamos el primer elemento

              // Guardar los detalles del auto en localStorage
              localStorage.setItem('carDetails', JSON.stringify(this.carDetails));
            } else {
              console.error('No se encontraron detalles para la patente');
            }
          },
          (error) => {
            console.error('Error al obtener datos:', error);
          }
        );

        // Inicializa el mapa después de obtener la patente y los detalles
        this.initMap();
      }
    });
  }

  // Definición del método getSelectedCarByPlate
  getSelectedCarByPlate(plate: string) {
    return this.firebaseService.getSelectedCarByPlate(plate);  // Llama al método de FirebaseService
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
        title: 'Destino: ' + this.ride.location,
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

  goBack() {
    this.navCtrl.back(); // Regresa a la página anterior
  }

  async shareLocation() {
    this.navCtrl.navigateForward('/home');
  }
}
