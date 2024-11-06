import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Usuario } from 'src/app/interfaces/iusuario';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {
  currentUser: Usuario | null = null;
  isEditing: boolean = false;
  imageFile: File | null = null;

  constructor(
    private navCtrl: NavController,
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private storage: AngularFireStorage
  ) {}

  ngOnInit() {
    this.afAuth.authState.subscribe(async (user) => {
      if (user) {
        const userRef = this.firestore.collection('users').doc(user.uid);
        const userDoc = await userRef.get().toPromise();

        if (userDoc.exists) {
          this.currentUser = userDoc.data() as Usuario;
        } else {
          console.log('No se encontraron datos del usuario.');
        }
      } else {
        console.log('Usuario no logueado');
      }
    });
  }

  onFileSelected(event: any) {
    this.imageFile = event.target.files[0];
  }

  async saveChanges() {
    if (this.currentUser) {
      const user = await this.afAuth.currentUser;
      if (user) {
        if (this.imageFile) {
          const filePath = `profileImages/${user.uid}`;
          const fileRef = this.storage.ref(filePath);
          const uploadTask = this.storage.upload(filePath, this.imageFile);

          uploadTask.snapshotChanges().pipe(
            finalize(async () => {
              const downloadURL = await fileRef.getDownloadURL().toPromise();
              this.currentUser!.profileImage = downloadURL;
              await this.updateUserData(user.uid);
              this.isEditing = false;
              this.imageFile = null;
            })
          ).subscribe();
        } else {
          await this.updateUserData(user.uid);
          this.isEditing = false;
        }
      }
    }
  }

  async updateUserData(uid: string) {
    await this.firestore.collection('users').doc(uid).update({
      nombre: this.currentUser!.nombre,
      apellido: this.currentUser!.apellido,
      correo: this.currentUser!.correo,
      username: this.currentUser!.username,
      profileImage: this.currentUser!.profileImage || null
    });
    console.log('Datos actualizados correctamente');
  }

  editProfile() {
    this.isEditing = true;
  }

  goBack() {
    this.navCtrl.navigateBack('/home');
  }
}
