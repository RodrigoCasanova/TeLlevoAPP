export interface Usuario {
    username: string;
    password: string;
    nombre: string;
    apellido: string;
    correo: string; // Nuevo campo
    profileImage?: string; // Añadir esta propiedad como opcional
    fcmToken?: string; 
  }
  