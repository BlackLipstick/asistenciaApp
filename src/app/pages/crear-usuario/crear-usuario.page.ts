import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { ApisService } from 'src/app/services/apis.service';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-crear-usuario',
  templateUrl: './crear-usuario.page.html',
  styleUrls: ['./crear-usuario.page.scss'],
})
export class CrearUsuarioPage implements OnInit {

  mdl_correo: string = '' ;
  mdl_contrasena: string = '' ;
  mdl_nombre: string = '' ;
  mdl_apellido: string = '' ;
  mdl_carrera: string = '' ;
  v_visible = false;
  v_mensaje: string = '';
  isAlertOpen = false;
  alertButtons = ['OK'];


  constructor(private db: DbService, private router: Router, private api: ApisService) { }

  ngOnInit() {
  }

  async almacenarUsuario() {
    let datos = this.api.creacionUsuario(
      this.mdl_correo, this.mdl_contrasena,
      this.mdl_nombre, this.mdl_apellido,
      this.mdl_carrera
    );
    let respuesta = await lastValueFrom(datos);
    let json_texto = JSON.stringify(respuesta);
    let json = JSON.parse(json_texto);

    if(json.status == "success") {
      this.v_mensaje = json.message;
      this.isAlertOpen = true;
      this.db.almacenarUsuario(
        this.mdl_correo,
        this.mdl_contrasena,
        this.mdl_nombre,
        this.mdl_apellido,
        this.mdl_carrera,
      );
      setTimeout(() => {
          this.isAlertOpen = false;
          this.router.navigate(['login'], { replaceUrl: true })
      }, 3000);
    } else {
      console.log("SQ: Error al Crear Usuario: " + json.message)
      this.v_visible = true;
      this.v_mensaje =  json.message;
    }
  }

}
