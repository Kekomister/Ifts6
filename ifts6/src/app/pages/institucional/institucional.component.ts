import { Component } from '@angular/core';
import { ConexionService } from 'src/app/services/conexion.service';

@Component({
  selector: 'app-institucional',
  templateUrl: './institucional.component.html',
  styleUrls: ['./institucional.component.css']
})
export class InstitucionalComponent {
  
  criterioPag : any;

  constructor(private conexion : ConexionService){
    this.traerPag();
  }

  async traerPag(){
    (await this.conexion.traerPagina("Institucional")).subscribe(async res =>{
      this.criterioPag = await res[0].descripcion;
    });
  }
}
