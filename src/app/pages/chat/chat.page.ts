import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage {
  messages = [
    { senderId: '1', senderName: 'Pasajero', text: 'Hola, estoy cerca', timestamp: '10:30 AM' },
    { senderId: '2', senderName: 'Conductor', text: '¡Perfecto, gracias!', timestamp: '10:32 AM' }
  ];
  
  newMessage: string = '';
  currentUserId: string = '2'; // Simulación del ID del usuario actual (Pasajero)

  constructor(private navCtrl: NavController) {}

  sendMessage() {
    if (this.newMessage.trim()) {
      this.messages.push({
        senderId: this.currentUserId,
        senderName: this.currentUserId === '1' ? 'Conductor' : 'Pasajero',
        text: this.newMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
      this.newMessage = '';
    }
  }

  goBack() {
    this.navCtrl.back();
  }
}
