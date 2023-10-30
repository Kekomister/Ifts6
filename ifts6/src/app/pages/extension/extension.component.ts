import { Component } from '@angular/core';
import { ConexionService } from 'src/app/services/conexion.service';

@Component({
  selector: 'app-extension',
  templateUrl: './extension.component.html',
  styleUrls: ['./extension.component.css']
})
export class ExtensionComponent {
  
  criterioPag : any;

  constructor(private conexion : ConexionService){
    this.traerPag();
  }

  async traerPag(){
    (await this.conexion.traerPagina("Extension terciaria")).subscribe(async res =>{
      this.criterioPag = await res[0].descripcion;
    });
  }
}
