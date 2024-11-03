import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';

declare var google: any;

@Component({
  selector: 'app-ruta-conductor',
  templateUrl: './ruta-conductor.page.html',
  styleUrls: ['./ruta-conductor.page.scss'],
})
export class RutaConductorPage implements OnInit {
  ride: any = {
    destination: '', // Se llenará con el parámetro de la ruta
  };

  startPosition = { lat: -36.79448680693151, lng: -73.06436871720969 }; // Nueva posición de inicio
  endPosition: any;

  map: any;
  directionsService: any;
  directionsRenderer: any;
  searchQuery: string = '';
  suggestions: string[] = [];

  constructor(private navCtrl: NavController, private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    // Obtener parámetros de consulta
    this.route.queryParams.subscribe(params => {
      this.ride.destination = params['location']; // Asignar el destino desde los parámetros
      this.updateDestinationCoordinates(this.ride.destination); // Actualiza las coordenadas del destino
    });
    
    this.initMap(); // Inicializa el mapa
  }
  
  goBack() {
    this.navCtrl.back();
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
      this.placeMarkers(); // Coloca los marcadores si hay una posición de destino
    }
  }

  calculateAndDisplayRoute() {
    if (!this.endPosition) return; // Si no hay destino, no calcules la ruta

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
      title: 'Inicio (Ubicación Fija)',
    });

    if (this.endPosition) {
      new google.maps.Marker({
        position: this.endPosition,
        map: this.map,
        title: 'Destino: ' + this.ride.destination,
      });
    }
  }

  onSearchChange() {
    if (this.searchQuery.length < 2) {
      this.suggestions = []; // Limpia las sugerencias si el input es corto
      return;
    }

    const service = new google.maps.places.AutocompleteService();
    service.getPlacePredictions({ input: this.searchQuery }, (predictions: any, status: any) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
        this.suggestions = predictions.map((prediction: any) => prediction.description); // Muestra las sugerencias
      }
    });
  }

  selectSuggestion(suggestion: string) {
    this.ride.destination = suggestion; // Establece el nuevo destino
    this.updateDestinationCoordinates(suggestion); // Actualiza las coordenadas y la ruta
    this.suggestions = []; // Limpia las sugerencias
    this.searchQuery = ''; // Limpia el campo de búsqueda
  }

  updateDestinationCoordinates(destination: string) {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: destination }, (results: any, status: any) => {
      if (status === google.maps.GeocoderStatus.OK && results[0]) {
        this.endPosition = results[0].geometry.location; // Obtiene la ubicación del destino
        this.calculateAndDisplayRoute(); // Calcula la ruta a la nueva ubicación
        this.placeMarkers(); // Coloca el marcador del nuevo destino
      } else {
        window.alert('No se pudo encontrar el destino: ' + status);
      }
    });
  }

  navigateToChat() {
    this.router.navigate(['/chat']); // Cambia '/chat' a la ruta correspondiente de tu página de chat
  }

  goHome() {
    this.navCtrl.navigateRoot('/home'); // Cambia '/home' a la ruta correspondiente de tu página de inicio
  }
}
