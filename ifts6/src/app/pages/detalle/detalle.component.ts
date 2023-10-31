import { Component} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Publicacion } from 'src/app/classes/publicacion.model';
import { ConexionService } from 'src/app/services/conexion.service';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css']
})
export class DetalleComponent {

  publicacion : Publicacion = new Publicacion();

  constructor(private route: ActivatedRoute, private conexion : ConexionService){}

  ngOnInit(){
    this.route.paramMap.subscribe(async (params) => {
      const id = params.get('id');
      this.publicacion.id_Publicacion = Number(id);
      (await this.conexion.traerPublicacion(this.publicacion.id_Publicacion)).subscribe(async res =>{
        this.publicacion = await res[0];
        console.log(this.publicacion);
      })
    })
  }
}
