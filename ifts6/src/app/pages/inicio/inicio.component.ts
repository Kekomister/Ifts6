import { Component } from '@angular/core';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent {

  criterioPag : string = "Inicio";
  cant : number = 6;

  constructor(){}

  verTodas(){
    this.cant = 999999999;
  }

}
