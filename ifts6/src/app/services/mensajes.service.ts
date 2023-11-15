import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class MensajesService {

  constructor() { }

  success(titulo: string, textoBoton: string) {
    Swal.fire({
      title: titulo,
      confirmButtonText: textoBoton,
      icon: 'success',
      allowEnterKey: true
    });
  }

  success2(titulo: string, textoBoton: string, wide: number, pad: string, col: string, backG: string, backD: string) {
    Swal.fire({
      title: titulo,
      confirmButtonText: textoBoton,
      icon: 'success',
      width: wide,
      padding: pad,
      color: col,
      background: backG,
      backdrop: backD,
      allowEnterKey: true
    });
  }

  error(titulo: string, texto: string, textoBoton: string) {
    Swal.fire({
      title: titulo,
      text: texto,
      icon: 'error',
      confirmButtonText: textoBoton,
      allowEnterKey: true
    })
  }

  preguntar(titulo: string, texto: string, textoBotonSi: string, textoBotonNo: string) {
    return Swal.fire({
      title: titulo,
      text: texto,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: textoBotonSi,
      cancelButtonText: textoBotonNo,
      allowEnterKey: true,
      timer: 30000,
      timerProgressBar: true,
    })
  }

  info(titulo: string, textoBoton: string) {
    Swal.fire({
      title: titulo,
      confirmButtonText: textoBoton,
      icon: 'info',
      allowEnterKey: true
    });
  }

  consulta() {
    return Swal.fire({
      title: 'Desea enviar la consulta?',
      showDenyButton: true,
      confirmButtonText: 'Si',
      denyButtonText: 'No',
    })
  }

}
