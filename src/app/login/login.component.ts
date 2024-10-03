import { Component, EventEmitter, Output } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [CommonModule],
})
export class LoginComponent {
  errorMessage: string = '';

  @Output() loginSuccess = new EventEmitter<string>();

  constructor(private http: HttpClient) {}

  login(username: string, password: string) {
    if (username && password) {
      const url = 'http://localhost:8080/user/login'; // URL till din backend
      const userData = { username: username, password: password };

      this.http.post(url, userData).subscribe(
        (response: any) => {
          // Om inloggningen lyckas
          this.loginSuccess.emit(username);
          this.errorMessage = '';
        },
        (error) => {
          // Om inloggningen misslyckas
          this.errorMessage = 'Felaktigt användarnamn eller lösenord.';
          console.error('Login error:', error);
        }
      );
    } else {
      this.errorMessage = 'Vänligen fyll i både användarnamn och lösenord.';
    }
  }
}

