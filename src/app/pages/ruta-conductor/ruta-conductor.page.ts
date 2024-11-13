import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
declare var google: any;

@Component({
  selector: 'app-ruta-conductor',
  templateUrl: './ruta-conductor.page.html',
  styleUrls: ['./ruta-conductor.page.scss'],
})
export class RutaConductorPage implements OnInit {
  ride: any = {
    startLocation: '', // Aquí es donde se asigna el destino
  };

  startPosition = { lat: -36.79448680693151, lng: -73.06436871720969 }; // Posición inicial
  endPosition: any;

  map: any;
  directionsService: any;
  directionsRenderer: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private navCtrl: NavController
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params) {
        // Asignamos el 'destination' a 'startLocation'
        this.ride.startLocation = params['destination'];  // 'destination' es el 'startLocation' del viaje conductor
        this.updateDestinationCoordinates(this.ride.startLocation); // Actualiza las coordenadas del destino

        // Guardar el viaje en localStorage
        localStorage.setItem('ride', JSON.stringify(this.ride));
      }
    });

    this.initMap(); // Inicializa el mapa
  }

  initMap() {
    // Inicializa el mapa de Google Maps
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
    }
  }

  calculateAndDisplayRoute() {
    // Calcula y muestra la ruta
    if (!this.endPosition) return; // Si no hay un destino, no se calcula la ruta

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
        title: 'Destino: ' + this.ride.startLocation, // Usamos startLocation como destino
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

  // Función para navegar a la página de inicio
  goHome() {
    this.router.navigate(['/home']);
  }

  // Función para navegar al chat
  navigateToChat() {
    this.router.navigate(['/chat']);
  }

  // Función para seleccionar sugerencia
  selectSuggestion(suggestion: string) {
    this.ride.startLocation = suggestion;
    this.updateDestinationCoordinates(suggestion); // Actualiza el destino y calcula la ruta

    // Actualiza el almacenamiento en localStorage al seleccionar una sugerencia
    localStorage.setItem('ride', JSON.stringify(this.ride));
  }

  // Función de "Go Back" (volver atrás)
  goBack() {
    this.navCtrl.back(); // Simplemente regresa a la página anterior
  }
}
