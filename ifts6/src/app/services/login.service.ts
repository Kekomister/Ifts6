import { Injectable, OnInit } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoginService{

  private conectado : boolean = false;

  constructor() {}

  iniciarConectado(){
    //console.log(localStorage.getItem('Login'));
    this.conectado = JSON.parse(localStorage.getItem('Login'));
  }

  getConectado(){
    return this.conectado;
  }

  setConectado(bool : boolean){
    this.conectado = bool;
  }
}
