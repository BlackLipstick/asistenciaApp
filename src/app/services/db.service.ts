import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';

@Injectable({
  providedIn: 'root'
})
export class DbService {
  private Db: SQLiteObject | undefined;  

  dbInstance: SQLiteObject | null = null;
  users: any[] = [];
  carreras: any [] = [];

  constructor(private sqlite: SQLite) {
    this.crearTablas();
  }

  crearTablas() {
    this.sqlite.create({
      name: 'data.db',
      location: 'default'
    })
    .then((db: SQLiteObject) => {
      db.executeSql('create table if not exists usuario (correo varchar(70), contrasena varchar(30), nombre varchar(30), apellido varchar(30), carrera varchar(30), sede varchar(30))',
      [])
        .then(() => console.log('SQ: TABLA USUARIO OK'))
        .catch(e => console.log('SQ: ERROR AL CREAR TABLA USUARIO: ' + JSON.stringify(e)));
    })
    .catch(e => console.log('SQ: ERROR AL CREAR O ABRIR BASE DE DATOS'));

    this.sqlite.create({
      name: 'data.db',
      location: 'default'
    })
    .then((db: SQLiteObject) => {
      db.executeSql('create table if not exists sesion (correo varchar(30), contrasena varchar(30))', [])
        .then(() => console.log('SQ: TABLA SESION CREADA CORRECTAMENTE'))
        .catch(e => console.log('SQ: ERROR AL CREAR TABLA SESION: ' + JSON.stringify(e)));
    })
    .catch(e => console.log('SQ: ERROR AL CREAR O ABRIR BASE DE DATOS'));

    this.sqlite.create({
      name: 'data.db',
      location: 'default'
    })
    .then((db: SQLiteObject) => {
      db.executeSql('create table if not exists asistencia (correo varchar(30), sigla varchar(30), fecha varchar(30))', [])
        .then(() => console.log('SQ: TABLA ASISTENCIA CREADA CORRECTAMENTE'))
        .catch(e => console.log('SQ: ERROR AL CREAR TABLA ASISTENCIA: ' + JSON.stringify(e)));
    })
    .catch(e => console.log('SQ: ERROR AL CREAR O ABRIR BASE DE DATOS'));
  }
  

  almacenarUsuario(correo: string, contrasena: string, nombre: string, apellido: string, carrera: string) {
    if (this.dbInstance) {
      this.dbInstance.executeSql('INSERT INTO usuario VALUES (?, ?, ?, ?, ?)', [correo, contrasena, nombre, apellido, carrera])
        .then(() => console.log('SQ: USUARIO ALMACENADO OK'))
        .catch(e => console.log('SQ: ERROR AL ALMACENAR USUARIO: ' + JSON.stringify(e)));
    } else {
      console.log('SQ: No hay instancia de base de datos disponible');
    }
  }
  

  async almacenarSesion(correo: string, contrasena: string) {
    try {
      const db = await this.sqlite.create({
        name: 'data.db',
        location: 'default'
      });
  
      await db.executeSql('delete from sesion', []);
      console.log("SQ: Sesión anterior Sobreescrita");
  
      await db.executeSql('insert into sesion values (?, ?)', [correo, contrasena]);
      console.log('SQ: SESION ALMACENADA OK');
    } catch (e) {
      console.log('SQ: ERROR AL ALMACENAR SESION: ' + JSON.stringify(e));
    }
  }


  loginUsuario(correo: string, contrasena: string) {
    return this.sqlite.create({
      name: 'data.db',
      location: 'default'
    })
    .then((db: SQLiteObject) => {
      return db.executeSql('select count(correo) as cantidad from usuario where correo = ? and contrasena = ?',
        [correo, contrasena])
        .then((data) => {
          return data.rows.item(0).cantidad;
        })
        .catch(e => console.log('SQ: ERROR AL REALIZAR LOGIN: ' + JSON.stringify(e)));
    })
    .catch(e => console.log('SQ: ERROR AL CREAR O ABRIR BASE DE DATOS' + JSON.stringify(e)));
  }


