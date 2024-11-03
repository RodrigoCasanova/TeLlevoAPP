import { Component } from '@angular/core';
import { LocaldbService } from 'src/app/services/localdb.service';
import { NavController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-conductor',
  templateUrl: './conductor.page.html',
  styleUrls: ['./conductor.page.scss'],
})
export class ConductorPage {
  // Variables para el viaje
  selectedLocation: string = '';
  startDateTime: string = new Date().toISOString(); // Inicializa con la fecha y hora actual
  seats: number = 1; // Número de asientos inicial
  cost: number = 500;  // Costo inicial
  costType: 'fixed' | 'perKm' = 'fixed';  // Tipo de costo inicial

  constructor(
    private localDbService: LocaldbService, 
    private navCtrl: NavController,
    private alertController: AlertController
  ) {}

  // Método para regresar a la página anterior
  goBack() {
    this.navCtrl.back();
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
      return false;
    }
    return true; // Todos los campos son válidos
  }

  // Método para ofrecer transporte
  async offerTransport() {
    const isValid = await this.validateFields();
    if (!isValid) return;

    const tripData = {
        location: this.selectedLocation,
        startDateTime: this.startDateTime,
        seats: this.seats,
        cost: this.cost,
        costType: this.costType,
    };

    let savedTrips = await this.localDbService.obtener('transportData');
    if (!Array.isArray(savedTrips)) {
        savedTrips = [];
    }

    savedTrips.push(tripData);
    await this.localDbService.guardar('transportData', savedTrips);

    console.log('Viajes guardados:', savedTrips); // Log para verificar los viajes guardados

    const successAlert = await this.alertController.create({
        header: 'Éxito',
        message: 'Tu transporte fue ofrecido con éxito.',
        buttons: [
            {
                text: 'Ir a Mis Viajes',
                handler: () => {
                    this.navCtrl.navigateForward('/viajes');
                }
            }
        ]
    });

    await successAlert.present();
}
}