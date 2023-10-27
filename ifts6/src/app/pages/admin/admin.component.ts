import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { Publicacion } from 'src/app/classes/publicacion.model';
import { ConexionService } from 'src/app/services/conexion.service';
import { Usuario } from 'src/app/classes/usuario.model';
import { MensajesService } from 'src/app/services/mensajes.service';
import { Column } from 'src/app/classes/column.model';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {

  user: Usuario = new Usuario();
  conectado: boolean = false;

  @ViewChild("fileUpload", { static: false }) fileUpload: ElementRef;
  files = [];

  pub: Publicacion = new Publicacion();
  modificar : boolean = false;

  filas: any;
  columnas: Column[] = [];

  sectores : any;
  publicaciones : any;

  constructor(private conexion: ConexionService, private http: HttpClient,
    private msj: MensajesService) { 
      this.traerPub();
      this.traerSect();
    }

  async chequeoUsuario() {
    this.http.get(this.conexion.urlUsuario).subscribe(async res => {
      let usuarios = await res;
      console.log(usuarios);
      let cant = this.cuantos(usuarios);
      if (this.usuarioEsta(cant, usuarios)) {
        this.conectado = true;
        this.traerPub();
        this.msj.success("Ha ingresado con exito!", "Okey");
      } else {
        this.msj.error("Hubo un problema", "Usuario / clave incorrecta.", "Okey");
      }
    });

  }

  cuantos(usuarios): number {
    let listo = false;
    let cont = 0;
    while (!listo) {
      if (usuarios[cont] != undefined) {
        cont++;
      } else {
        listo = true;
      }
    }
    return cont;
  }

  usuarioEsta(cant, usuarios): boolean {
    for (let i = 0; i < cant; i++) {
      if (this.user.nombre_Usuario == usuarios[i].nombre_Usuario &&
        this.user.clave == usuarios[i].clave) {
          this.user.id_Usuario = usuarios[i].id_Usuario;
        return true;
      }
    }
    return false;
  }

  traerSect() {
    this.http.get(this.conexion.urlSector).subscribe(async res => {
      this.sectores = await res;
    });

    // this.columnas = [
    //   { field: "id_Publicacion", header: "ID" },
    //   { field: "titulo", header: "Titulo" },
    //   { field: "descripcion", header: "Descripcion" },
    //   //{ field: "imagen", header: "Imagen" },
    //   { field: "fecha_Publicacion", header: "Fecha de Publicacion" },
    //   { field: "nombre_Usuario", header: "Usuario que lo publico" },
    //   { field: "sector", header: "Sector" },
    // ];
  }

  traerPub() {
    this.http.get(this.conexion.urlPublicacion + "/legible").subscribe(async res => {
      this.publicaciones = await res;
      this.filas = this.publicaciones;
    });

    this.columnas = [
      { field: "id_Publicacion", header: "ID" },
      { field: "titulo", header: "Titulo" },
      { field: "descripcion", header: "Descripcion" },
      //{ field: "imagen", header: "Imagen" },
      { field: "fecha_Publicacion", header: "Fecha de Publicacion" },
      { field: "nombre_Usuario", header: "Usuario que lo publico" },
      { field: "sector", header: "Sector" },
    ];
  }

  subir() {
    const fileUpload = this.fileUpload.nativeElement; fileUpload.onchange = () => {
      for (let index = 0; index < fileUpload.files.length; index++) {
        const file = fileUpload.files[index];
        this.files.push({ data: file, inProgress: false, progress: 0 });
      }
      this.pub.imagen = this.files[0].data;
    };
    fileUpload.click();
  }

  enviar() {
    this.fileUpload.nativeElement.value = '';
    this.files.forEach(file => {
      this.sendFile(file);
    });
    this.vaciarCampos();
  }

  async sendFile(file) {
    const formData = new FormData();
    formData.append('file', file.data);
    formData.append('titulo', this.pub.titulo);
    formData.append('descripcion', this.pub.descripcion);
    formData.append('id_Usuario', String(this.user.id_Usuario));
    formData.append('id_Sector', String(this.pub.id_Sector));
    file.inProgress = true;

    (await this.sendFormData(formData)).subscribe((event: any) => { this.traerPub();});
  }

  public async sendFormData(formData: FormData) {
    return this.http.post(this.conexion.urlPublicacion, formData, {
      reportProgress: true,
      observe: 'events',
    });
  }

  async acciones(accion: any[]) {
    // POR AHORA SOLO FUNCIONA PARA PUBLICACIONES
    if (accion[0] == "borrar") {
      let mensaje =
        "Titulo : " + accion[1].titulo;
      let res = await this.msj.preguntar
        ("Estas seguro de querer borrar?", mensaje, "Si", "Cambie de opinion")
      if (res.isConfirmed) {
        await this.http.delete(this.conexion.urlPublicacion+"/" + accion[1].id_Publicacion)
        .subscribe();
        this.msj.info("Se ha borrado correctamente", "Entendido");
        this.traerPub();
      } else {
        this.msj.info("Se ha cancelado", "Gracias");
      }
    } else {
      if (accion[0] == "modificar") {
        this.modificar = true;
        this.llenarCampos(accion[1]);
      }
    }
  }

  llenarCampos(p){
    this.pub.descripcion = p.descripcion;
    this.pub.fecha_Publicacion = p.fecha_Publicacion;
    this.pub.id_Publicacion = p.id_Publicacion;
    this.pub.id_Sector = this.buscarSector(p.sector);
    this.pub.id_Usuario = this.user.id_Usuario;
    this.pub.imagen = p.imagen;
    this.pub.titulo = p.titulo;
  }

  buscarSector(desc : string) : number {
    for(let i = 0; i < this.sectores.length; i++){
      if(this.sectores[i].descripcion == desc){
        return this.sectores[i].id_Sector;
      }
    }
    return 0;
  }

  vaciarCampos(){
    this.pub.descripcion = "";
    this.pub.fecha_Publicacion = "";
    this.pub.id_Publicacion = -1;
    this.pub.id_Sector = -1;
    this.pub.id_Usuario = -1;
    this.pub.imagen = "";
    this.pub.titulo = "";
  }

}
