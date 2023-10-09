import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ifts6';

  constructor(private router : Router){}

  irInstitucional(){
    this.router.navigate(['/institucional']);
  }
 
}
