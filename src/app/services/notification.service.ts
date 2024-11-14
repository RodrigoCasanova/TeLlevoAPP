import { Injectable } from '@angular/core';
import { getMessaging, onMessage } from 'firebase/messaging';
import { LocalNotifications } from '@capacitor/local-notifications';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor() {
    this.listenToMessages();
  }

  // Método para escuchar mensajes de Firebase y mostrar notificación
  listenToMessages() {
    const messaging = getMessaging();
    onMessage(messaging, async (payload) => {
      console.log('Mensaje recibido: ', payload);
      await LocalNotifications.schedule({
        notifications: [
          {
            title: payload.notification?.title || 'Nueva Notificación',
            body: payload.notification?.body || 'Tienes un nuevo mensaje',
            id: Date.now(),
            schedule: { at: new Date(Date.now() + 1000) },
          },
        ],
      });
    });
  }
}
