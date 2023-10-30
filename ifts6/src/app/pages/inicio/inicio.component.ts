import { Component } from '@angular/core';
import { ConexionService } from 'src/app/services/conexion.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent {

  criterioPag : any;

  constructor(private conexion : ConexionService){
    this.traerPag();
  }

  async traerPag(){
    (await this.conexion.traerPagina("Inicio")).subscribe(async res =>{
      this.criterioPag = await res[0].descripcion;
    });
  }

}
