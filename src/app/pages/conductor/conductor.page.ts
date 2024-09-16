import { Component } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-conductor',
  templateUrl: './conductor.page.html',
  styleUrls: ['./conductor.page.scss'],
})
export class ConductorPage {
  startDateTime: string = new Date().toISOString();
  selectedLocation: string = '';
  seats: number = 1;
  cost: number = 500;  // Costo inicial (puede ser fijo o por kilómetro)
  costType: 'perKm' | 'fixed' = 'fixed';  // Tipo de costo

  constructor(private navCtrl: NavController, private alertController: AlertController) {}

  // Método para regresar a la página anterior
  goBack() {
    this.navCtrl.back();
  }

  // Método para validar los datos antes de ofrecer transporte
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
    return true;
  }

  // Método para validar la fecha seleccionada
  async validateDate() {
    const selectedDate = new Date(this.startDateTime);
    const dayOfWeek = selectedDate.getDay(); // 0 = Domingo, 6 = Sábado

    if (dayOfWeek === 0) { // Si es domingo
      const alert = await this.alertController.create({
        header: 'Fecha inválida',
        message: 'No puedes seleccionar domingos.',
        buttons: ['OK']
      });
      await alert.present();
      
      // Restablecer el campo de fecha
      this.startDateTime = '';
    }
  }

  async offerTransport() {
    // Validar que los campos sean correctos antes de proceder
    const isValid = await this.validateFields();
    if (!isValid) return;

    // Validar la fecha seleccionada
    await this.validateDate();

    // Mostrar alerta de confirmación
    const confirmationAlert = await this.alertController.create({
      header: 'Confirmar',
      message: `¿Estás seguro de ofrecer transporte con los siguientes detalles?<br>
                Ubicación: ${this.selectedLocation}<br>
                Fecha y Hora: ${this.startDateTime}<br>
                Número de Asientos: ${this.seats}<br>
                Costo: ${this.cost} ${this.costType === 'perKm' ? 'por Kilómetro' : 'Fijo'}`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Confirmar',
          handler: async () => {
            // Mostrar la alerta de éxito
            const successAlert = await this.alertController.create({
              header: 'Éxito',
              message: 'Tu transporte fue ofrecido con éxito.',
              buttons: [
                {
                  text: 'Ir al Home',
                  handler: () => {
                    this.navCtrl.navigateRoot('/home'); // Cambia '/home' por la ruta de tu página de inicio
                  }
                }
              ]
            });

            await successAlert.present();
          },
        },
      ],
    });

    await confirmationAlert.present();
  }
}
