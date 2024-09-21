import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { EditProfilePage } from '../edit-profile/edit-profile.page'; // Importa la página del modal
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {
  name = 'Tu Nombre';
  email = 'tu-email@ejemplo.com';
  phone = '+56 9 1234 5678';
  bio = 'Estudiante de programación, apasionado por el desarrollo móvil y la tecnología.';
  city = 'Concepción';
  vehicle = 'Toyota Corolla 2020';

  constructor(private modalCtrl: ModalController, private navCtrl: NavController) { }

  ngOnInit() {
    this.name = localStorage.getItem('name') || 'Tu Nombre';
    this.email = localStorage.getItem('email') || 'tu-email@ejemplo.com';
    this.phone = localStorage.getItem('phone') || '+56 9 1234 5678';
    this.bio = localStorage.getItem('bio') || 'Estudiante de programación, apasionado por el desarrollo móvil y la tecnología.';
    this.city = localStorage.getItem('city') || 'Concepción';
    this.vehicle = localStorage.getItem('vehicle') || 'Toyota Corolla 2020';
  }

  async editProfile() {
    const modal = await this.modalCtrl.create({
      component: EditProfilePage,
      componentProps: {
        name: this.name,
        email: this.email,
        phone: this.phone,
        bio: this.bio,
        city: this.city,
        vehicle: this.vehicle
      }
    });

    modal.onDidDismiss().then((data) => {
      if (data.data) {
        // Actualizar el perfil con los datos editados
        this.name = data.data.name;
        this.email = data.data.email;
        this.phone = data.data.phone;
        this.bio = data.data.bio;
        this.city = data.data.city;
        this.vehicle = data.data.vehicle;
      }
    });

    await modal.present();
  }

  goBack() {
    // Función para regresar a la página anterior
    this.navCtrl.back();
  }
}
