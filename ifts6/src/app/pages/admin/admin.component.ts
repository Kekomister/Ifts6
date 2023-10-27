import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { Publicacion } from 'src/app/classes/publicacion.model';
import { ConexionService } from 'src/app/services/conexion.service';
import { Buffer } from 'buffer';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {

  @ViewChild("fileUpload", { static: false }) fileUpload: ElementRef;
  files = [];

  pub: Publicacion = new Publicacion();
  b : Blob;
  constructor(private conexion: ConexionService, private http: HttpClient) { }

  onClick() {
    const fileUpload = this.fileUpload.nativeElement; fileUpload.onchange = () => {
      for (let index = 0; index < fileUpload.files.length; index++) {
        const file = fileUpload.files[index];
        this.b = fileUpload.files[index];
        this.files.push({ data: file, inProgress: false, progress: 0 });
      }
      this.pub.imagen = this.files[0].data;
      //this.enviar();
    };
    fileUpload.click();
  }

  enviar() {
    this.fileUpload.nativeElement.value = '';
    this.files.forEach(file => {
      this.sendFile(file);
    });
  }

  async sendFile(file) {
    const formData = new FormData();
    formData.append('file', file.data);
    formData.append('titulo', "t");
    formData.append('descripcion', "d");
    formData.append('id_Usuario', "1");
    formData.append('id_Sector', "1");
    file.inProgress = true;

    (await this.sendFormData(formData)).subscribe((event: any) => {
      if (typeof (event) === 'object') {
        //console.log("EVENT BODY: "+event.body);
      }
    });
  }

  public async sendFormData(formData : FormData) {
    // formData.forEach(res =>{
    //   console.log(res);
    // })
    console.log(this.pub.imagen);
    //console.log(this.pub.imagen);
    let x;
    await this.pub.imagen.arrayBuffer().then(buff => {
      x = new Uint8Array(buff); // x is your uInt8Array
      // perform all required operations with x here.

    });
    //console.log(x);
    // console.log(b);
    // let a = Buffer.from(b.toString());
    // console.log(a);

    let img = this.buff(this.pub.imagen.arrayBuffer())
    //console.log(img);
    let f = {imagen : formData.get('file')};
    console.log(this.b);

    //return this.http.get(this.conexion.urlPublicacion);
    return this.http.post(this.conexion.urlPublicacion +"/imagen/traer",formData, {
          reportProgress: true,
          observe: 'events',
    });
    // return this.http.post(this.conexion.urlPublicacion, {
    //   // "titulo": this.pub.titulo,
    //   // "descripcion": this.pub.descripcion,
    //   // "id_Sector": this.pub.id_Sector,
    //   // "id_Usuario": this.pub.id_Usuario,
    //   // "imagen": img,
    //   formData : f
    // }, {
    //   reportProgress: true,
    //   observe: 'events',
    //   headers: {
    //     //'Content-Type': `multipart/form-data; boundary=${formData.getBoundary()}`,
    //   },
    // });
  }

  buff(ab: ArrayBuffer){
    const text = String.fromCharCode.apply(null, Array.from(new Uint8Array(ab)));
    if (!text) return undefined;
    return JSON.parse(text);
}

  Decodeuint8arr(uint8array) {
    return new TextDecoder("utf-8").decode(uint8array);
  }

}
