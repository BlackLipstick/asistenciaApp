import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DbService } from 'src/app/services/db.service';



@Component({
  selector: 'app-principal',
  templateUrl: './principal.page.html',
  styleUrls: ['./principal.page.scss'],
})
export class PrincipalPage implements OnInit {
  usuario: any = {
    nombre: '',
    apellido: '',
    carrera: ''
  };

  constructor(private db: DbService, private router: Router) { }

  async ngOnInit() {
    await this.cargarDatosPerfil();
  }

  async cargarDatosPerfil() {
    try {
      const correo = localStorage.getItem('usuarioCorreo');
      
      if (correo) {
        const datosUsuario = await this.db.obtenerDatosUsuario(correo); 
        if (datosUsuario) {
          this.usuario = datosUsuario;
          console.log("SQ: Datos de perfil cargados correctamente");
        } else {
          console.log("SQ: No se encontraron datos para el usuario.");
        }
      } else {
        console.error("SQ: No se encontró el correo del usuario en el almacenamiento.");
      }
    } catch (error) {
      console.error("SQ: Error al cargar los datos del perfil", error);
    }
  }
  
  
  actualizarDatos() {
    this.router.navigate(['actualizar-datos']);
  }

  irAsistencia() {
    this.router.navigate(['asistencia']);
  }
}
