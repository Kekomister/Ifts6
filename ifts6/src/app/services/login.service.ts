import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoginService{

  private usuario_Comun = {nombre_Usuario : "z", conectado : false};
  private admin = {nombre_Usuario : "Admin", clave : "admin123", conectado : false};

  constructor() {}

  iniciarConectado(){
    //console.log(localStorage.getItem('Login'));
    let u = JSON.parse(localStorage.getItem('Login'));
    this.setConectado(u.nombre_Usuario,u.conectado);
    this.admin.conectado = JSON.parse(localStorage.getItem('Admin'));
    console.log(this.usuario_Comun);
  }

  getConectado(){
    return this.usuario_Comun;
  }

  setConectado(nom : string, bool : boolean){
    this.usuario_Comun.conectado = bool;
    this.usuario_Comun.nombre_Usuario = nom;
  }

  getAdmin(){
    return this.admin;
  }

  setAdmin(bool : boolean){
    this.admin.conectado = bool;
  }
}
