import { Component } from '@angular/core';
import { Consulta } from 'src/app/classes/consulta.model';
import { MensajesService } from 'src/app/services/mensajes.service';

@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.css']
})
export class ContactoComponent {
  
  contactar: Consulta[] = [];
  nuevaConsulta : Consulta = new Consulta();
  
  constructor(private msj : MensajesService){}

  async agregarConsulta() {
      await this.msj.consulta().then(res => {
        if(res.isConfirmed){
          this.contactar.push(this.nuevaConsulta);
          this.msj.success('Consulta realizada!', 'Gracias');
          this.nuevaConsulta = new Consulta();
          console.log(this.contactar);
        }
      });
  }

}
