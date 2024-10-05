import { Component, EventEmitter, Output } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  imports: [CommonModule, HttpClientModule,  FormsModule],
})
export class RegisterComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';
  successMessage: string = '';

  @Output() registrationSuccess = new EventEmitter<void>();

  constructor(private http: HttpClient) {}

 
  register() {
    const url = 'http://localhost:8080/user/register'; 
    const userData = { username: this.username, password: this.password };

    this.http.post(url, userData).subscribe(
      (response: any) => {
        
        this.successMessage = 'Registrering lyckades! Du kan logga in nu.';
        this.errorMessage = ''; 
        this.registrationSuccess.emit(); 
      },
      (error: any) => {
        console.error('Registreringsfel', error);
        this.errorMessage = 'Ett fel inträffade vid registreringen. Försök igen.'; 
        this.successMessage = ''; 
      }
    );
  }
}
