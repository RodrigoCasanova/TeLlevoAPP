import { Component, OnInit } from '@angular/core';
import { LocaldbService } from 'src/app/services/localdb.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-viajes',
  templateUrl: './viajes.page.html',
  styleUrls: ['./viajes.page.scss'],
})
export class ViajesPage implements OnInit {
  tripsByDate: any[] = []; // Arreglo para almacenar los viajes organizados por fecha

  constructor(private navCtrl: NavController, private localDbService: LocaldbService) {}

  async ngOnInit() {
    // Cargar los viajes almacenados al inicializar la página
    const savedTrips = await this.localDbService.obtener('transportData');
    if (savedTrips) {
      this.organizeTripsByDate(savedTrips);
    }
  }

  organizeTripsByDate(savedTrips: any[]) {
    // Agrupar los viajes por fecha
    const tripsMap: { [key: string]: any[] } = {};

    savedTrips.forEach(trip => {
      const tripDate = new Date(trip.startDateTime).toDateString(); // Obtenemos la fecha en formato legible
      if (!tripsMap[tripDate]) {
        tripsMap[tripDate] = [];
      }
      tripsMap[tripDate].push({
        start: new Date(trip.startDateTime),
        tripData: trip,
      });
    });

    // Convertimos el objeto en un array ordenado por fecha
    this.tripsByDate = Object.entries(tripsMap).map(([date, events]) => ({
      date,
      events,
    })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  eventClicked(event: any): void {
    this.navCtrl.navigateForward('/viaje-conductor', {
      queryParams: {
        location: event.tripData.location,
        startDateTime: event.tripData.startDateTime,
        seats: event.tripData.seats,
        cost: event.tripData.cost,
        costType: event.tripData.costType,
      },
    });
  }

  // Método para regresar a la página anterior
  goBack() {
    this.navCtrl.back();
  }
}
