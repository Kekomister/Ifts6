import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { Publicacion } from 'src/app/classes/publicacion.model';
import { ConexionService } from 'src/app/services/conexion.service';
import { Usuario } from 'src/app/classes/usuario.model';
import { MensajesService } from 'src/app/services/mensajes.service';
import { Column } from 'src/app/classes/column.model';
import { Sector } from 'src/app/classes/sector.model';
import { Pagina } from 'src/app/classes/pagina.model';

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
  sec: Sector = new Publicacion();
  userTemp: Usuario = new Usuario();
  pagina : Pagina = new Pagina();

  modificar: boolean = false;

  filas: any;
  columnas: Column[] = [];

  sectores: any;
  publicaciones: any;
  usuarios: any;
  paginas: any;

  cual: string = "";

  constructor(private conexion: ConexionService, private http: HttpClient,
    private msj: MensajesService) {
    this.traerPub();
  }

  async chequeoUsuario() {
    this.http.get(this.conexion.urlUsuario).subscribe(async res => {
      let usuarios = await res;
      let cant = this.cuantos(usuarios);
      if (this.usuarioEsta(cant, usuarios)) {
        this.conectar();
        this.msj.success("Ha ingresado con exito!", "Okey");
      } else {
        this.msj.error("Hubo un problema", "Usuario / clave incorrecta.", "Okey");
      }
    });

  }

  conectar() {
    this.conectado = true;
    this.traerSect();
    //CONDICION PARA ADMIN
    if (true) {
      this.traerUsers();
    }
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
    // FALTA CONDICION ADMIN

    for (let i = 0; i < cant; i++) {
      if (this.user.nombre_Usuario == usuarios[i].nombre_Usuario &&
        this.user.clave == usuarios[i].clave) {
        this.user.id_Usuario = usuarios[i].id_Usuario;
        return true;
      }
    }
    return false;
  }

  select_Tabla(cual: string) {
    this.cual = cual;
    switch (this.cual) {
      case "Sec":
        this.traerSect();
        this.filas = this.sectores;
        break;
      case "Pub":
        this.traerPub();
        this.filas = this.publicaciones;
        break;
      case "User":
        this.traerUsers();
        this.filas = this.usuarios;
        break;
      case "Pag":
        this.traerPags();
        this.filas = this.paginas;
        break;
      default:
        break;
    }
    this.vaciarCampos();
  }

  traerSect() {
    this.columnas = [
      { field: "id_Sector", header: "ID" },
      { field: "descripcion", header: "Descripcion" },
    ];
    this.http.get(this.conexion.urlSector).subscribe(async res => {
      this.sectores = await res;
    });
  }

  traerPub() {
    this.columnas = [
      { field: "id_Publicacion", header: "ID" },
      { field: "titulo", header: "Titulo" },
      { field: "descripcion", header: "Descripcion" },
      //{ field: "imagen", header: "Imagen" },
      { field: "fecha_Publicacion", header: "Fecha de Publicacion" },
      { field: "nombre_Usuario", header: "Usuario que lo publico" },
      { field: "sector", header: "Sector" },
    ];

    this.http.get(this.conexion.urlPublicacion + "/legible").subscribe(async res => {
      this.publicaciones = await res;
    });

  }

  traerUsers() {
    this.columnas = [
      { field: "id_Usuario", header: "ID" },
      { field: "nombre_Usuario", header: "Nombre del usuario" },
      //{ field: "clave", header: "Contraseña" },
      { field: "rol", header: "Rol" },
    ];

    this.http.get(this.conexion.urlUsuario).subscribe(async res => {
      this.usuarios = await res;
    });
  }

  traerPags(){
    this.columnas = [
      { field: "nombre", header: "Nombre de la pagina" },
      { field: "descripcion", header: "Sectores asignados"}
    ];

    this.http.get(this.conexion.urlPagina + "/Legible").subscribe(async res => {
      this.paginas = await res;
    });
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

  enviarPub() {
    this.fileUpload.nativeElement.value = '';
    this.files.forEach(file => {
      this.sendFile(file);
    });
    this.vaciarCampos();
  }

  enviarSec() {
    this.http.post(this.conexion.urlSector, this.sec).subscribe(async res => {
      this.select_Tabla("Sec");
    })
    this.vaciarCampos();
  }

  enviarUser() {
    this.http.post(this.conexion.urlUsuario, this.userTemp).subscribe(async res => {
      this.select_Tabla("User");
    })
    this.vaciarCampos();
  }

  enviarSecPag(){
    this.http.post(this.conexion.urlPaginaConexion, this.pagina).subscribe(async res => {
      this.select_Tabla("Pag");
    })
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

    (await this.sendFormData(formData)).subscribe((event: any) => {
      this.select_Tabla("P");
    });
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
      let mensaje = this.borrarMensaje(accion[1]);
      let res = await this.msj.preguntar
        ("Estas seguro de querer borrar?", mensaje, "Si", "Cambie de opinion")
      if (res.isConfirmed) {
        this.msj.info("Se ha borrado correctamente", "Entendido");
        this.borrarAlguno(accion[1]);
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

  borrarMensaje(objeto) {
    switch (this.cual) {
      case "Sec":
        return "Descripcion : " + objeto.descripcion;
      case "Pub":
        return "Titulo : " + objeto.titulo;
      case "User":
        return "Nombre del usuario : " + objeto.nombre_Usuario;
      case "Pag":
        return `Nombre de la pagina : ${objeto.nombre}, nombre del sector : ${objeto.descripcion}`;
      default:
        return "ERROR";
    }
  }

  async borrarAlguno(objeto) {
    switch (this.cual) {
      case "Sec":
        await this.http.delete(this.conexion.urlSector + "/" + objeto.id_Sector)
          .subscribe();
        this.select_Tabla("Sec");
        break;
      case "Pub":
        await this.http.delete(this.conexion.urlPublicacion + "/" + objeto.id_Publicacion)
          .subscribe();
        this.select_Tabla("Pub");
        break;
      case "User":
        await this.http.delete(this.conexion.urlUsuario + "/" + objeto.id_Usuario)
          .subscribe();
        this.select_Tabla("User");
        break;
      case "Pag":
        console.log(objeto);
        
        await this.http.delete(this.conexion.urlPaginaConexion + "/" + objeto.id_Conexion)
          .subscribe();
        this.select_Tabla("Pag");
        break;
      default:
        break;
    }
  }

  modificarUser() {
    this.http.put(this.conexion.urlUsuario + "/" + this.userTemp.id_Usuario, this.userTemp).subscribe(async res => {
      this.select_Tabla("User");
    })
    this.msj.success("Se ha modificado con exito!", "Genial");
    this.vaciarCampos();
  }

  modificarPub() {
    const formData = new FormData();
    formData.append('file', this.pub.imagen);
    formData.append('titulo', this.pub.titulo);
    formData.append('descripcion', this.pub.descripcion);
    formData.append('id_Usuario', String(this.user.id_Usuario));
    formData.append('id_Sector', String(this.pub.id_Sector));
    formData.append('fecha_Publicacion', this.pub.fecha_Publicacion)

    this.http.put(this.conexion.urlPublicacion + "/" + this.pub.id_Publicacion, formData).subscribe(async res => {
      this.select_Tabla("Pub");
    })
    this.msj.success("Se ha modificado con exito!", "Genial");
    this.vaciarCampos();
  }

  modificarSec() {
    this.http.put(this.conexion.urlSector + "/" + this.sec.id_Sector, this.sec).subscribe(async res => {
      this.select_Tabla("Sec");
    })
    this.msj.success("Se ha modificado con exito!", "Genial");
    this.vaciarCampos();
  }

  llenarCampos(objeto) {
    switch (this.cual) {
      case "Sec":
        this.sec.descripcion = objeto.descripcion;
        this.sec.id_Sector = objeto.id_Sector;
        break;
      case "Pub":
        this.pub.descripcion = objeto.descripcion;
        this.pub.fecha_Publicacion = objeto.fecha_Publicacion;
        this.pub.id_Publicacion = objeto.id_Publicacion;
        this.pub.id_Sector = this.buscarSector(objeto.sector);
        this.pub.id_Usuario = this.user.id_Usuario;
        this.pub.imagen = objeto.imagen;
        this.pub.titulo = objeto.titulo;
        break;
      case "User":
        this.userTemp.id_Usuario = objeto.id_Usuario;
        this.userTemp.clave = objeto.clave;
        this.userTemp.nombre_Usuario = objeto.nombre_Usuario;
        this.userTemp.rol = objeto.rol;
        break;
      default:
        break;
    }
  }

  buscarSector(desc: string): number {
    for (let i = 0; i < this.sectores.length; i++) {
      if (this.sectores[i].descripcion == desc) {
        return this.sectores[i].id_Sector;
      }
    }
    return 0;
  }

  vaciarCampos() {
    this.pub = new Publicacion();
    this.sec = new Sector();
    this.userTemp = new Usuario();
    this.pagina = new Pagina();
    this.modificar = false;
  }

}
