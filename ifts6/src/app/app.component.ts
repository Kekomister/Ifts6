import { Component, HostListener, OnDestroy } from '@angular/core';
import { LoginService } from './services/login.service';
import { MensajesService } from './services/mensajes.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ifts6';

  constructor(public login: LoginService, private msj : MensajesService) { }

  ngOnInit(){
    this.login.iniciarConectado();
  }

  @HostListener('window:beforeunload', ['$event'])
  handleClose(e: BeforeUnloadEvent): void {
    //console.log(this.login.getConectado());
    e.preventDefault();
    //e.returnValue = 'test';
    localStorage.clear();
    localStorage.setItem('Admin', JSON.stringify(this.login.getAdmin().conectado))
    localStorage.setItem('Login', JSON.stringify(this.login.getConectado()));
  }

  async cerrarSesion(){
    let res = await this.msj.preguntar("Cerrar Sesion","Estas seguro de querer salir?","Si","No");
    if(res.isConfirmed){
      this.login.setConectado(false);
    }
  }

}
