import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  @Output() loginSuccess = new EventEmitter<string>(); // Utritning av händelse

  login(username: string, password: string) {
    if (username && password) {
      this.loginSuccess.emit(username); // Emittera händelse med användarnamn
    } else {
      console.log('Vänligen ange användarnamn och lösenord.');
    }
  }
}
