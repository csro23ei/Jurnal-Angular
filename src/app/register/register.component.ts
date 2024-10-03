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

  // Method to handle registration
  register() {
    const url = 'http://localhost:8080/user/register'; // Ensure this matches your backend
    const userData = { username: this.username, password: this.password };

    this.http.post(url, userData).subscribe(
      (response: any) => {
        // Always show success message
        this.successMessage = 'Registrering lyckades! Du kan logga in nu.';
        this.errorMessage = ''; // Clear any previous error messages
        this.registrationSuccess.emit(); // Emit success event
      },
      (error: any) => {
        console.error('Registreringsfel', error);
        this.errorMessage = 'Ett fel inträffade vid registreringen. Försök igen.'; // Keep general error message
        this.successMessage = ''; // Clear any previous success messages
      }
    );
  }
}
