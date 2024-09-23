import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage implements OnInit {
  name: string | undefined;
  email: string | undefined;
  phone: string | undefined;
  bio: string | undefined;
  city: string | undefined;
  vehicle: string | undefined;

  constructor(private modalCtrl: ModalController, private navParams: NavParams) { }

  ngOnInit() {
    // Recibir los datos actuales del perfil
    this.name = this.navParams.get('name');
    this.email = this.navParams.get('email');
    this.phone = this.navParams.get('phone');
    this.bio = this.navParams.get('bio');
    this.city = this.navParams.get('city');
    this.vehicle = this.navParams.get('vehicle');
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

  saveProfile() {
    // Guardar los datos editados y cerramos el modal
    this.modalCtrl.dismiss({
      name: this.name,
      email: this.email,
      phone: this.phone,
      bio: this.bio,
      city: this.city,
      vehicle: this.vehicle
    });
  }
}
