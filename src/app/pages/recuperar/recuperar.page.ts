import { Component} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http'; // Importar HttpClient para hacer la petición HTTP

@Component({
  selector: 'app-recuperar',
  templateUrl: './recuperar.page.html',
  styleUrls: ['./recuperar.page.scss'],
})
export class RecuperarPage{
  recuperarForm!: FormGroup;  // Usamos '!' para indicar que se inicializa en el constructor/ ngOnInit
  loading: boolean = false;  // Variable para manejar el estado de carga
  successMessage: string = '';  // Mensaje de éxito
  errorMessage: string = '';    // Mensaje de error

  private apiUrl = 'https://tu-api-url.com/auth';  // URL de tu API para recuperación

  constructor(private formBuilder: FormBuilder, private http: HttpClient, private navCtrl: NavController) {
    // Inicializamos el formulario en el constructor
    this.recuperarForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
    
  }
  goBack() {
    this.navCtrl.back();
  }
  onSubmit() {
    if (this.recuperarForm && this.recuperarForm.valid) {  // Verificamos que el formulario sea válido
      this.loading = true;  // Inicia el indicador de carga
      const email = this.recuperarForm.get('email')?.value;  // Usa '?.' para evitar el error de null

      if (email) {
        // Hacer la petición HTTP directamente desde aquí
        this.http.post(`${this.apiUrl}/recuperar`, { email }).subscribe(
          () => {
            this.loading = false;  // Detiene el indicador de carga
            this.successMessage = 'Se enviaron las instrucciones a su correo electrónico.';
            this.errorMessage = '';  // Limpia cualquier mensaje de error
          },
          (error) => {
            this.loading = false;  // Detiene el indicador de carga
            this.successMessage = '';  // Limpia cualquier mensaje de éxito
            this.errorMessage = 'Hubo un problema al enviar el correo. Por favor, intente nuevamente.';
          }
        );
      }
    }
  }
}
