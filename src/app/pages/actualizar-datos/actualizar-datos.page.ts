import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { ApisService } from 'src/app/services/apis.service';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-actualizar-datos',
  templateUrl: './actualizar-datos.page.html',
  styleUrls: ['./actualizar-datos.page.scss'],
})

export class ActualizarDatosPage implements OnInit {

  correo: string = '';
  contrasena: string = '';
  mdl_actual: string = '';
  mdl_contrasena_nueva: string = '';
  mdl_confirmacion: string = '';
  v_visible = false;
  v_mensaje = '';
  mdl_carrera_nueva: string = '';
  mdl_correo_actual: string = '';
  isAlertOpen = false;
  alertButtons = ['OK'];


  constructor(private db: DbService, private router: Router, private api: ApisService) { }

  ngOnInit() {
    this.db.obtenerSesion().then(data => {
      this.correo = data.correo;
      this.contrasena = data.contrasena;
      console.log("SQ: Credenciales Obtenidas de de tabla usuario: ")
      console.log("SQ: Correo:  " + this.correo)
      console.log("SQ: Contraseña: " + this.contrasena)
      this.mdl_correo_actual = this.correo
    })
  }

  async actualizarUsuario() {
    let datos = this.api.modificacionUsuario(
      this.mdl_correo_actual,
      this.mdl_contrasena_nueva,
      this.mdl_carrera_nueva
    );
    let respuesta = await lastValueFrom(datos);
    let json_texto = JSON.stringify(respuesta);
    let json = JSON.parse(json_texto);

    if(json.status == "success") {
      this.v_visible = false;
      this.isAlertOpen = true;
      this.v_mensaje = json.message;
      await this.db.verificarUsuario(this.correo);
      this.db.actualizarDatos(this.mdl_contrasena_nueva, this.mdl_carrera_nueva, this.correo, this.contrasena)
      /* console.log("Datos actualizados en la base de datos") */
      setTimeout(() => {
        this.isAlertOpen = false;
        this.router.navigate(['login'], { replaceUrl: true});
      }, 3000)
      this.cerrarSesion();
    } else {
      this.v_visible = true;
      this.v_mensaje = json.message;
      }
  }

  cerrarSesion() {
    this.db.eliminarSesion()
    this.router.navigate(['login'], { replaceUrl: true })
  }

  async actualizarDatos () {
  }

}
