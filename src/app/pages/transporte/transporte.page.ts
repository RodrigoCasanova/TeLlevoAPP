import { Component, OnInit } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { FirebaseService } from 'src/app/services/firebase.service'; // Import FirebaseService
import { map } from 'rxjs/operators'; // Importa 'map' desde 'rxjs/operators'

@Component({
  selector: 'app-transporte',
  templateUrl: './transporte.page.html',
  styleUrls: ['./transporte.page.scss'],
})
export class TransportePage implements OnInit {
  selectedLocation: string = 'all';
  rides: any[] = [];
  filteredRides: any[] = [];
  loading: boolean = false; // Para manejar el estado de carga

  // Propiedades para almacenar la información del auto
  carBrand: string = '';
  carModel: string = '';
  carColor: string = '';
  carPlate: string = '';

  // Lista de ubicaciones para filtrar
  locations: string[] = [
    'Concepción', 'Talcahuano', 'San Pedro', 'Lota', 'Coronel', 'Penco', 
    'Talcahuano', 'Hualpén', 'Chillán', 'Los Ángeles'
  ];

  constructor(
    private navCtrl: NavController,
    private firebaseService: FirebaseService, // Inyectar FirebaseService
    private alertController: AlertController,
    private route: ActivatedRoute // Asegúrate de tener esto
  ) {}

  async ngOnInit() {
    this.loading = true; // Activar la carga mientras se obtienen los viajes
    try {
      // Obtener el usuario actual
      const user = await this.firebaseService.currentUser;
      if (user) {
        // Obtener todos los viajes desde Firebase como un Observable
        this.firebaseService.getAllRides().subscribe({
          next: (allTrips: any[]) => {
            // Filtrar los viajes para excluir los del usuario actual
            this.rides = allTrips.filter(ride => ride.userId !== user.uid); 
            
            // Mostrar el ID de cada viaje en la consola
            this.rides.forEach(ride => {
              console.log('ID del transporte:', ride.id);  // Aquí se muestra el ID de cada viaje
            });
  
            this.filterRides(); // Filtrar los viajes después de excluir los del usuario actual
          },
          error: (error) => {
            console.error('Error al cargar los viajes:', error);
          },
          complete: () => {
            this.loading = false; // Desactivar la carga cuando se complete la operación
          }
        });
      }
    } catch (error) {
      console.error('Error al obtener los datos del usuario:', error);
    }
  }

  // Filtrar los viajes disponibles por ubicación
  filterRides() {
    const now = new Date();
    const filtered = this.rides.filter(ride => {
      const rideTime = new Date(ride.startDateTime); // Usamos el tiempo de inicio del viaje
      return (
        (this.selectedLocation === 'all' || ride.location.toLowerCase() === this.selectedLocation.toLowerCase()) &&
        rideTime >= now && // Verifica que la hora del viaje no haya pasado
        ride.seats > 0 // Verifica que haya asientos disponibles
      );
    });
    this.filteredRides = filtered; // Asigna los viajes filtrados
  }

  // Método para manejar la confirmación de solicitud de viaje
  async startRide(ride: any) {
    const alert = await this.alertController.create({
      header: 'Confirmación',
      message: '¿Estás seguro de que quieres solicitar este viaje?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Aceptar',
          handler: async () => {
            // Lógica para manejar la solicitud del viaje
            const proceedAlert = await this.alertController.create({
              header: 'Solicitud Aceptada',
              message: '¡Tu solicitud ha sido aceptada! ¿Quieres ir a tu viaje?',
              buttons: [
                {
                  text: 'Cancelar',
                  role: 'cancel',
                  cssClass: 'secondary',
                },
                {
                  text: 'Ir al Viaje',
                  handler: () => {
                    // Guardar la solicitud de viaje en localStorage
                    localStorage.setItem('requestedRide', JSON.stringify(ride));

                    // Redirigir a la página de detalles del viaje y pasar los datos
                    this.navCtrl.navigateForward('/viaje-pasajero', {
                      queryParams: { ride: JSON.stringify(ride) },
                    });
                  },
                },
              ],
            });
  
            await proceedAlert.present();
          },
        },
      ],
    });
  
    await alert.present();
  }

  // Función para volver a la página anterior
  goBack() {
    this.navCtrl.back();
  }
}
