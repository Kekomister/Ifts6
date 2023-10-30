import { Component } from '@angular/core';
import { ConexionService } from 'src/app/services/conexion.service';

@Component({
  selector: 'app-convenios',
  templateUrl: './convenios.component.html',
  styleUrls: ['./convenios.component.css']
})
export class ConveniosComponent {
  
  criterioPag : any;

  constructor(private conexion : ConexionService){
    this.traerPag();
  }

  async traerPag(){
    (await this.conexion.traerPagina("Convenios")).subscribe(async res =>{
      this.criterioPag = await res[0].descripcion;
    });
  }
}
