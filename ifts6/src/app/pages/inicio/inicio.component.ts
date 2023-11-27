import { Component } from '@angular/core';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent {

  criterioPag : string = "Inicio";
  cant : number = 6;
  todas : boolean = false;

  constructor(){}

  verTodas(){
    this.cant = 999999999;
    this.todas = true;
  }

}
