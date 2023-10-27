import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConexionService {

  urlUsuario: string = "http://localhost:3000/usuario";
  urlPublicacion: string = "http://localhost:3000/publicacion";
  urlSector: string = "http://localhost:3000/sector";
}