  validarSesion() {
    return this.sqlite.create({
      name: 'data.db',
      location: 'default'
    })
    .then((db: SQLiteObject) => {
      return db.executeSql('select count(correo) as cantidad from sesion', [])
        .then((data) => {
          return data.rows.item(0).cantidad;
        })
        .catch(e => console.log('SQ: ERROR AL VALIDAR SESIÓN: ' + JSON.stringify(e)));
    })
    .catch(e => console.log('SQ: ERROR AL CREAR O ABRIR BASE DE DATOS' + JSON.stringify(e)));
  }

  obtenerSesion() {
    return this.sqlite.create({
      name: 'data.db',
      location: 'default'
    })
    .then((db: SQLiteObject) => {
      return db.executeSql('select correo, contrasena from sesion', [])
        .then((data) => {
          let objeto: any = {};
          objeto.correo = data.rows.item(0).correo;
          objeto.contrasena = data.rows.item(0).contrasena;
          return objeto;
        })
        .catch(e => console.log('SQ: ERROR AL OBTENER SESIÓN: ' + JSON.stringify(e)));
    })
    .catch(e => console.log('SQ: ERROR AL CREAR O ABRIR BASE DE DATOS' + JSON.stringify(e)));
  }

  infoUsuario(correo: string, contrasena: string) {
    return this.sqlite.create({
      name: 'data.db',
      location: 'default'
    })
    .then((db: SQLiteObject) => {
      return db.executeSql('select correo, contrasena, nombre, apellido, carrera from usuario where correo = ? and contrasena = ?', [correo, contrasena])
        .then((data) => {
          let objeto: any = {};
          objeto.correo = data.rows.item(0).correo;
          objeto.contrasena = data.rows.item(0).contrasena;
          objeto.nombre = data.rows.item(0).nombre;
          objeto.apellido = data.rows.item(0).apellido;
          objeto.carrera = data.rows.item(0).carrera;

          return objeto
        })
        .catch(e => console.log('SQ: ERROR AL OBTENER INFO DE PERSONA: ' + JSON.stringify(e)));
    })
    .catch(e => console.log('SQ: ERROR AL CREAR O ABRIR BASE DE DATOS'));
  }

  cambiarContrasena(correo: string, contrasenaActual: string, nuevaContrasena: string) {
    this.sqlite.create({
      name: 'data.db',
      location: 'default'
    })
    .then((db: SQLiteObject) => {
      db.executeSql('update usuario set contrasena = ? where correo = ? and contrasena = ?', [nuevaContrasena, correo, contrasenaActual])
        .then(() => console.log('SQ: USUARIO MODIFICADO OK'))
        .catch(e => console.log('SQ: ERROR AL MODIFICAR CONTRASENA: ' + JSON.stringify(e)));
    })
    .catch(e => console.log('SQ: ERROR AL INGRESAR A BASE DE DATOS'));
  }

  eliminarSesion() {
    this.sqlite.create({
      name: 'data.db',
      location: 'default'
    })
    .then((db: SQLiteObject) => {
      db.executeSql('delete from sesion', [])
        .then(() => console.log('SQ: SESION ELIMINADA OK'))
        .catch(e => console.log('SQ: ERROR AL ELIMINAR SESION: ' + JSON.stringify(e)));
    })
    .catch(e => console.log('SQ: ERROR AL CREAR O ABRIR BASE DE DATOS'));
  }

  actualizarUsuario(correo: string, contrasena: string, nombre: string, apellido: string, carrera: string) {
    if (this.dbInstance) {
      this.dbInstance.executeSql(
        'UPDATE usuario SET correo = ?, contrasena = ?, nombre = ?, apellido = ?, carrera = ? WHERE correo = ? AND contrasena = ?',
        [correo, contrasena, nombre, apellido, carrera, correo, contrasena]
      )
      .then(() => console.log("SQ: Usuario Actualizado OK"))
      .catch(e => console.log('SQ: ERROR AL ACTUALIZAR USUARIO: ' + JSON.stringify(e)));
    } else {
      console.log('SQ: No hay instancia de base de datos disponible');
    }
  }
  

