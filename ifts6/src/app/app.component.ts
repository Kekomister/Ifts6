import { Component, HostListener, OnDestroy } from '@angular/core';
import { LoginService } from './services/login.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ifts6';

  constructor(public login: LoginService) { }

  ngOnInit(){
    this.login.iniciarConectado();
  }

  @HostListener('window:beforeunload', ['$event'])
  handleClose(e: BeforeUnloadEvent): void {
    //console.log(this.login.getConectado());
    e.preventDefault();
    //e.returnValue = 'test';
    localStorage.clear();
    localStorage.setItem('Login', JSON.stringify(this.login.getConectado()));
  }

}
