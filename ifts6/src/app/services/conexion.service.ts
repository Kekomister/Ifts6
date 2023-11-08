import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConexionService {

  urlUsuario: string = "http://localhost:3000/usuario";
  urlPublicacion: string = "http://localhost:3000/publicacion";
  urlSector: string = "http://localhost:3000/sector";
  urlPagina : string = "http://localhost:3000/pagina";
  urlPaginaConexion : string = "http://localhost:3000/pagina/conexion";

  constructor(private http : HttpClient){}

  public async traerPublicacion(id){
    return this.http.get(this.urlPublicacion + "/legible/" + id)
  }
}
