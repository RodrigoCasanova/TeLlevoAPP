import { Component } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-conductor',
  templateUrl: './conductor.page.html',
  styleUrls: ['./conductor.page.scss'],
})
export class ConductorPage {
  startDateTime: string = '';
  selectedLocation: string = '';
  seats: number = 1;
  cost: number = 500;
  costType: 'perKm' | 'fixed' = 'fixed';

  constructor(private navCtrl: NavController, private alertController: AlertController) {}

  // Método para regresar a la página anterior
  goBack() {
    this.navCtrl.back();
  }

  async offerTransport() {
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
