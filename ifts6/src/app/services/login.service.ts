import { Injectable, OnInit } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoginService{

  private conectado : boolean = false;
  private admin = {nombre_Usuario : "Admin", clave : "admin123", conectado : false};

  constructor() {}

  iniciarConectado(){
    //console.log(localStorage.getItem('Login'));
    this.conectado = JSON.parse(localStorage.getItem('Login'));
    this.admin.conectado = JSON.parse(localStorage.getItem('Admin'));
  }

  getConectado(){
    return this.conectado;
  }

  setConectado(bool : boolean){
    this.conectado = bool;
  }

  getAdmin(){
    return this.admin;
  }

  setAdmin(bool : boolean){
    this.admin.conectado = bool;
  }
}
