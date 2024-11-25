import { Component, OnInit } from '@angular/core';
import { Barcode, BarcodeScanner } from '@capacitor-mlkit/barcode-scanning'; 
import { AlertController } from '@ionic/angular';
import { lastValueFrom } from 'rxjs';
import { ApisService } from 'src/app/services/apis.service';
import { DbService } from 'src/app/services/db.service';
import { ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-asistencia',
  templateUrl: './asistencia.page.html',
  styleUrls: ['./asistencia.page.scss'],
})
export class AsistenciaPage implements OnInit {

  // Variables para manejar las asistencias
  asistencias: any [] = [];
  porcentajeAsistencia: number = 0;
  v_mensaje: string = '';

  // Variables del scanner QR
  isSupported = false;
  isAlertOpen = false;
  barcodes: Barcode[] = []; 

  // Variables para manejar la información de clases
  correo: string = '';
  nombreClase: string = '';
  curso_sigla: string = '';

  constructor(
    private alertController: AlertController, 
    private db: DbService, 
    private http: HttpClient,
    private api: ApisService, 
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    const data = await this.db.obtenerSesion();
    this.correo = data.correo;
    BarcodeScanner.isSupported().then((result: { supported: boolean; }) => {
      this.isSupported = result.supported;
    });
    this.infoAsistencia();
  }


// obtener información de asistencia
async infoAsistencia() {
  try {
    const correo = this.correo; 
    const response = await fetch(`https://www.s2-studio.cl/api_duoc/usuario/asistencia_obtener?correo=${correo}`);

    const data = await response.json();

    // Procesar la información para calcular el porcentaje de asistencia
    this.asistencias = data.map((asistencia: any) => {
      const total = asistencia.presente + asistencia.ausente;
      const porcentajeAsistencia = total > 0 ? (asistencia.presente / total) * 100 : 0;
      
      return {
        curso_sigla: asistencia.curso_sigla,
        curso_nombre: asistencia.curso_nombre,
        presente: asistencia.presente,
        ausente: asistencia.ausente,
        porcentajeAsistencia: porcentajeAsistencia,
        fechas: [], 
        mostrarMas: false 
      };
    });
  } catch (error) {
    this.v_mensaje = 'Hubo un problema al conectar con la API.';
    console.error(error);
  }
}


  async scan() {
    try {
      await BarcodeScanner.installGoogleBarcodeScannerModule();
    } catch (e) {
      console.log("SQ: modulos no instalados")
    }

    let codigo_texto = await BarcodeScanner.scan();

    if (codigo_texto.barcodes.length > 0) {
      const codigoQR = codigo_texto.barcodes[0].displayValue;
      const [sigla, fecha] = codigoQR.split(';');
  
      if (sigla && fecha) {
        this.marcarAsistencia(sigla, this.correo, fecha);
      } else {
        this.presentAlert('Código QR no válido. Asegúrate de escanear un código con el formato correcto.', 'Error de QR');
      }
    } else {
      this.presentAlert('No se detectó ningún código QR', 'Error de QR');
    }
  }

async marcarAsistencia(sigla: string, correo: string, fecha: string) {
  try {
    const body = {
      sigla: sigla,
      correo: correo,
      fecha: fecha
    };

    const response = await fetch('https://www.s2-studio.cl/api_duoc/usuario/marcar_asistencia', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    const data = await response.json();

    if (data.status === 'OK') {
      this.v_mensaje = data.message; // Mensaje de éxito
    } else {
      this.v_mensaje = 'Error al marcar la asistencia.';
    }
  } catch (error) {
    this.v_mensaje = 'Hubo un problema al conectar con la API.';
    console.error(error);
  }
}

  

  // Función para obtener la asistencia usando el código QR
  async obtenerAsistencia(codigoQR: string) {
    const cursoSigla = codigoQR; 
    this.curso_sigla = cursoSigla;  
    let datos = this.api.obtenerAsistencia(this.correo, this.curso_sigla);
    let respuesta = await lastValueFrom(datos);
    let json_texto = JSON.stringify(respuesta);
    let json = JSON.parse(json_texto);

    if (json && json[0]) {
      let asistencia = json[0];
      asistencia.porcentajeAsistencia = (asistencia.presente / (asistencia.presente + asistencia.ausente)) * 100;

      this.porcentajeAsistencia = asistencia.porcentajeAsistencia;

      this.nombreClase = asistencia.curso_nombre;

      this.cdr.detectChanges();
    }
  }

  async requestPermissions(): Promise<boolean> {
    const { camera } = await BarcodeScanner.requestPermissions();
    return camera === 'granted' || camera === 'limited';
  }

  async presentAlert(mensaje: string, encabezado: string = 'Información'): Promise<void> {
    const alert = await this.alertController.create({
      header: encabezado,
      message: mensaje,
      buttons: ['OK'],
    });
    await alert.present();
  }
  
}
