import { HttpClient, HttpEvent } from '@angular/common/http';
import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Publicacion } from 'src/app/classes/publicacion.model';
import { Sector } from 'src/app/classes/sector.model';
import { Usuario } from 'src/app/classes/usuario.model';
import { Buffer } from 'buffer';


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

  urlUsuario: string = "http://localhost:3000/usuario";
  urlPublicacion: string = "http://localhost:3000/publicacion";
  urlSector: string = "http://localhost:3000/sector";

  @Input() criterio: string = "";
  publicacionesMostrar: Publicacion[] = [];
  imagen: any;

  constructor(private http: HttpClient, public sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.getSectores();
    this.getUsuarios();
    this.getPublicaciones();
  }

  getUsuarios() {
    try {
      this.http.get<Usuario[]>(this.urlUsuario).subscribe(res => {
        //console.log("USUARIOS : " + res);
        this.usuarios = res;
      });
    } catch (e) {
      console.log("ERROR: " + e);
    }
  }

  getSectores() {
    try {
      this.http.get<Sector[]>(this.urlSector).subscribe(res => {
        //console.log("SECTORES : " + res);
        this.sectores = res;
      });
    } catch (e) {
      console.log("ERROR: " + e);
    }
  }

  getPublicaciones() {
    try {
      this.http.get<Publicacion[]>(this.urlPublicacion).subscribe(res => {
        this.publicaciones = res;
        this.verCriterio();
      });
    } catch (e) {
      console.log("ERROR: " + e);
    }
  }

  verCriterio() {
    console.log(this.publicaciones);

    if (this.criterio == "") {
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
    alert("Ir a " + pub.titulo)
  }



  

}
