import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Publicacion } from '../classes/publicacion.model';
import { Usuario } from '../classes/usuario.model';
import { Pagina } from '../classes/pagina.model';
import { Sector } from '../classes/sector.model';

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
  
  // public traerPaginaCriterio(criterio : string){
  //   return this.http.get(this.urlPagina + "/" + criterio);
  // }

  public traerPagina(){
    return this.http.get<Pagina[]>(this.urlPagina);
  }



  public traerUsuarios(){
    return this.http.get<Usuario[]>(this.urlUsuario+"/legible");
  }

  public modificarUsuario(userTemp : Usuario){
    return this.http.put(this.urlUsuario + "/" + userTemp.id_Usuario, userTemp);
  }
  


  public traerSectores(){
    return this.http.get(this.urlPagina + "/sector/legible");
  }

  public crearSector(sec : Sector){
    return this.http.post(this.urlSector, sec);
  }

  public crearConexionSectoresPagina(pag : number,id? : number,){
    if(id != undefined){
      return this.http.post(this.urlPaginaConexion, {id_Pagina: pag});
    }else{
      return this.http.post(this.urlPaginaConexion, {id_Pagina: pag, sectores:id});
    }
  }



  public traerPublicaciones(){
    return this.http.get<Publicacion[]>(this.urlPublicacion + "/legible");
  }

  public traerPublicacion(id){
    return this.http.get(this.urlPublicacion + "/legible/" + id);
  }

  public traerPublicacionesUsuario(nombre){
    return this.http.get(this.urlPublicacion + "/usuario/legible/" + nombre);
  }

  public modificarPublicacion(id : number, formData : FormData){
    return this.http.put(this.urlPublicacion + "/" + id, formData);
  }

  public modificarPublicacionSinImagen(id : number, formData : FormData){
    return this.http.put(this.urlPublicacion + "/sinImagen/" + id, formData);
  }
}
