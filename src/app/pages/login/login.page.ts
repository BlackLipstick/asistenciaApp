import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { ApisService } from 'src/app/services/apis.service';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  cantidad: string = '';
  mdl_correo: string = '';
  mdl_contrasena: string = ''; 

  constructor(private router: Router, private db: DbService, private api: ApisService) { }

  navegarCrearUsuario() {
    this.router.navigate(['crear-usuario']);
  }

  ngOnInit(): void {
    
  }

// Función para login desde API
async login() {
  try {
    // Login API
    let datos = this.api.loginUsuario(this.mdl_correo, this.mdl_contrasena);
    let respuesta = await lastValueFrom(datos);
    let json_texto = JSON.stringify(respuesta);
    let json = JSON.parse(json_texto);
    if(json.status == "success") {
      // Aquí guardamos el correo en localStorage
      localStorage.setItem('usuarioCorreo', this.mdl_correo);
      console.log('Correo guardado en localStorage:', this.mdl_correo); // Verificamos si se guarda correctamente

      setTimeout(() => {
        // Navegar a la página principal
        this.router.navigate(['principal'], { replaceUrl: true });
      }, 3000);
      
      // Almacenar sesión, si es necesario
      await this.db.almacenarSesion(this.mdl_correo, this.mdl_contrasena);
    } else {
      console.log("SQ, API: Error al Iniciar Sesión: " + json.message );
    }
  } catch (error) {
    console.error("SQ, API: Error al consumir API", error);
  }
}



}
