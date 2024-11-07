import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { HttpClientModule } from '@angular/common/http';
import { GoogleMapsModule } from '@angular/google-maps';
import { CalendarModule } from 'angular-calendar'; // Importa el módulo
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { IonicStorageModule } from '@ionic/storage-angular';

// ====== FIREBASE ======
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { environment } from 'src/environments/environment';
import { DatePipe } from '@angular/common';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    IonicStorageModule.forRoot(),
    GoogleMapsModule,
    CalendarModule, // Si usas calendario, este módulo se mantiene
    RouterModule,
    // Inicialización de Firebase
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,   // Para la autenticación
    AngularFirestoreModule   // Para Firestore
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy,   }, DatePipe
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // Agrega esta línea para evitar errores con elementos personalizados
})
export class AppModule {}
