import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/app/services/firebase.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { DatePipe } from '@angular/common';
import { NavController } from '@ionic/angular';

interface ITransporte {
  id: string;
  userId: string;
  carId?: string;
  cost: number;
  costType: string;
  createdAt: string;
  location: string;
  seats: string;
  startDateTime: string;
}

@Component({
  selector: 'app-viajes',
  templateUrl: './viajes.page.html',
  styleUrls: ['./viajes.page.scss'],
})
export class ViajesPage implements OnInit {
  userTransports: ITransporte[] = [];
  userId: string | null = null;

  constructor(
    private firebaseService: FirebaseService,
    private afAuth: AngularFireAuth,
    private router: Router,
    private datePipe: DatePipe,
    private navCtrl: NavController
  ) {}

  ngOnInit() {
    this.afAuth.currentUser.then((user) => {
      this.userId = user?.uid || null;
    });
  }

  ionViewWillEnter() {
    if (this.userId) {
      this.loadUserTransports();
    }
  }

  async loadUserTransports() {
    try {
      if (this.userId) {
        const transports = await this.firebaseService.getUserTransports(this.userId);

        this.userTransports = transports.map((transport: any) => ({
          id: transport.id || '',
          userId: transport.userId,
          carId: transport.carId || '',
          cost: transport.cost,
          costType: transport.costType,
          createdAt: transport.createdAt,
          location: transport.location,
          seats: transport.seats,
          startDateTime: this.datePipe.transform(transport.startDateTime, 'dd/MM/yyyy HH:mm') || 'Sin Hora',
        }));
      }
    } catch (error) {
      console.error('Error al cargar los viajes:', error);
    }
  }

  goToViajeConductor(transportId: string) {
    const selectedTransport = this.userTransports.find(transport => transport.id === transportId);

    if (selectedTransport) {
      this.router.navigate(['/viaje-conductor'], {
        queryParams: {
          startLocation: selectedTransport.location,
          destination: 'Duoc UC Concepcion',
          departureTime: selectedTransport.startDateTime,
          cost: selectedTransport.cost,
          availableSeats: selectedTransport.seats
        },
      });
    }
  }

  goBack() {
    this.router.navigate(['/menu-conductor']);
  }

  goHome() {
    this.router.navigate(['/home']);
  }
}
