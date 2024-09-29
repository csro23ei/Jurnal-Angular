import { Component } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';

@Component({
  standalone: true,
  selector: 'app-root',
  template: `
    <app-login [hidden]="isLoggedIn" (loginSuccess)="onLoginSuccess($event)"></app-login>
    <app-home [hidden]="!isLoggedIn"></app-home>
  `,
  imports: [LoginComponent, HomeComponent]
})
export class AppComponent {
  isLoggedIn = false; // Inloggningsstatus

  onLoginSuccess(username: string) {
    console.log('Du är inloggad!');
    console.log(`Användarnamn: ${username}`);
    this.isLoggedIn = true; // Sätt statusen till inloggad
  }
}
