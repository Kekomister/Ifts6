import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { Publicacion } from 'src/app/classes/publicacion.model';
import { ConexionService } from 'src/app/services/conexion.service';
import { Usuario } from 'src/app/classes/usuario.model';
import { MensajesService } from 'src/app/services/mensajes.service';
import { Column } from 'src/app/classes/column.model';
import { Sector } from 'src/app/classes/sector.model';
import { Pagina } from 'src/app/classes/pagina.model';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  user: Usuario = new Usuario();

  @ViewChild("fileUpload", { static: false }) fileUpload: ElementRef;
  files = [];

  pub: Publicacion = new Publicacion();
  sec: Sector = new Sector();
  userTemp: Usuario = new Usuario();
  pagina: Pagina = new Pagina();

  modificar: boolean = false;

  filas: any;
  columnas: Column[] = [];

  sectores: any;
  publicaciones: any;
  usuarios: any;
  paginas: any;

  cual: string = "";

  constructor(private conexion: ConexionService, private msj: MensajesService, public login: LoginService) { }

  ngOnInit() {
    this.iniciarAdmin();
  }

  iniciarAdmin() {
    this.traerSect();
    this.traerUsers();
    this.traerPub();
    // NO ESPERA A LOS DEMAS
    this.chequeo_Conectado();
  }

  private chequeo_Conectado() {
    //console.log(this.login.getUsuario());
    this.user.nombre_Usuario = this.login.getConectado().nombre_Usuario;
    if (this.login.getConectado().conectado) {
      if (this.login.getAdmin().conectado) {
        //console.log("ENTRO ADMIN");
        this.traerAdmin();
      } else {

        //console.log("Usuarios: ");
        this.conexion.traerUsuarios().subscribe(async res => {
          //console.log(res);
          
          let array_Users: Usuario[] = await res;
          array_Users.forEach(element => {

            if (element.nombre_Usuario == this.user.nombre_Usuario) {
              this.user = element;
              this.seleccionarPaginas();
            }

          });

        });
        // for (let i = 0; i < this.usuarios.length; i++) {
        //   if (this.user.nombre_Usuario == this.usuarios[i].nombre_Usuario) {
        //     this.user = this.usuarios[i];
        //     this.seleccionarPaginas();
        //   }
        // }
      }
    }
  }

  private traerAdmin() {
    this.conexion.traerUsuariosComun().subscribe(async res => {
      let array_Users: any = await res;

      array_Users.forEach(element => {
        if (element.nombre_Usuario == "Admin") {
          this.user.id_Usuario = element.id_Usuario;
        }
      });
    });

  }

  async chequeoUsuario() {
    this.login.setAdmin(false);
    this.conexion.traerUsuarios().subscribe(async res => {
      let usuarios = await res;
      let cant = this.cuantos(usuarios);
      if (this.usuarioEsta(cant, usuarios)) {
        this.login.setConectado(this.user.nombre_Usuario, true);
        this.select_Tabla("");
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
    let admin = this.login.getAdmin();
    if (this.user.nombre_Usuario == admin.nombre_Usuario
      && this.user.clave == admin.clave) {
      this.login.getAdmin().conectado = true;
      this.traerAdmin();
      return true;
    } else {
      for (let i = 0; i < cant; i++) {
        if (this.user.nombre_Usuario == usuarios[i].nombre_Usuario &&
          this.user.clave == usuarios[i].clave) {
          this.user = usuarios[i];
          this.seleccionarPaginas();
          return true;
        }
      }
      return false;
    }
  }

  seleccionarPaginas() {
    //console.log(this.user.id_Sector);
    let nombre;

    this.sectores.forEach(sector => {
      if (sector.id_Sector == this.user.id_Sector) {
        if (sector.nombre != null) {
          nombre = sector.nombre.split(", ");
        }
      }
    });
    let pag = [];

    if (nombre != undefined) {
      this.paginas.forEach((p: Pagina) => {
        for (let i = 0; i < nombre.length; i++) {
          //console.log("P.nombre : "+p.nombre +", nombre[i]: " + nombre[i]);
          if (p.nombre == nombre[i]) {
            pag.push(p);
          }
        }
      });
    }
    this.paginas = pag;
  }

  select_Tabla(cual: string) {
    this.cual = cual;
    switch (this.cual) {
      case "Sec":
        this.traerSect();
        break;
      case "Pub":
        this.traerPub();
        break;
      case "User":
        this.traerUsers();
        break;
      default:
        this.filas = [];
        break;
    }
    this.vaciarCampos();
  }

  traerSect() {
    this.columnas = [
      { field: "descripcion", header: "Sectores" },
      { field: "nombre", header: "Paginas en las que puede publicar" }
    ];

    this.conexion.traerSectores().subscribe(async res => {
      this.sectores = await res;
      this.sacar_Repetidos();
      let index;
      this.sectores.forEach(element => {
        if (element.descripcion == "Admin") {
          index = element;
        }
      });
      this.sectores.splice(this.sectores.indexOf(index), 1);
      this.filas = this.sectores;
      //console.log(this.sectores);
    });

    this.conexion.traerPagina().subscribe(async res => {
      this.paginas = await res;
    });
  }

  private sacar_Repetidos() {
    let s: Sector[] = [];

    for (let i = 0; i < this.sectores.length; i++) {
      let esta = 0;
      let con = 1;
      this.sectores[i].conexion = [];
      this.sectores[i].conexion[0] = this.sectores[i].id_Conexion;
      for (let j = 1 + i; j < this.sectores.length; j++) {
        if (this.sectores[i].id_Sector == this.sectores[j].id_Sector) {
          this.sectores[i].nombre += ", " + this.sectores[j].nombre;
          this.sectores[i].conexion[con] = this.sectores[j].id_Conexion;
          esta++;
          con++;
        }
      }
      s.push(this.sectores[i]);
      if (esta != 0) {
        i += esta;
      }
    }
    //console.log(s);
    this.sectores = s;
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
      { field: "pagina", header: "Pagina donde se ve" }
    ];

    if (this.login.getAdmin().conectado) {
      this.conexion.traerPublicaciones().subscribe(async res => {
        this.publicaciones = await res;
        this.filas = this.publicaciones;
        console.log(this.filas);
        
      });
    } else {
      if (this.login.getConectado().conectado) {
        this.conexion.traerPublicacionesUsuario
          (this.login.getConectado().nombre_Usuario)
          .subscribe(async res => {
            this.publicaciones = await res;
            this.filas = this.publicaciones;
          })
      }
    }
  }

  traerUsers() {
    this.columnas = [
      { field: "id_Usuario", header: "ID" },
      { field: "nombre_Usuario", header: "Nombre del usuario" },
      { field: "email", header: "E-mail" },
      //{ field: "clave", header: "Contraseña" },
      { field: "descripcion", header: "Rol" },
    ];

    this.conexion.traerUsuarios().subscribe(async res => {
      this.usuarios = await res;
      // PARA SACAR A ADMIN
      let index;
      this.usuarios.forEach(element => {
        if (element.nombre_Usuario == "Admin") {
          index = element;
        }
      });
      this.usuarios.splice(this.usuarios.indexOf(index), 1);
      this.filas = this.usuarios;
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
    if (this.paginas.length != 0) {
      let msj = this.chequeoPub();
      if(msj == ""){
        this.fileUpload.nativeElement.value = '';
        this.files.forEach(file => {
          this.sendFile(file);
        });
        this.msj.success("Se ha agregado con exito!", "Genial");
        //console.log(this.files);
        this.vaciarCampos();
      }else{
        this.msj.error("Error",msj,"OK");
      }
    } else {
      this.msj.error("Error", "No tenes permiso en ninguna pagina, chequea con el admin.", "Okey");
    }
  }

  chequeoPub() : string{
    if(this.pub.descripcion == "" || this.pub.descripcion == undefined){
      return "La descripcion no debe estar vacia";
    }else{
      if(this.pub.titulo == "" || this.pub.titulo == undefined){
        return "El titulo no debe estar vacio";
      }else{
        if(this.pub.imagen == undefined){
          return "Debe subir una imagen";
        }else{
          if(this.pub.id_Pagina == undefined){
            return "Debe seleccionar una pagina.";
          }
        }
      }
    }
    return "";
  }

  enviarSec() {
    let array = this.traerCheckbox();

    this.conexion.crearSector(this.sec).subscribe(async res => {
      this.enviarSecPag(array);
      this.select_Tabla("Sec");
    })
    this.msj.success("Se ha agregado con exito!", "Genial");
    this.vaciarCampos();
  }

  enviarUser() {
    //console.log(this.userTemp);
    let check = this.chequeoCamposUsuario();
    if(check){
      this.conexion.crearUsuario(this.userTemp).subscribe(async res => {
        this.select_Tabla("User");
      })
      this.msj.success("Se ha agregado con exito!", "Genial");
      this.vaciarCampos();
    }
  }

  private chequeoCamposUsuario() : boolean {
    let todoBien = true;
    if (this.userTemp.nombre_Usuario == undefined || this.userTemp.nombre_Usuario == "") {
      this.msj.error("Error", "El campo de nombre no debe estar vacio", "OK");
      todoBien = false;
    } else {
      if (this.usuarioExistente()) {
        this.msj.error("Error", "El nombre indicado ya esta siendo usado o no es permitido", "OK");
        todoBien = false;
      } else {
        if (this.userTemp.clave == undefined || this.userTemp.clave == "") {
          this.msj.error("Error", "La clave no debe estar vacia", "OK");
          todoBien = false;
        } else {
          if (this.userTemp.id_Sector == undefined) {
            this.msj.error("Error", "El rol debe ser seleccionado", "OK");
            todoBien = false;
          }
        }
      }
    }
    return todoBien;
  }

  private usuarioExistente() : boolean{
    let yaExiste = false;

    if(this.userTemp.nombre_Usuario.toLowerCase() == "admin"){
      yaExiste = true;
    }else{
      this.usuarios.forEach(us => {
        if(us.nombre_Usuario == this.userTemp.nombre_Usuario){
          yaExiste = true;
        }
      });
    }
    return yaExiste;
  }

  async sendFile(file) {
    const formData = new FormData();
    formData.append('file', file.data);
    formData.append('titulo', this.pub.titulo);
    formData.append('descripcion', this.pub.descripcion);
    formData.append('id_Usuario', String(this.user.id_Usuario));
    formData.append('id_Pagina', String(this.pub.id_Pagina));
    file.inProgress = true;

    (await this.sendFormData(formData)).subscribe((event: any) => {
      this.select_Tabla("Pub");
    });
  }

  public async sendFormData(formData: FormData) {
    return this.conexion.crearPublicacion(formData);
  }

  async acciones(accion: any[]) {
    if (accion[0] == "borrar") {
      let mensaje = this.borrarMensaje(accion[1]);
      let res = await this.msj.preguntar
        ("Estas seguro de querer borrar?", mensaje, "Si", "Cambie de opinion")
      if (res.isConfirmed) {
        let cheq = this.chequeoAlguno(accion[1]);
        if (cheq == "") {
          this.borrarAlguno(accion[1]);
          this.msj.info("Se ha borrado correctamente", "Entendido");
        } else {
          this.msj.error("Error", cheq, "Entendido")
        }
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
        await this.borrarConexiones(objeto);
        await this.conexion.borrarSector(objeto).subscribe();
        this.select_Tabla("Sec");
        break;
      case "Pub":
        await this.conexion.borrarPublicacion(objeto).subscribe();
        this.select_Tabla("Pub");
        break;
      case "User":
        await this.conexion.borrarUsuario(objeto).subscribe();
        this.select_Tabla("User");
        break;
      default:
        break;
    }
  }

  traerCheckbox() {
    let array = [];
    for (let i = 0; i < this.paginas.length; i++) {
      let check = document.getElementById(`checkbox${i}`) as HTMLInputElement | null;
      if (check.checked) {
        array.push(Number(check.value));
      }
    }
    return array;
  }

  async borrarConexiones(objeto) {
    if (objeto.conexion.length > 0) {
      for (let i = 0; i < objeto.conexion.length; i++) {
        await this.conexion.borrarConexionSectorPagina(objeto.conexion[i]).subscribe();
      };
    }
    this.select_Tabla("Sec");
  }

  modificarUser() {
    this.conexion.modificarUsuario(this.userTemp).subscribe(async res => {
      this.select_Tabla("User");
    })
    this.msj.success("Se ha modificado con exito!", "Genial");
    this.vaciarCampos();
  }

  modificarPub() {
    const formData = new FormData();
    formData.append('titulo', this.pub.titulo);
    formData.append('descripcion', this.pub.descripcion);
    formData.append('id_Usuario', String(this.user.id_Usuario));
    formData.append('id_Pagina', String(this.pub.id_Pagina));

    if (this.files.length == 0) {
      this.conexion.modificarPublicacionSinImagen(this.pub.id_Publicacion, formData).subscribe(async res => {
        this.select_Tabla("Pub");
      })
    } else {
      const formData = new FormData();
      formData.append('file', this.pub.imagen);
      this.conexion.modificarPublicacion(this.pub.id_Publicacion, formData).subscribe(async res => {
        this.select_Tabla("Pub");
      })
    }

    this.msj.success("Se ha modificado con exito!", "Genial");
    this.vaciarCampos();
  }

  async modificarSec() {
    let s = this.sec;
    let array = this.traerCheckbox();
    let l = await this.borrarConexiones(this.sec);
    //console.log(array);

    this.conexion.modificarSector(s).subscribe(async res => {
      this.enviarSecPag(array, s.id_Sector);
      this.select_Tabla("Sec");
    })
    this.msj.success("Se ha modificado con exito!", "Genial");
    this.vaciarCampos();
  }

  enviarSecPag(arrayPag: number[], id?: number) {

    for (let i = 0; i < arrayPag.length; i++) {
      this.conexion.crearConexionSectorPagina(arrayPag[i], id).subscribe(async res => { })
      this.msj.success("Se ha agregado con exito!", "Genial");
    }
    this.vaciarCampos();
  }

  llenarCampos(objeto) {
    switch (this.cual) {
      case "Sec":
        //console.log(objeto.nombre);
        this.llenarCheckbox(objeto.nombre);
        this.sec.descripcion = objeto.descripcion;
        this.sec.id_Sector = objeto.id_Sector;
        this.sec.conexion = objeto.conexion;
        break;
      case "Pub":
        this.pub.descripcion = objeto.descripcion;
        this.pub.fecha_Publicacion = objeto.fecha_Publicacion;
        this.pub.id_Publicacion = objeto.id_Publicacion;
        this.pub.id_Sector = this.buscarSector(objeto.sector);
        this.pub.id_Usuario = this.user.id_Usuario;
        this.pub.imagen = objeto.imagen;
        this.pub.titulo = objeto.titulo;
        this.pub.id_Pagina = this.buscar_Pagina(objeto.pagina);

        //console.log(this.pub);
        break;
      case "User":
        this.userTemp.id_Usuario = objeto.id_Usuario;
        this.userTemp.clave = objeto.clave;
        this.userTemp.nombre_Usuario = objeto.nombre_Usuario;
        this.userTemp.id_Sector = objeto.id_Sector;
        this.userTemp.email = objeto.email;
        break;
      default:
        break;
    }
  }

  llenarCheckbox(nombrePags: string) {
    if (nombrePags != null) {
      for (let i = 0; i < this.paginas.length; i++) {
        if (nombrePags.includes(this.paginas[i].nombre)) {
          let check = document.getElementById(`checkbox${i}`) as HTMLInputElement | null;
          check.checked = true;
        }
      }
    }
  }

  private buscarSector(desc: string): number {
    for (let i = 0; i < this.sectores.length; i++) {
      if (this.sectores[i].descripcion == desc) {
        return this.sectores[i].id_Sector;
      }
    }
    return 0;
  }

  // private convertir_Pagina(): string {
  //   for (let i = 0; i < this.paginas.length; i++) {
  //     if (this.paginas[i].id_Pagina == this.pagina.id_Pagina) {
  //       return this.paginas[i].nombre;
  //     }
  //   }
  //   return "";
  // }

  private buscar_Pagina(pagina: string): number {
    for (let i = 0; i < this.paginas.length; i++) {
      if (this.paginas[i].nombre == pagina) {
        return this.paginas[i].id_Pagina;
      }
    }
    return -1;
  }

  private chequeoAlguno(objeto): string {
    let esta = "";
    switch (this.cual) {
      case "Sec":
        if (this.chequeoSectorUsuario(objeto.id_Sector)) {
          esta = "Hay usuarios utilizando este sector, por favor cambiele el sector a esos usuarios primero.";
        }
        break;
      case "Pub":
        break;
      case "User":
        if (this.chequeoUsuarioPublicaciones(objeto.nombre_Usuario)) {
          esta = "Hay publicaciones realizadas por este usuario, por favor borre dichas publicaciones primero.";
        }
        break;
      default:
        break;
    }
    return esta;
  }

  private chequeoSectorUsuario(sectID): boolean {
    let usus: Usuario[] = this.usuarios;
    let esta = false;
    usus.forEach(usu => {
      if (usu.id_Sector == sectID) {
        esta = true;
      }
    });
    return esta;
  }

  private chequeoUsuarioPublicaciones(userName): boolean {
    let pubs: Publicacion[] = this.publicaciones;
    let esta = false;
    pubs.forEach(p => {
      if (p.nombre_Usuario == userName) {
        esta = true;
      }
    });
    return esta;
  }

  vaciarCampos() {
    this.pub = new Publicacion();
    this.sec = new Sector();
    this.userTemp = new Usuario();
    this.pagina = new Pagina();
    this.files = [];
    this.modificar = false;
  }

  entrarDescripcion() {
    document.getElementById("descripcion").style.display = "flex";
  }

  salirDescripcion() {
    document.getElementById("descripcion").style.display = "none";
  }

}
