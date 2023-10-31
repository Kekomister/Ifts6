import { HttpClient } from '@angular/common/http';
import { Component, Input} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
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

  @Input() criterio: string = "";
  publicacionesMostrar: Publicacion[] = [];
  imagen: any;

  constructor(private http: HttpClient, public sanitizer: DomSanitizer, 
    private conexion : ConexionService, private router : Router) { }

  ngOnInit() {
    this.getSectores();
    this.getUsuarios();
    this.getPublicaciones();
  }

  getUsuarios() {
    try {
      this.http.get<Usuario[]>(this.conexion.urlUsuario).subscribe(res => {
        //console.log("USUARIOS : " + res);
        this.usuarios = res;
      });
    } catch (e) {
      console.log("ERROR: " + e);
    }
  }

  getSectores() {
    try {
      this.http.get<Sector[]>(this.conexion.urlSector).subscribe(res => {
        //console.log("SECTORES : " + res);
        this.sectores = res;
      });
    } catch (e) {
      console.log("ERROR: " + e);
    }
  }

  getPublicaciones() {
    try {
      this.http.get<Publicacion[]>(this.conexion.urlPublicacion).subscribe(res => {
        this.publicaciones = res;
        this.verCriterio();
      });
    } catch (e) {
      console.log("ERROR: " + e);
    }
  }

  verCriterio() {
    console.log(this.publicaciones);

    if (this.criterio == "" || this.criterio == null) {
      this.publicacionesMostrar = this.publicaciones;
    } else {
      this.publicacionesMostrar = [];
      for (let i = 0; i < this.publicaciones.length; i++) {
        let nomSector = this.convertirSector(this.publicaciones[i].id_Sector);
        if (nomSector == this.criterio) {
          this.publicacionesMostrar.push(this.publicaciones[i]);
        }
      }
    }
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

  detalle(pub: Publicacion) {
    this.router.navigate(['/detalle',pub.id_Publicacion]);
  }

}
