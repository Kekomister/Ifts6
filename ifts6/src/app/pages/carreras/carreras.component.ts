import { Component } from '@angular/core';
import { ConexionService } from 'src/app/services/conexion.service';

@Component({
  selector: 'app-carreras',
  templateUrl: './carreras.component.html',
  styleUrls: ['./carreras.component.css']
})
export class CarrerasComponent {
  
  criterioPag : any;

  constructor(private conexion : ConexionService){
    this.traerPag();
  }

  async traerPag(){
    (await this.conexion.traerPagina("Carreras")).subscribe(async res =>{
      this.criterioPag = await res[0].descripcion;
    });
  }
}
