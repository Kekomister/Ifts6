import { Component,  HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';
import { MensajesService } from 'src/app/services/mensajes.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  
  constructor(
    private router : Router, public login : LoginService, 
    private msj : MensajesService
    ){}

  irPagina(pagina : string){
    this.router.navigate(['/' + pagina]);
  }

  ngOnInit(){
    this.login.iniciarConectado();
  }

  @HostListener('window:beforeunload', ['$event'])
  handleClose(e: BeforeUnloadEvent): void {
    //console.log(this.login.getConectado());
    //e.preventDefault();
    //e.returnValue = 'test';
    localStorage.clear();
    localStorage.setItem('Admin', JSON.stringify(this.login.getAdmin().conectado))
    localStorage.setItem('Login', JSON.stringify(this.login.getConectado()));
  }

  async cerrarSesion(){
    let res = await this.msj.preguntar("Cerrar Sesion","Estas seguro de querer salir?","Si","No");
    if(res.isConfirmed){
      this.login.setConectado("",false);
    }
  }
 
}
