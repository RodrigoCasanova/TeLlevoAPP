import { Component } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth';  // Para obtener el usuario logueado
import { FirebaseService } from 'src/app/services/firebase.service';  // Servicio Firebase para interactuar con la base de datos
import { ActivatedRoute } from '@angular/router';  // Para obtener los queryParams

@Component({
  selector: 'app-conductor',
  templateUrl: './conductor.page.html',
  styleUrls: ['./conductor.page.scss'],
})
export class ConductorPage {
  // Variables para el viaje
  selectedLocation: string = '';  // Ubicación de destino seleccionada
  startDateTime: string = new Date().toISOString(); // Fecha y hora de inicio
  seats: number = 1; // Número de asientos
  cost: number = 500;  // Costo por persona o por kilómetro
  costType: 'fixed' | 'perKm' = 'fixed';  // Tipo de costo ('fixed' o 'perKm')

  userId: string = '';  // ID del usuario logueado
  plate: string = '';   // Patente del auto seleccionada (lo recibimos a través de queryParams)

  constructor(
    private navCtrl: NavController,
    private alertController: AlertController,
    private afAuth: AngularFireAuth,  // Servicio de Firebase para autenticación
    private firebaseService: FirebaseService,  // Servicio Firebase para interactuar con la base de datos
    private route: ActivatedRoute  // Para obtener los queryParams de la URL
  ) {}

  // Método para obtener el ID del usuario logueado
  async getUserId() {
    const user = await this.afAuth.currentUser;  // Obtener el usuario logueado
    if (user) {
      this.userId = user.uid;  // Guardar el UID del usuario
    }
  }

  // Método para validar los campos antes de ofrecer transporte
  async validateFields(): Promise<boolean> {
    if (!this.selectedLocation || !this.startDateTime || this.seats <= 0 || this.cost <= 0) {
      const errorAlert = await this.alertController.create({
        header: 'Error',
        message: 'Por favor completa todos los campos con valores válidos.',
        buttons: ['OK']
      });
      await errorAlert.present();
      return false;  // Si algún campo no es válido, retorna false
    }
    return true;  // Todos los campos son válidos
  }

  // Método para ofrecer transporte
  async offerTransport() {
    const isValid = await this.validateFields();
    if (!isValid) return;  // Si los campos no son válidos, no continuar
  
    // Primero obtenemos el ID del usuario logueado
    await this.getUserId();
  
    // Datos del viaje
    const tripData = {
      location: this.selectedLocation,
      startDateTime: this.startDateTime,
      seats: this.seats,
      cost: this.cost,
      costType: this.costType,
    };
  
    // Enviar la patente (plate) en lugar de carId
    await this.firebaseService.saveTransportData(this.userId, this.plate, tripData);
  
    // Mostrar una alerta de éxito
    const successAlert = await this.alertController.create({
      header: 'Éxito',
      message: 'Tu transporte fue ofrecido con éxito.',
      buttons: [
        {
          text: 'Ir a Mis Viajes',
          handler: () => {
            this.navCtrl.navigateForward('/viajes');  // Navegar a la página de viajes
          }
        }
      ]
    });
  
    await successAlert.present();  // Mostrar la alerta
  }

  // Regresar a la página anterior
  goBack() {
    this.navCtrl.back();
  }

  // Método para obtener la patente (plate) de los queryParams
  ngOnInit() {
    // Suscribirse a los queryParams y recibir la patente
    this.route.queryParams.subscribe(params => {
      if (params && params['plate']) {
        this.plate = params['plate'];  // Asignamos el valor recibido a la propiedad plate
        console.log('Patente recibida:', this.plate);  // Esto debería loguear el valor de la patente
      } else {
        console.log('No se pasó la patente');  // Si no se pasa la patente
      }
    });
  }
}
