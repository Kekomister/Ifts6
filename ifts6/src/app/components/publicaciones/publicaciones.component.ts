import { HttpClient } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Pagina } from 'src/app/classes/pagina.model';
import { Publicacion } from 'src/app/classes/publicacion.model';
import { Sector } from 'src/app/classes/sector.model';
import { Usuario } from 'src/app/classes/usuario.model';
import { ConexionService } from 'src/app/services/conexion.service';


@Component({
  selector: 'app-publicaciones',
  templateUrl: './publicaciones.component.html',
  styleUrls: ['./publicaciones.component.css']
})
export class PublicacionesComponent {

  // id_Publicacion, titulo, descripcion, imagen, fecha_Publicacion, id_Usuario, id_Sector
  //  int,           varchar,varchar,   varbinary,   date,             int,        int

  publicaciones: Publicacion[] = [];
  usuarios: Usuario[] = [];
  sectores: Sector[] = [];
  paginas: Pagina[] = [];

  @Input() criterio: string = "";
  @Input() todas: boolean = false;
  @Input() cantidad: number = 9999999999999;
  publicacionesMostrar: Publicacion[] = [];
  imagen: any;

  constructor(public sanitizer: DomSanitizer,
    private conexion: ConexionService, private router: Router) { }

  ngOnInit() {
    this.getSectores();
    this.getUsuarios();
    this.getPublicaciones();
    this.getPaginas();
  }

  getUsuarios() {
    try {
      this.conexion.traerUsuariosComun().subscribe(async res => {
        //console.log("USUARIOS : " + res);
        this.usuarios = await res;
      });
    } catch (e) {
      console.log("ERROR: " + e);
    }
  }

  getSectores() {
    try {
      this.conexion.traerSectoresComun().subscribe(async res => {
        //console.log("SECTORES : " + res);
        this.sectores = await res;
      });
    } catch (e) {
      console.log("ERROR: " + e);
    }
  }

  getPublicaciones() {
    try {
      this.conexion.traerPublicaciones().subscribe(async res => {
        this.publicaciones = await res;
        
        this.verCriterio();
      });
    } catch (e) {
      console.log("ERROR: " + e);
    }
  }

  getPaginas() {
    this.conexion.traerPagina().subscribe(async res => {
      this.paginas = await res;
    });
  }

  verCriterio() {
    console.log(this.publicaciones);

    if (this.criterio == "Inicio") {
      this.publicacionesMostrar = this.publicaciones;
    } else {
      this.publicacionesMostrar = [];
      this.publicaciones.forEach(publicacion => {
        if(publicacion.pagina == this.criterio){
          this.publicacionesMostrar.push(publicacion);
        }
      });
      this.cantidad = this.publicacionesMostrar.length;
      //console.log(this.publicacionesMostrar);
    }
  }

  detalle(pub: Publicacion) {
    this.router.navigate(['/detalle', pub.id_Publicacion]);
  }

  convertirUsuario(id: number) {
    let usuario = "";
    for (let i = 0; i < this.usuarios.length; i++) {
      if (this.usuarios[i].id_Usuario == id) {
        usuario = this.usuarios[i].nombre_Usuario;
        break;
      }
    }
    return usuario;
  }

  convertirSector(id: number) {
    let sector = "";
    for (let i = 0; i < this.sectores.length; i++) {
      if (this.sectores[i].id_Sector == id) {
        sector = this.sectores[i].descripcion;
        break;
      }
    }
    return sector;
  }

  filtrar(crit : string){
    this.criterio = crit;
    this.verSector();
  }

  verSector() {
    this.publicacionesMostrar = [];
    this.publicaciones.forEach(publicacion => {
      if(publicacion.nombre_Usuario == this.criterio){
        this.publicacionesMostrar.push(publicacion);
      }
    });
    this.cantidad = this.publicacionesMostrar.length;
    //console.log(this.publicacionesMostrar);
  }

}
