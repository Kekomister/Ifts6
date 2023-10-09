import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent {
    username: string = '';
    password: string = '';
    message: string = '';

    constructor(private http: HttpClient) {}

    login() {
        this.http.post<any>('http://localhost:3000/login', { username: this.username, password: this.password })
            .subscribe(response => {
                if (response.success) {
                    this.message = 'Inicio de sesión exitoso';
                } else {
                    this.message = 'Credenciales incorrectas';
                }
            });
    }
}
