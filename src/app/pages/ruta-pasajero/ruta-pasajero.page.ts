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
  startPosition = { lat: -36.79448680693151, lng: -73.06436871720969 }; // Posición inicial
  endPosition: any;
  map: any;
  directionsService: any;
  directionsRenderer: any;
  plate: string = '';  // Campo para la patente
  dataLoaded: boolean = false;  // Flag para indicar si los datos están cargados

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
        console.log('Ride data:', this.ride);
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

              // Marcar los datos como cargados
              this.dataLoaded = true;

              // Llamar a la función para inicializar el mapa después de que los datos se han cargado
              this.loadMap();
            } else {
              console.error('No se encontraron detalles para la patente');
            }
          },
          (error) => {
            console.error('Error al obtener datos:', error);
          }
        );
      }
    });
  }

  // Definición del método getSelectedCarByPlate
  getSelectedCarByPlate(plate: string) {
    return this.firebaseService.getSelectedCarByPlate(plate);  // Llama al método de FirebaseService
  }

  loadMap() {
    // Verifica que los datos estén completamente cargados antes de inicializar el mapa
    if (!this.dataLoaded) {
      console.log('Esperando a que los datos se carguen...');
      return; // Si los datos no están cargados, no inicializa el mapa
    }

    console.log('Inicializando el mapa...');
    // Ahora que los datos están listos, inicializamos el mapa
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
      this.placeMarkers(); // Coloca los marcadores si ya hay un destino
      this.calculateAndDisplayRoute(); // Calcula la ruta si el destino ya está disponible
    }
  }

  calculateAndDisplayRoute() {
    // Verifica si directionsService está disponible y si endPosition está definida
    if (!this.directionsService || !this.endPosition) {
      console.error('directionsService no está inicializado o no hay destino');
      return; // Si no hay un destino o directionsService no está disponible, no se calcula la ruta
    }

    console.log('Calculando ruta...');
    // Calcula la ruta si todo está correcto
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

  ionViewDidEnter() {
    // Verifica que el mapa esté inicializado antes de calcular la ruta
    if (this.directionsService && this.endPosition) {
      console.log('Mapa y destino están listos, calculando ruta...');
      this.calculateAndDisplayRoute();  // Solo se llama si directionsService está disponible
    } else {
      console.error('directionsService no está disponible o no hay destino');
    }
  }

  placeMarkers() {
    // Coloca los marcadores en el mapa
    new google.maps.Marker({
      position: this.startPosition,
      map: this.map,
      title: 'Inicio (Ubicación Fija)',
    });

    if (this.endPosition) {
      new google.maps.Marker({
        position: this.endPosition,
        map: this.map,
        title: 'Destino: ' + this.ride.location, // Usamos startLocation como destino
      });
    }
  }

  updateDestinationCoordinates(destination: string) {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: destination }, (results: any, status: any) => {
      if (status === google.maps.GeocoderStatus.OK && results[0]) {
        this.endPosition = results[0].geometry.location; // Obtiene las coordenadas del destino
        this.calculateAndDisplayRoute(); // Calcula la ruta hacia el destino
        this.placeMarkers(); // Coloca el marcador en el destino
      } else {
        window.alert('No se pudo encontrar el destino: ' + status);
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
