import { Component } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FirebaseService } from 'src/app/services/firebase.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-conductor',
  templateUrl: './conductor.page.html',
  styleUrls: ['./conductor.page.scss'],
})
export class ConductorPage {
  // Variables para el viaje
  selectedLocation: string = '';
  startDateTime: string = new Date().toISOString();
  seats: number = 1;
  cost: number = 500;
  costType: 'fixed' | 'perKm' = 'fixed';

  userId: string = '';
  plate: string = '';

  constructor(
    private navCtrl: NavController,
    private alertController: AlertController,
    private afAuth: AngularFireAuth,
    private firebaseService: FirebaseService,
    private route: ActivatedRoute
  ) {}
  holidays: string[] = [
    '2024-09-18', // Ejemplo de feriado (puedes añadir más fechas)
    '2024-12-25',
    '2024-01-01'
  ];

  async getUserId() {
    const user = await this.afAuth.currentUser;
    if (user) {
      this.userId = user.uid;
    }
  }

  async validateFields(): Promise<boolean> {
    if (!this.selectedLocation || !this.startDateTime || this.seats <= 0 || this.cost <= 0) {
      const errorAlert = await this.alertController.create({
        header: 'Error',
        message: 'Por favor completa todos los campos con valores válidos.',
        buttons: ['OK'],
      });
      await errorAlert.present();
      return false;
    }
    return true;
  }

  async offerTransport() {
    const isValid = await this.validateFields();
    if (!isValid) return;

    await this.getUserId();

    const tripData = {
      location: this.selectedLocation,
      startDateTime: this.startDateTime,
      seats: this.seats,
      cost: this.cost,
      costType: this.costType,
    };

    await this.firebaseService.saveTransportData(this.userId, this.plate, tripData);

    const successAlert = await this.alertController.create({
      header: 'Éxito',
      message: 'Tu transporte fue ofrecido con éxito.',
      buttons: [
        {
          text: 'Ir a Mis Viajes',
          handler: () => {
            this.navCtrl.navigateForward('/viajes');
          },
        },
      ],
    });

    await successAlert.present();
  }

  goBack() {
    this.navCtrl.back();
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      if (params && params['plate']) {
        this.plate = params['plate'];
        console.log('Patente recibida:', this.plate);
      } else {
        console.log('No se pasó la patente');
      }
    });
  }

  // Disable Sundays and holidays
  getCurrentDate(): string {
    return new Date().toISOString(); // Fecha actual en formato ISO
  }

  // Función para obtener la fecha máxima (por ejemplo, un año más)
  getMaxDate(): string {
    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() + 1);  // Establecer el máximo a un año desde la fecha actual
    return maxDate.toISOString();
  }

  // Función que valida si un día es domingo
  isSunday(date: string): boolean {
    const selectedDate = new Date(date);
    return selectedDate.getDay() === 0; // 0 corresponde al domingo
  }

  // Función para validar si la fecha es un día feriado
  isHoliday(date: string): boolean {
    return this.holidays.includes(date.split('T')[0]); // Compara la fecha sin la parte de la hora
  }

  // Evento que se dispara cuando la fecha cambia
  onDateChange(event: any) {
    // Si se selecciona un domingo o feriado, restablecemos la fecha
    if (this.isSunday(event.detail.value) || this.isHoliday(event.detail.value)) {
      this.startDateTime = '';  // Restablecer el valor
      alert('No puedes seleccionar domingos o feriados.');
    }
  }
  
}