  actualizarDatos(contrasenaNueva: string, carrera: string, correo: string, contrasenaActual: string) {
    this.sqlite.create({
      name: 'data.db',
      location: 'default'
    })
    .then((db: SQLiteObject) => {
      console.log("SQ: Actualizando datos en la base de datos local...");
      return db.executeSql(
        'UPDATE usuario SET contrasena = ?, carrera = ? where correo = ? and contrasena = ?',
        [contrasenaNueva, carrera, correo, contrasenaActual]
      );
    })
    .then(() => console.log("SQ: Datos de Usuario Actualizado OK"))
    .catch(e => console.log('SQ: ERROR AL ACTUALIZAR USUARIO: ' + JSON.stringify(e)))
    .catch(e => console.log('SQ: ERROR AL CREAR O ABRIR BASE DE DATOS: ' + JSON.stringify(e)));
  }

  async verificarUsuario(correo: string) {
    try {
      const db = await this.sqlite.create({
        name: 'data.db',
        location: 'default'
      });
      const resultado = await db.executeSql('select count(*) as cantidad from usuario where correo= ? ',
        [correo]
      );
      const cantidad = resultado.rows.item(0).cantidad;
      return cantidad > 0;
    } catch (e) {
      console.log('SQ: Error al verificar Usuario ' + JSON.stringify(e));
      return false;
    }
  }

  async almacenarAsistencia(correo: string, sigla: string, fecha: string) {
    try {
      const db = await this.sqlite.create({
        name: 'data.db',
        location: 'default'
      });
      const res = await db.executeSql(
        'SELECT COUNT(*) AS count FROM asistencia WHERE correo = ? AND sigla = ? AND fecha = ?',
        [correo, sigla, fecha]
      );

      const count = res.rows.item(0).count;

      if (count > 0) {
        console.log('SQ, BD: Registro ya existente, no se inserta');
      } else {
        await db.executeSql(
          'INSERT INTO asistencia values (?, ?, ?)', [correo, sigla, fecha]
        )
        console.log('SQ: ASISTENCIA ALMACENADA OK');
      }
    } catch (e) {
      console.log('SQ: ERROR AL ALMACENAR ASISTENCIA: ' + JSON.stringify(e));
    }
  }

  async obtenerAsistencia(correo: string, sigla: string)  {
    try {
      const db = await this.sqlite.create({
        name: 'data.db',
        location: 'default'
      });
      const resultado = await db.executeSql(
        'SELECT sigla, fecha FROM asistencia WHERE correo = ? AND sigla = ?',
        [correo, sigla]
      );
      if (resultado.rows.length > 0) {
        const asistencia = [];
        for (let i = 0; i < resultado.rows.length; i++) {
          asistencia.push(resultado.rows.item(i));
        }
        console.log('SQ, DB: Asistencia obtenida: ' + JSON.stringify(asistencia));
        return asistencia;
      } else {
        console.log('SQ, DB: No se encontraron registros');
        return [];
      }
    } catch (e) {
      console.log('SQ, DB: Error al obtener asistencia' + JSON.stringify(e));
      throw e;
    }
  }

  async obtenerDatosUsuario(correo: string) {
    try {
      console.log("SQ: Recuperando datos del usuario por correo...");
  
      const resultado = await this.dbInstance?.executeSql(
        'SELECT nombre, apellido, carrera FROM usuario WHERE correo = ?',
        [correo]  // Usamos el correo del usuario
      );
  
      if (resultado && resultado.rows.length > 0) {
        const usuario = resultado.rows.item(0);
        console.log("SQ: Datos del usuario recuperados correctamente.");
        return usuario;
      } else {
        console.log("SQ: No se encontraron datos para el usuario.");
        return null;
      }
    } catch (e) {
      console.log('SQ, DB: Error al obtener asistencia' + JSON.stringify(e));
      throw e; // Lanza el error para que se pueda manejar externamente si es necesario
    }
  }
  
  
  
  
    
  
}